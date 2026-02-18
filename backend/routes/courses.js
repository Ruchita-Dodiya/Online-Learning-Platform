const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getCourses, saveCourses } = require('../utils/database');
const { authenticateToken, requireInstructor } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/videos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|ogg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

// Get all courses
router.get('/', (req, res) => {
  try {
    const courses = getCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course by ID
router.get('/:id', (req, res) => {
  try {
    const courses = getCourses();
    const course = courses.find(c => c.id === req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get courses by instructor
router.get('/instructor/:instructorId', (req, res) => {
  try {
    const courses = getCourses();
    const instructorCourses = courses.filter(c => c.instructorId === req.params.instructorId);
    res.json(instructorCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create course (Instructor only)
router.post('/', authenticateToken, requireInstructor, (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const courses = getCourses();
    const newCourse = {
      id: uuidv4(),
      title,
      description,
      category: category || 'General',
      price: price || 0,
      instructorId: req.user.id,
      instructorName: req.user.name || 'Unknown',
      lessons: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    courses.push(newCourse);
    saveCourses(courses);

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course (Instructor only)
router.put('/:id', authenticateToken, requireInstructor, (req, res) => {
  try {
    const courses = getCourses();
    const courseIndex = courses.findIndex(c => c.id === req.params.id);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (courses[courseIndex].instructorId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own courses' });
    }

    const { title, description, category, price } = req.body;
    courses[courseIndex] = {
      ...courses[courseIndex],
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(price !== undefined && { price }),
      updatedAt: new Date().toISOString()
    };

    saveCourses(courses);
    res.json(courses[courseIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add lesson to course (Instructor only)
router.post('/:id/lessons', authenticateToken, requireInstructor, upload.single('video'), (req, res) => {
  try {
    const courses = getCourses();
    const courseIndex = courses.findIndex(c => c.id === req.params.id);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (courses[courseIndex].instructorId !== req.user.id) {
      return res.status(403).json({ error: 'You can only add lessons to your own courses' });
    }

    const { title, description, order } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Lesson title is required' });
    }

    const videoUrl = req.file ? `/uploads/videos/${req.file.filename}` : null;

    const newLesson = {
      id: uuidv4(),
      title,
      description: description || '',
      videoUrl,
      order: order || courses[courseIndex].lessons.length + 1,
      createdAt: new Date().toISOString()
    };

    courses[courseIndex].lessons.push(newLesson);
    courses[courseIndex].updatedAt = new Date().toISOString();
    saveCourses(courses);

    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete course (Instructor only)
router.delete('/:id', authenticateToken, requireInstructor, (req, res) => {
  try {
    const courses = getCourses();
    const courseIndex = courses.findIndex(c => c.id === req.params.id);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (courses[courseIndex].instructorId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own courses' });
    }

    courses.splice(courseIndex, 1);
    saveCourses(courses);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
