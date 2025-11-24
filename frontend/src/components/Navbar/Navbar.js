import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar(){
  const loc = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="app-nav">
      <div className="nav-inner">
        <Link to="/" className="brand">Tasklist</Link>
        {isAuthenticated ? (
          <>
            <div className="nav-links">
              <Link to="/" className={loc.pathname === '/' ? 'active' : ''}>Home</Link>
              <Link to="/tasks" className={loc.pathname.startsWith('/tasks') ? 'active' : ''}>Tasks</Link>
            </div>
            <div className="nav-user">
              <span className="username">Welcome, {user?.username}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </>
        ) : (
          <div className="nav-links">
            <Link to="/login" className={loc.pathname === '/login' ? 'active' : ''}>Login</Link>
            <Link to="/register" className={loc.pathname === '/register' ? 'active' : ''}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
