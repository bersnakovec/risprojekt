import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';
import './Landing.css';

export default function Landing() {
  const [upcoming, setUpcoming] = useState([]);
  const [efficiency, setEfficiency] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      const tasks = res.data || [];

      const withDates = tasks.filter((t) => t.dateDue && !t.checked);
      withDates.sort((a, b) => new Date(a.dateDue) - new Date(b.dateDue));
      setUpcoming(withDates.slice(0, 3));

      const total = tasks.length;
      const done = tasks.filter((t) => t.checked).length;
      setEfficiency(total === 0 ? 0 : Math.round((done / total) * 100));
    } catch (e) {
      setUpcoming([]);
      setEfficiency(0);
    } finally {
      setLoading(false);
    }
  }

  const userName = 'User';

  return (
    <>
      <div className="landing-hero">
        <div className="hero-inner">
          <h1 className="mb-3 text-primary">Welcome, {userName}!</h1>
          <p className="lead">Stay organized and boost your productivity with <span className="fw-bold text-info">Tasklist</span>.</p>
          <Link to="/tasks" className="cta btn btn-lg shadow">Go to My Tasks</Link>
        </div>
      </div>
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <h2 className="mb-3 text-dark">Your Progress Overview</h2>
            <p className="text-muted">See your next deadlines and how efficiently you're completing tasks.</p>
          </div>
          <div className="col-lg-5">
            <div className="card shadow-sm border-info">
              <div className="card-body">
                <h5 className="card-title text-info">Efficiency</h5>
                <div className="progress mb-3" style={{height: '18px'}}>
                  <div className="progress-bar bg-success" role="progressbar" style={{width: `${efficiency}%`}} aria-valuenow={efficiency} aria-valuemin="0" aria-valuemax="100">{efficiency}%</div>
                </div>
                <h6 className="card-subtitle mb-2 text-muted">Upcoming tasks</h6>
                {loading ? (
                  <p>Loading...</p>
                ) : upcoming.length === 0 ? (
                  <p className="text-muted">No upcoming tasks</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {upcoming.map((t) => (
                      <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold">{t.name}</div>
                          <small className="text-muted">Due: {t.dateDue}</small>
                        </div>
                        <div className={`badge ${t.checked ? 'bg-success' : 'bg-secondary'}`}>{t.checked ? 'Done' : 'Not done yet'}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
