import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CourseList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>All Courses</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="no-courses">
          <p>No courses found. {courses.length === 0 && 'Be the first to create a course!'}</p>
        </div>
      ) : (
        <div className="grid">
          {filteredCourses.map(course => (
            <Link key={course.id} to={`/courses/${course.id}`} className="course-card">
              <div className="course-card-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span className="course-instructor">By {course.instructorName}</span>
                  <span className="course-lessons">{course.lessons.length} lessons</span>
                </div>
                <div className="course-footer">
                  <span className="course-category">{course.category}</span>
                  <span className="course-price">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
