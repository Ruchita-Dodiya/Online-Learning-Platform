import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateCourse.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    price: 0
  });
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    description: '',
    video: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [courseId, setCourseId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLessonChange = (e) => {
    if (e.target.name === 'video') {
      setCurrentLesson({
        ...currentLesson,
        video: e.target.files[0]
      });
    } else {
      setCurrentLesson({
        ...currentLesson,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleAddLesson = () => {
    if (!currentLesson.title) {
      setError('Lesson title is required');
      return;
    }

    setLessons([...lessons, { ...currentLesson, id: Date.now() }]);
    setCurrentLesson({ title: '', description: '', video: null });
    setError('');
  };

  const handleRemoveLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create course
      const courseResponse = await axios.post(`${API_URL}/courses`, formData);
      const newCourseId = courseResponse.data.id;
      setCourseId(newCourseId);

      // Add lessons
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const formDataLesson = new FormData();
        formDataLesson.append('title', lesson.title);
        formDataLesson.append('description', lesson.description || '');
        formDataLesson.append('order', i + 1);
        if (lesson.video) {
          formDataLesson.append('video', lesson.video);
        }

        await axios.post(
          `${API_URL}/courses/${newCourseId}/lessons`,
          formDataLesson,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      alert('Course created successfully!');
      navigate(`/courses/${newCourseId}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Create New Course</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-course-form">
        <div className="card">
          <h2>Course Information</h2>
          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Programming">Programming</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Lessons</h2>
          <div className="lesson-form">
            <div className="form-group">
              <label>Lesson Title *</label>
              <input
                type="text"
                name="title"
                value={currentLesson.title}
                onChange={handleLessonChange}
              />
            </div>
            <div className="form-group">
              <label>Lesson Description</label>
              <textarea
                name="description"
                value={currentLesson.description}
                onChange={handleLessonChange}
              />
            </div>
            <div className="form-group">
              <label>Video File</label>
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleLessonChange}
              />
            </div>
            <button
              type="button"
              onClick={handleAddLesson}
              className="btn btn-secondary"
            >
              Add Lesson
            </button>
          </div>

          {lessons.length > 0 && (
            <div className="lessons-list">
              <h3>Added Lessons ({lessons.length})</h3>
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="lesson-item">
                  <div className="lesson-info">
                    <strong>{index + 1}. {lesson.title}</strong>
                    {lesson.video && (
                      <span className="lesson-video">Video: {lesson.video.name}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLesson(index)}
                    className="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/instructor/dashboard')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCourse;
