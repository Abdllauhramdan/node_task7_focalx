const express = require('express');
const Course = require('../models/Course');
const { authMiddleware } = require('./auth');
const mongoose = require('mongoose'); 
const router = express.Router();


router.post('/', authMiddleware, async (req, res) => {
  const { title, description, duration } = req.body;
  try {
    const course = new Course({
      title,
      description,
      duration,
      teacher: req.userId,  // يتم تعيين المعلم بناءً على المستخدم الذي قام بتسجيل الدخول
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.userId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, duration } = req.body;
  try {
    let course = await Course.findById(req.params.id);
    if (!course || course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.duration = duration || course.duration;

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Server error'  });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Course ID format' });
    }

    
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course || course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized or course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
