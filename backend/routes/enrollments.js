const express = require('express');
const { getEnrollments, saveEnrollments, getCourses } = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Enroll in a course
router.post('/', authenticateToken, (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    const courses = getCourses();
    const course = courses.find(c => c.id === courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const enrollments = getEnrollments();
    const existingEnrollment = enrollments.find(
      e => e.studentId === req.user.id && e.courseId === courseId
    );

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    const newEnrollment = {
      id: Date.now().toString(),
      studentId: req.user.id,
      courseId,
      enrolledAt: new Date().toISOString()
    };

    enrollments.push(newEnrollment);
    saveEnrollments(enrollments);

    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's enrollments
router.get('/my-courses', authenticateToken, (req, res) => {
  try {
    const enrollments = getEnrollments();
    const courses = getCourses();
    
    const studentEnrollments = enrollments
      .filter(e => e.studentId === req.user.id)
      .map(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId);
        return {
          ...enrollment,
          course: course || null
        };
      })
      .filter(e => e.course !== null);

    res.json(studentEnrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if student is enrolled
router.get('/check/:courseId', authenticateToken, (req, res) => {
  try {
    const enrollments = getEnrollments();
    const isEnrolled = enrollments.some(
      e => e.studentId === req.user.id && e.courseId === req.params.courseId
    );

    res.json({ isEnrolled });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
