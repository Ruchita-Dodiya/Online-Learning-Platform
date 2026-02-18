import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📚 LearnHub
        </Link>
        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/courses" className="navbar-link">
                Courses
              </Link>
              {user.role === 'instructor' ? (
                <Link to="/instructor/dashboard" className="navbar-link">
                  Instructor Dashboard
                </Link>
              ) : (
                <Link to="/student/dashboard" className="navbar-link">
                  My Courses
                </Link>
              )}
              <span className="navbar-user">Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/courses" className="navbar-link">
                Browse Courses
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
