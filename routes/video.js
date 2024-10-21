const express = require('express');
const Video = require('../models/Video');
const Course = require('../models/Course');
const { authMiddleware } = require('./auth');
const router = express.Router();

// إضافة فيديو إلى كورس
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, courseId } = req.body;  
  try {
    
    const video = new Video({
      title,
      description,
      course: courseId,  
      teacher: req.userId,  
    });
    await video.save();
    res.status(201).json(video);  
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// جلب جميع الفيديوهات لكورس معين
router.get('/:courseId', authMiddleware, async (req, res) => {
  try {
    const videos = await Video.find({ course: req.params.courseId });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// تعديل فيديو
router.put('/:videoId', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    let video = await Video.findById(req.params.videoId).populate('course');
    if (!video || video.course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    video.title = title || video.title;
    video.description = description || video.description;

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// حذف فيديو
router.delete('/:videoId', authMiddleware, async (req, res) => {
  try {
    let video = await Video.findById(req.params.videoId).populate('course');
    if (!video || video.course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await video.remove();
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
