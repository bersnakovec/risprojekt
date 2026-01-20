import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import FileUpload from '../FileUpload/FileUpload';
import './Tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [usernames, setUsernames] = useState({}); // {taskId: inputValue}
  const [expandedTaskId, setExpandedTaskId] = useState(null); // Track which task's files are shown

  // Form fields
  const [name, setName] = useState('');
  const [dateDue, setDateDue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [complexity, setComplexity] = useState('');
  const [category, setCategory] = useState('');
  const [completionTime, setCompletionTime] = useState('');

  // Search and filter states
  const [search, setSearch] = useState('');
  const [filterComplexity, setFilterComplexity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [averageTime, setAverageTime] = useState(null);

  // Add user to a task
  async function handleAddUser(taskId) {
    const username = usernames[taskId];
    if (!username || !username.trim()) return;
    try {
      const res = await api.post(`/tasks/${taskId}/addUser`, null, { params: { username: username.trim() } });
      setTasks((ts) => ts.map((t) => (t.id === res.data.id ? res.data : t)));
      setUsernames((prev) => ({ ...prev, [taskId]: '' }));
    } catch (e) {
      setError('Could not add user');
    }
  }

  // Remove user from a task
  async function handleRemoveUser(taskId, username) {
    try {
      const res = await api.post(`/tasks/${taskId}/removeUser`, null, { params: { username } });
      setTasks((ts) => ts.map((t) => (t.id === res.data.id ? res.data : t)));
    } catch (e) {
      setError('Could not remove user');
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadTasks();
    loadAverageTime();
  }, [search, filterComplexity, filterCategory]); // reload when filters change

  async function loadTasks() {
    setLoading(true); setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterComplexity) params.complexity = filterComplexity;
      if (filterCategory) params.category = filterCategory;
      const res = await api.get('/tasks', { params });
      setTasks(res.data || []);
    } catch (e) {
      setError('Could not load tasks');
    } finally { setLoading(false); }
  }

  async function loadAverageTime() {
    try {
      const res = await api.get('/tasks/average-completion-time');
      setAverageTime(res.data);
    } catch (e) {
      setAverageTime(null);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const payload = {
      name: name.trim(),
      dateDue: dateDue || null,
      checked: false,
      startDate: startDate || null,
      startTime: startTime || null,
      endDate: endDate || null,
      endTime: endTime || null,
      complexity: complexity || null,
      category: category.trim() || null,
      completionTimeMinutes: completionTime ? parseInt(completionTime) : null
    };
    try {
      const res = await api.post('/tasks', payload);
      setTasks((t) => [...t, res.data]);
      setName(''); setDateDue(''); setStartDate(''); setStartTime('');
      setEndDate(''); setEndTime(''); setComplexity(''); setCategory(''); setCompletionTime('');
    } catch (e) { setError('Could not create task'); }
  }

  async function toggleChecked(task) {
    try {
      const updated = { ...task, checked: !task.checked };
      const res = await api.put(`/tasks/${task.id}`, updated);
      setTasks((ts) => ts.map((t) => (t.id === res.data.id ? res.data : t)));
      await loadAverageTime(); // Refresh average completion time after checking
    } catch (e) { setError('Could not update task'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((ts) => ts.filter((t) => t.id !== id));
      await loadAverageTime(); // Refresh after delete
    } catch (e) { setError('Could not delete task'); }
  }

  async function handleEdit(task) {
    const newName = window.prompt('Edit task name', task.name);
    if (newName == null) return;
    const newDate = window.prompt('Edit due date (YYYY-MM-DD) or empty', task.dateDue || '');
    const newStartDate = window.prompt('Edit start date (YYYY-MM-DD) or empty', task.startDate || '');
    const newStartTime = window.prompt('Edit start time (HH:MM) or empty', task.startTime || '');
    const newEndDate = window.prompt('Edit end date (YYYY-MM-DD) or empty', task.endDate || '');
    const newEndTime = window.prompt('Edit end time (HH:MM) or empty', task.endTime || '');
    const newComplexity = window.prompt('Edit complexity (LOW, MEDIUM, HIGH, CRITICAL) or empty', task.complexity || '');
    const newCategory = window.prompt('Edit category or empty', task.category || '');
    const newCompletionTime = window.prompt('Edit completion time (minutes) or empty', task.completionTimeMinutes || '');
    try {
      const updated = {
        ...task,
        name: newName,
        dateDue: newDate || null,
        startDate: newStartDate || null,
        startTime: newStartTime || null,
        endDate: newEndDate || null,
        endTime: newEndTime || null,
        complexity: newComplexity || null,
        category: newCategory || null,
        completionTimeMinutes: newCompletionTime ? parseInt(newCompletionTime) : null
      };
      const res = await api.put(`/tasks/${task.id}`, updated);
      setTasks((ts) => ts.map((t) => (t.id === res.data.id ? res.data : t)));
    } catch (e) { setError('Could not edit task'); }
  }

  function toggleFiles(taskId) {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Tasks</h3>
        {averageTime !== null && (
          <div className="alert alert-info mb-0 py-2">
            <strong>Average Completion Time:</strong> {averageTime.toFixed(1)} minutes
          </div>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="search"
                className="form-control"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterComplexity}
                onChange={(e) => setFilterComplexity(e.target.value)}
              >
                <option value="">All Complexities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Filter by category..."
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-secondary w-100"
                onClick={() => { setSearch(''); setFilterComplexity(''); setFilterCategory(''); }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      <form className="mb-3" onSubmit={handleAdd}>
        <div className="card">
          <div className="card-header">
            <strong>Add New Task</strong>
          </div>
          <div className="card-body">
            <div className="row g-2 mb-2">
              <div className="col-md-5">
                <input type="text" className="form-control" placeholder="Task name *" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="col-md-2">
                <input type="date" className="form-control" placeholder="Due date" value={dateDue} onChange={(e) => setDateDue(e.target.value)} />
              </div>
              <div className="col-md-2">
                <input type="text" className="form-control" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className="col-md-3">
                <input type="number" className="form-control" placeholder="Completion time (min)" value={completionTime} onChange={(e) => setCompletionTime(e.target.value)} />
              </div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-3">
                <label className="form-label small mb-0">Start Date</label>
                <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small mb-0">Start Time</label>
                <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small mb-0">End Date</label>
                <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small mb-0">End Time</label>
                <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
            <div className="row g-2">
              <div className="col-md-3">
                <select className="form-select" value={complexity} onChange={(e) => setComplexity(e.target.value)}>
                  <option value="">Select Complexity</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div className="col-md-9 d-flex align-items-end">
                <button className="btn btn-success" type="submit">Add Task</button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="list-group">
          {tasks.length === 0 && <li className="list-group-item text-muted">No tasks yet</li>}
          {tasks.map((t) => (
            <li key={t.id} className="list-group-item">
              <div className="d-flex align-items-center gap-3">
                <input className="form-check-input me-2" type="checkbox" checked={!!t.checked} onChange={() => toggleChecked(t)} />
                <div className="flex-grow-1">
                  <div className={t.checked ? 'text-decoration-line-through text-muted' : ''}>
                    <strong>{t.name}</strong>
                    {t.complexity && (
                      <span className={`badge ms-2 ${
                        t.complexity === 'CRITICAL' ? 'bg-danger' :
                        t.complexity === 'HIGH' ? 'bg-warning text-dark' :
                        t.complexity === 'MEDIUM' ? 'bg-info' : 'bg-success'
                      }`}>
                        {t.complexity}
                      </span>
                    )}
                    {t.category && <span className="badge bg-secondary ms-2">{t.category}</span>}
                    {t.completionTimeMinutes && (
                      <span className="badge bg-light text-dark ms-2">
                        {t.completionTimeMinutes} min
                      </span>
                    )}
                  </div>
                  <small className="text-muted d-block">
                    {t.dateDue && <span>Due: {t.dateDue}</span>}
                    {(t.startDate || t.startTime) && (
                      <span className="ms-2">
                        Start: {t.startDate || ''} {t.startTime || ''}
                      </span>
                    )}
                    {(t.endDate || t.endTime) && (
                      <span className="ms-2">
                        End: {t.endDate || ''} {t.endTime || ''}
                      </span>
                    )}
                  </small>
                  {/* Show assigned users */}
                  {Array.isArray(t.users) && t.users.length > 0 && (
                    <div className="mt-1">
                      <span className="fw-bold">Assigned users:</span>
                      {t.users.map((u) => (
                        <span key={u.id} className="badge bg-secondary ms-1">
                          {u.username}
                          <button type="button" className="btn btn-sm btn-light ms-1" style={{padding: '0 4px'}} onClick={() => handleRemoveUser(t.id, u.username)} title="Remove user">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Add user form */}
                  <div className="input-group input-group-sm mt-2" style={{maxWidth: '260px'}}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add user by username"
                      value={usernames[t.id] || ''}
                      onChange={(e) => setUsernames((prev) => ({ ...prev, [t.id]: e.target.value }))}
                    />
                    <button className="btn btn-outline-success" type="button" onClick={() => handleAddUser(t.id)}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="btn-group btn-group-sm float-end" role="group">
                <button className="btn btn-primary" onClick={() => handleEdit(t)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                <button className="btn btn-info" onClick={() => toggleFiles(t.id)}>
                  {expandedTaskId === t.id ? 'Hide Files' : 'Files'}
                </button>
              </div>
              {/* File Upload Section */}
              {expandedTaskId === t.id && (
                <div className="mt-3">
                  <FileUpload taskId={t.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
