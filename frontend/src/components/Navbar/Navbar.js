import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar(){
  const loc = useLocation();
  return (
    <nav className="app-nav">
      <div className="nav-inner">
        <Link to="/" className="brand">Tasklist</Link>
        <div className="nav-links">
          <Link to="/" className={loc.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/tasks" className={loc.pathname.startsWith('/tasks') ? 'active' : ''}>Tasks</Link>
        </div>
      </div>
    </nav>
  );
}
