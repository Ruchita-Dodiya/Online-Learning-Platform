import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to LearnHub</h1>
          <p className="hero-subtitle">
            Your gateway to knowledge. Learn from expert instructors and track your progress.
          </p>
          {!user ? (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/courses" className="btn btn-secondary btn-large">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              {user.role === 'instructor' ? (
                <Link to="/instructor/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/student/dashboard" className="btn btn-primary btn-large">
                  My Courses
                </Link>
              )}
              <Link to="/courses" className="btn btn-secondary btn-large">
                Browse All Courses
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="features">
        <div className="container">
          <h2>Why Choose LearnHub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Expert Instructors</h3>
              <p>Learn from industry professionals and experienced educators</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📹</div>
              <h3>Video Lessons</h3>
              <p>High-quality video content to enhance your learning experience</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your learning journey and see how far you've come</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Flexible Learning</h3>
              <p>Learn at your own pace, anytime, anywhere</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
