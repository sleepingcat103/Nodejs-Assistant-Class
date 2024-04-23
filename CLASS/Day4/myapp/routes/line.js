var express = require('express');
var router = express.Router();
const LineController = require('../controller/lineController');

/* GET users listing. */
router.post('/webhook', LineController.webhook);

module.exports = router;
