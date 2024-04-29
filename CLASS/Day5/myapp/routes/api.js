var express = require('express');
var router = express.Router();
const ApiController = require('../controller/apiController');

/* GET users listing. */
router.get('/:userId', ApiController.getUser);
router.post('/conversation', ApiController.conversation);
router.post('/getAnswerpack', ApiController.getAnswerpack);
router.post('/conversationLog', ApiController.conversationLog);
// router.head('/:userId', ApiController.getUser);
// router.delete('/:userId', ApiController.getUser);
// router.options('/:userId', ApiController.getUser);
// router.patch('/:userId', ApiController.getUser);

module.exports = router;

