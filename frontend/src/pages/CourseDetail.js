import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ReactPlayer from 'react-player';
import './CourseDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
    if (user) {
      checkEnrollment();
      fetchProgress();
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/${id}`);
      setCourse(response.data);
      if (response.data.lessons.length > 0) {
        setSelectedLesson(response.data.lessons[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await axios.get(`${API_URL}/enrollments/check/${id}`);
      setIsEnrolled(response.data.isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const fetchProgress = async () => {
    if (!user || !isEnrolled) return;
    try {
      const response = await axios.get(`${API_URL}/progress/course/${id}/summary`);
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${API_URL}/enrollments`, { courseId: id });
      setIsEnrolled(true);
      fetchProgress();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to enroll');
    }
  };

  const handleLessonComplete = async () => {
    if (!selectedLesson || !isEnrolled) return;

    try {
      await axios.post(`${API_URL}/progress`, {
        courseId: id,
        lessonId: selectedLesson.id,
        completed: true
      });
      fetchProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading course...</div>;
  }

  if (!course) {
    return <div className="container">Course not found</div>;
  }

  const isInstructor = user && user.role === 'instructor' && user.id === course.instructorId;
  const canAccessContent = isEnrolled || isInstructor;

  return (
    <div className="course-detail">
      <div className="course-header">
        <div className="container">
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <div className="course-info">
            <span>By {course.instructorName}</span>
            <span>•</span>
            <span>{course.lessons.length} lessons</span>
            <span>•</span>
            <span>{course.category}</span>
          </div>
          {!canAccessContent && (
            <button onClick={handleEnroll} className="btn btn-primary btn-enroll">
              {user ? 'Enroll Now' : 'Login to Enroll'}
            </button>
          )}
          {progress && (
            <div className="progress-summary">
              <div className="progress-info">
                <span>Progress: {progress.completedLessons} / {progress.totalLessons} lessons</span>
                <span>{progress.progressPercentage}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress.progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="course-content">
        <div className="container course-layout">
          <div className="lessons-sidebar">
            <h2>Lessons</h2>
            {course.lessons.length === 0 ? (
              <p className="no-lessons">No lessons available yet</p>
            ) : (
              <ul className="lesson-list">
                {course.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson, index) => {
                    const lessonProgress = progress?.lessons?.find(l => l.id === lesson.id);
                    const isCompleted = lessonProgress?.completed || false;
                    const isSelected = selectedLesson?.id === lesson.id;

                    return (
                      <li
                        key={lesson.id}
                        className={`lesson-item ${isSelected ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        <div className="lesson-number">{index + 1}</div>
                        <div className="lesson-info">
                          <div className="lesson-title">{lesson.title}</div>
                          {isCompleted && <span className="lesson-check">✓</span>}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>

          <div className="lesson-player">
            {selectedLesson ? (
              <div className="player-container">
                <h2>{selectedLesson.title}</h2>
                {selectedLesson.description && (
                  <p className="lesson-description">{selectedLesson.description}</p>
                )}
                {selectedLesson.videoUrl ? (
                  <div className="video-wrapper">
                    <ReactPlayer
                      url={`http://localhost:5000${selectedLesson.videoUrl}`}
                      controls
                      width="100%"
                      height="100%"
                      onProgress={(state) => {
                        if (canAccessContent && state.playedSeconds > 0) {
                          axios.post(`${API_URL}/progress`, {
                            courseId: id,
                            lessonId: selectedLesson.id,
                            timeWatched: state.playedSeconds
                          }).catch(console.error);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="no-video">
                    <p>Video not available</p>
                  </div>
                )}
                {canAccessContent && selectedLesson && (
                  <button
                    onClick={handleLessonComplete}
                    className="btn btn-success btn-complete"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            ) : (
              <div className="no-lesson-selected">
                <p>Select a lesson to start learning</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
