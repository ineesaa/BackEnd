const router = require('express').Router();
const enrollmentController = require('../controllers/enrollment.controller');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { restrictTo } = require('../middleware/auth');

// student endpoints
router.get('/me', auth, restrictTo('student'), asyncHandler(enrollmentController.myEnrollments));
router.post(
  '/courses/:courseId',
  auth,
  restrictTo('student'),
  asyncHandler(enrollmentController.enroll),
);
router.delete(
  '/courses/:courseId',
  auth,
  restrictTo('student'),
  asyncHandler(enrollmentController.unenroll),
);

// teacher endpoints
router.get(
  '/courses/:courseId',
  auth,
  restrictTo('teacher'),
  asyncHandler(enrollmentController.courseEnrollments),
);
router.patch(
  '/:id',
  auth,
  restrictTo('teacher'),
  asyncHandler(enrollmentController.setGrade),
);

module.exports = router;
