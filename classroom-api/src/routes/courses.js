const router = require('express').Router();
const courseController = require('../controllers/course.controller');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { restrictTo } = require('../middleware/auth');

router.get('/', asyncHandler(courseController.list));
router.get('/:id', asyncHandler(courseController.getOne));

router.post('/', auth, restrictTo('teacher'), asyncHandler(courseController.create));
router.patch('/:id', auth, restrictTo('teacher'), asyncHandler(courseController.update));
router.delete('/:id', auth, restrictTo('teacher'), asyncHandler(courseController.remove));

module.exports = router;