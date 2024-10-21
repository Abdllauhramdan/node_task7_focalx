const express = require('express');
const Comment = require('../models/Comment');
const Video = require('../models/Video');
const { authMiddleware } = require('./auth');
const router = express.Router();

// إضافة تعليق إلى فيديو
router.post('/:videoId', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const comment = new Comment({
      content,
      video: req.params.videoId,
      user: req.userId
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// جلب جميع التعليقات لفيديو معين
router.get('/:videoId', authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId }).populate('user', 'name');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
