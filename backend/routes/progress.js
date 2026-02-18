const express = require('express');
const { getProgress, saveProgress } = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Update lesson progress
router.post('/', authenticateToken, (req, res) => {
  try {
    const { courseId, lessonId, completed, timeWatched } = req.body;

    if (!courseId || !lessonId) {
      return res.status(400).json({ error: 'Course ID and Lesson ID are required' });
    }

    const progressRecords = getProgress();
    const existingIndex = progressRecords.findIndex(
      p => p.studentId === req.user.id && p.courseId === courseId && p.lessonId === lessonId
    );

    const progressData = {
      studentId: req.user.id,
      courseId,
      lessonId,
      completed: completed || false,
      timeWatched: timeWatched || 0,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      progressRecords[existingIndex] = {
        ...progressRecords[existingIndex],
        ...progressData
      };
    } else {
      progressData.id = Date.now().toString();
      progressData.createdAt = new Date().toISOString();
      progressRecords.push(progressData);
    }

    saveProgress(progressRecords);

    res.json(progressData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get progress for a course
router.get('/course/:courseId', authenticateToken, (req, res) => {
  try {
    const progressRecords = getProgress();
    const courseProgress = progressRecords.filter(
      p => p.studentId === req.user.id && p.courseId === req.params.courseId
    );

    res.json(courseProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get overall progress for a course
router.get('/course/:courseId/summary', authenticateToken, (req, res) => {
  try {
    const { getCourses } = require('../utils/database');
    const courses = getCourses();
    const course = courses.find(c => c.id === req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const progressRecords = getProgress();
    const courseProgress = progressRecords.filter(
      p => p.studentId === req.user.id && p.courseId === req.params.courseId
    );

    const totalLessons = course.lessons.length;
    const completedLessons = courseProgress.filter(p => p.completed).length;
    const progressPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    res.json({
      courseId: req.params.courseId,
      totalLessons,
      completedLessons,
      progressPercentage,
      lessons: course.lessons.map(lesson => {
        const lessonProgress = courseProgress.find(p => p.lessonId === lesson.id);
        return {
          ...lesson,
          completed: lessonProgress?.completed || false,
          timeWatched: lessonProgress?.timeWatched || 0
        };
      })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
