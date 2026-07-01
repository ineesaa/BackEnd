const router = require('express').Router();
const userController = require('../controllers/user.controller');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');

router.get('/me', auth, asyncHandler(userController.me));
router.get('/', auth, asyncHandler(userController.list));
router.get('/:id', auth, asyncHandler(userController.getOne));

module.exports = router;
