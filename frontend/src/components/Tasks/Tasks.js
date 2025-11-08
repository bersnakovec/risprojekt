import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import './Tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('');
  const [dateDue, setDateDue] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { loadTasks(); }, [search]); // reload when search changes

  async function loadTasks() {
    setLoading(true); setError(null);
    try {
      const res = await api.get('/tasks', { params: { search } });
      setTasks(res.data || []);
    } catch (e) {
      setError('Could not load tasks');
    } finally { setLoading(false); }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const payload = { name: name.trim(), dateDue: dateDue || null, checked: false };
    try {
      const res = await api.post('/tasks', payload);
      setTasks((t) => [...t, res.data]);
      setName(''); setDateDue('');
    } catch (e) { setError('Could not create task'); }
  }

  async function toggleChecked(task) {
    try {
      const updated = { ...task, checked: !task.checked };
      const res = await api.put(`/tasks/${task.id}`, updated);
      setTasks((ts) => ts.map((t) => (t.id === res.data.id ? res.data : t)));
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
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Tasks</h3>
        <div className="col-md-4">
          <input
            type="search"
            className="form-control"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <form className="mb-3" onSubmit={handleAdd}>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="New task" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="date" className="form-control" style={{maxWidth: '180px'}} value={dateDue} onChange={(e) => setDateDue(e.target.value)} />
          <button className="btn btn-success" type="submit">Add</button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="list-group">
          {tasks.length === 0 && <li className="list-group-item text-muted">No tasks yet</li>}
          {tasks.map((t) => (
            <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <input className="form-check-input me-2" type="checkbox" checked={!!t.checked} onChange={() => toggleChecked(t)} />
                <div>
                  <div className={t.checked ? 'text-decoration-line-through text-muted' : ''}>{t.name}</div>
                  <small className="text-muted">{t.dateDue || ''}</small>
                </div>
              </div>
              <div className="btn-group btn-group-sm" role="group">
                <button className="btn btn-primary" onClick={() => handleEdit(t)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
