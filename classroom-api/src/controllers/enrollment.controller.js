const enrollmentService = require('../services/enrollment.service');

async function enroll(req, res) {
  const enrollment = await enrollmentService.enroll(req.params.courseId, req.user.id);
  res.status(201).json(enrollment);
}

async function unenroll(req, res) {
  await enrollmentService.unenroll(req.params.courseId, req.user.id);
  res.status(204).send();
}

async function myEnrollments(req, res) {
  const enrollments = await enrollmentService.myEnrollments(req.user.id);
  res.json(enrollments);
}

async function courseEnrollments(req, res) {
  const enrollments = await enrollmentService.courseEnrollments(req.params.courseId, req.user.id);
  res.json(enrollments);
}

async function setGrade(req, res) {
  const { grade, completed } = req.body;
  const enrollment = await enrollmentService.setGrade(
    req.params.id,
    { grade, completed },
    req.user.id,
  );
  res.json(enrollment);
}

module.exports = { enroll, unenroll, myEnrollments, courseEnrollments, setGrade };
