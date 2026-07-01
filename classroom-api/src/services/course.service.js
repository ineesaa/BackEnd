const Course = require('../models/Course');
const AppError = require('../utils/AppError');

async function listAll() {
  return Course.find().populate('teacher', 'name email').sort({ createdAt: -1 });
}

async function getById(id) {
  const course = await Course.findById(id).populate('teacher', 'name email');
  if (!course) throw new AppError('Course not found', 404);

  return course;
}

async function create(data, teacherId) {
  const course = new Course({ ...data, teacher: teacherId });
  await course.save();
  return course;
}

async function update(id, data, user) {
  const course = await Course.findById(id);
  if (!course) throw new AppError('Course not found', 404);

  // only the teacher who owns the course can edit it
  if (course.teacher.toString() !== user.id) {
    throw new AppError('You are not allowed to edit this course', 403);
  }

  Object.assign(course, data);
  await course.save();
  return course;
}

async function remove(id, user) {
  const course = await Course.findById(id);
  if (!course) throw new AppError('Course not found', 404);

  if (course.teacher.toString() !== user.id) {
    throw new AppError('You are not allowed to delete this course', 403);
  }

  await course.deleteOne();
}

module.exports = { listAll, getById, create, update, remove };
