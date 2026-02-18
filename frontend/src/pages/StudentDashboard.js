import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(`${API_URL}/enrollments/my-courses`);
      const enrollmentsWithProgress = await Promise.all(
        response.data.map(async (enrollment) => {
          try {
            const progressResponse = await axios.get(
              `${API_URL}/progress/course/${enrollment.courseId}/summary`
            );
            return {
              ...enrollment,
              progress: progressResponse.data
            };
          } catch (error) {
            return {
              ...enrollment,
              progress: null
            };
          }
        })
      );
      setEnrollments(enrollmentsWithProgress);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your courses...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>My Courses</h1>
        <Link to="/courses" className="btn btn-primary">
          Browse All Courses
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <h2>You haven't enrolled in any courses yet</h2>
          <p>Start learning by browsing our course catalog!</p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="dashboard-content">
          <h2>Your Enrolled Courses ({enrollments.length})</h2>
          <div className="grid">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;
              const progress = enrollment.progress;

              return (
                <Link
                  key={enrollment.id}
                  to={`/courses/${course.id}`}
                  className="course-card"
                >
                  <div className="course-card-content">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    {progress && (
                      <div className="progress-section">
                        <div className="progress-header">
                          <span>Progress</span>
                          <span>{progress.progressPercentage}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${progress.progressPercentage}%` }}
                          />
                        </div>
                        <div className="progress-stats">
                          {progress.completedLessons} of {progress.totalLessons} lessons completed
                        </div>
                      </div>
                    )}
                    <div className="course-meta">
                      <span>By {course.instructorName}</span>
                      <span>{course.lessons.length} lessons</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
