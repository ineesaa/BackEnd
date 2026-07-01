const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');

async function enroll(courseId, studentId) {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found', 404);

  const count = await Enrollment.countDocuments({ course: courseId });
  if (count >= course.capacity) {
    throw new AppError('Course is full', 400);
  }

  try {
    const enrollment = new Enrollment({ student: studentId, course: courseId });
    await enrollment.save();
    return enrollment;
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('Already enrolled in this course', 409);
    }
    throw err;
  }
}

async function unenroll(courseId, studentId) {
  const enrollment = await Enrollment.findOneAndDelete({
    course: courseId,
    student: studentId,
  });

  if (!enrollment) throw new AppError('Enrollment not found', 404);
}

async function myEnrollments(studentId) {
  return Enrollment.find({ student: studentId }).populate('course');
}

async function courseEnrollments(courseId, teacherId) {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found', 404);

  if (course.teacher.toString() !== teacherId) {
    throw new AppError('You are not allowed to view this data', 403);
  }

  return Enrollment.find({ course: courseId }).populate('student', 'name email');
}

async function setGrade(enrollmentId, { grade, completed }, teacherId) {
  const enrollment = await Enrollment.findById(enrollmentId).populate('course');
  if (!enrollment) throw new AppError('Enrollment not found', 404);

  if (enrollment.course.teacher.toString() !== teacherId) {
    throw new AppError('You are not allowed to grade this enrollment', 403);
  }

  if (grade !== undefined) enrollment.grade = grade;
  if (completed !== undefined) enrollment.completed = completed;

  await enrollment.save();
  return enrollment;
}

module.exports = { enroll, unenroll, myEnrollments, courseEnrollments, setGrade };
