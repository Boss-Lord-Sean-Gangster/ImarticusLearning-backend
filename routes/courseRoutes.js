// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById, updateCourse } = require('../controllers/courseController');

// POST request to create a course
router.post('/', createCourse);

// GET request to fetch all courses
router.get('/', getCourses);

// GET request to fetch a course by ID
router.get('/:id', getCourseById);

// PUT request to update a course by ID
router.put('/:id', updateCourse);

module.exports = router;
