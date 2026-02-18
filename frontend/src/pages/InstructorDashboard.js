import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/instructor/${user.id}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/courses/${courseId}`);
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete course');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Instructor Dashboard</h1>
        <Link to="/instructor/create-course" className="btn btn-primary">
          Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <h2>You haven't created any courses yet</h2>
          <p>Start by creating your first course!</p>
          <Link to="/instructor/create-course" className="btn btn-primary">
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="dashboard-content">
          <h2>Your Courses ({courses.length})</h2>
          <div className="grid">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-card-content">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-meta">
                    <span>{course.lessons.length} lessons</span>
                    <span>{course.category}</span>
                  </div>
                  <div className="course-actions">
                    <Link to={`/courses/${course.id}`} className="btn btn-secondary btn-sm">
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboard;
