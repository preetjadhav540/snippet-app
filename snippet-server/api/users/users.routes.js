const router = require('express').Router();

const controller = require('./users.controllers');

const middleware = require('../middleware/authorization');

router.get('/', controller.getUsers);
router.get('/:id', controller.getUserById);
router.post('/register', controller.registerUser);
router.put('/:id', middleware.verifyToken, controller.updateUser);
router.post('/login', controller.loginUser);
module.exports = router;