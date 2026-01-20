import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import './Tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [usernames, setUsernames] = useState({}); // {taskId: inputValue}
  const [name, setName] = useState('');
  const [dateDue, setDateDue] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [averageTime, setAverageTime] = useState(null);
  const [completionTime, setCompletionTime] = useState('');

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

  useEffect(() => {
    loadTasks();
    loadAverageTime();
  }, [search]); // reload when search changes

  async function loadTasks() {
    setLoading(true); setError(null);
    try {
      const res = await api.get('/tasks', { params: { search } });
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
    const payload = { name: name.trim(), dateDue: dateDue || null, checked: false, completionTimeMinutes: completionTime ? parseInt(completionTime) : null };
    try {
      const res = await api.post('/tasks', payload);
      setTasks((t) => [...t, res.data]);
      setName(''); setDateDue(''); setCompletionTime('');
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
    try { await api.delete(`/tasks/${id}`); setTasks((ts) => ts.filter((t) => t.id !== id)); }
    catch (e) { setError('Could not delete task'); }
  }

  async function handleEdit(task) {
    const newName = window.prompt('Edit task name', task.name);
    if (newName == null) return;
    const newDate = window.prompt('Edit due date (YYYY-MM-DD) or empty', task.dateDue || '');
    try {
      const updated = { ...task, name: newName, dateDue: newDate || null };
      const res = await api.put(`/tasks/${task.id}`, updated);
      setTasks((ts) => ts.map((t) => (t.id === res.data.id ? res.data : t)));
    } catch (e) { setError('Could not edit task'); }
  }

  return (
    <div className="container py-4" style={{maxWidth: '700px'}}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0 text-primary">📝 My Tasks</h3>
        <div className="col-md-5">
          <input
            type="search"
            className="form-control border-primary shadow-sm"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {averageTime !== null && (
        <div className="mb-3 p-2 bg-light rounded border border-info">
          <span className="fw-bold text-info">Average completion time:</span> <span className="text-dark">{averageTime.toFixed(2)} min</span>
        </div>
      )}
      <form className="mb-4" onSubmit={handleAdd}>
        <div className="input-group shadow-sm">
          <input type="text" className="form-control border-success" placeholder="New task" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="date" className="form-control border-success" style={{maxWidth: '180px'}} value={dateDue} onChange={(e) => setDateDue(e.target.value)} />
          <input type="number" className="form-control border-success" style={{maxWidth: '120px'}} placeholder="Time (min)" value={completionTime} onChange={(e) => setCompletionTime(e.target.value)} min="0" />
          <button className="btn btn-success px-4" type="submit">Add</button>
        </div>
      </form>
      {error && <div className="alert alert-danger shadow-sm">{error}</div>}
      {loading ? (
        <div className="text-center text-muted py-4"><span className="spinner-border spinner-border-sm me-2"></span>Loading...</div>
      ) : (
        <ul className="list-group shadow-sm">
          {tasks.length === 0 && <li className="list-group-item text-muted text-center">No tasks yet</li>}
          {tasks.map((t) => (
            <li key={t.id} className={`list-group-item d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 ${t.checked ? 'bg-light' : ''}`}> 
              <div className="d-flex align-items-center gap-3 w-100">
                <input className="form-check-input me-2" type="checkbox" checked={!!t.checked} onChange={() => toggleChecked(t)} />
                <div className="flex-grow-1">
                  <div className={t.checked ? 'text-decoration-line-through text-muted fs-5' : 'fs-5'}>{t.name}</div>
                  <div className="d-flex flex-wrap gap-2 align-items-center mt-1">
                    {t.dateDue && <span className="badge bg-info text-dark">Due: {t.dateDue}</span>}
                    {t.completionTimeMinutes != null && (
                      <span className="badge bg-success">⏱ {t.completionTimeMinutes} min</span>
                    )}
                    {t.checked && <span className="badge bg-secondary">Completed</span>}
                  </div>
                  {/* Show assigned users */}
                  {Array.isArray(t.users) && t.users.length > 0 && (
                    <div className="mt-2">
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
              <div className="btn-group btn-group-sm" role="group">
                <button className="btn btn-outline-primary" onClick={() => handleEdit(t)} title="Edit"><i className="bi bi-pencil"></i> Edit</button>
                <button className="btn btn-outline-danger" onClick={() => handleDelete(t.id)} title="Delete"><i className="bi bi-trash"></i> Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
