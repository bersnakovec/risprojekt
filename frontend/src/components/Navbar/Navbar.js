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
    <nav className="app-nav shadow">
      <div className="nav-inner">
        <Link to="/" className="brand d-flex align-items-center gap-2">
          <span style={{fontSize:'22px'}}>📝</span>
          <span>Tasklist</span>
        </Link>
        {isAuthenticated ? (
          <>
            <div className="nav-links">
              <Link to="/" className={loc.pathname === '/' ? 'active' : ''}><i className="bi bi-house me-1"></i>Home</Link>
              <Link to="/tasks" className={loc.pathname.startsWith('/tasks') ? 'active' : ''}><i className="bi bi-list-check me-1"></i>Tasks</Link>
            </div>
            <div className="nav-user">
              <span className="username">👤 {user?.username}</span>
              <button onClick={handleLogout} className="logout-btn"><i className="bi bi-box-arrow-right me-1"></i>Logout</button>
            </div>
          </>
        ) : (
          <div className="nav-links">
            <Link to="/login" className={loc.pathname === '/login' ? 'active' : ''}><i className="bi bi-person me-1"></i>Login</Link>
            <Link to="/register" className={loc.pathname === '/register' ? 'active' : ''}><i className="bi bi-person-plus me-1"></i>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
