const router = require('express').Router();
const controller = require('./bookmarks.controller');
const middleware = require('../middleware/authorization');

router.post('/', controller.addBookmark);
router.delete('/:id', middleware.verifyToken, controller.deleteBookmark);

module.exports = router;