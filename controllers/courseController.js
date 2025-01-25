const Course = require("../models/Course");

// Create Course
const createCourse = async (req, res) => {
  const {
    title,
    description,
    author,
    duration,
    price,
    ratings,
    enrollments,
    image,
    curriculum,
    instructor,
    faqs,
    videos,
    documents,
  } = req.body;

  const newCourse = new Course({
    title,
    description,
    author,
    duration,
    price,
    ratings,
    enrollments,
    image,
    curriculum,
    instructor,
    faqs,
    videos,
    documents,
  });

  try {
    await newCourse.save();
    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (err) {
    res.status(500).json({ message: "Failed to create course", error: err });
  }
};

// Get all Courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses", error: err });
  }
};

// Get Course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch course", error: err });
  }
};

// Update Course
const updateCourse = async (req, res) => {
  const {
    title,
    description,
    author,
    duration,
    price,
    ratings,
    enrollments,
    image,
    curriculum,
    instructor,
    faqs,
    videos,
    documents,
  } = req.body;

  try {
    // Find the course by ID
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the course fields with new data
    if (title) course.title = title;
    if (description) course.description = description;
    if (author) course.author = author;
    if (duration) course.duration = duration;
    if (price) course.price = price;
    if (ratings) course.ratings = ratings;
    if (enrollments) course.enrollments = enrollments;
    if (image) course.image = image;
    if (curriculum) course.curriculum = curriculum;
    if (instructor) course.instructor = instructor;
    if (faqs) course.faqs = faqs;
    if (videos) course.videos = videos; // Add or remove videos
    if (documents) course.documents = documents;

    // Save the updated course
    await course.save();

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (err) {
    res.status(500).json({ message: "Failed to update course", error: err });
  }
};

module.exports = { createCourse, getCourses, getCourseById, updateCourse };
