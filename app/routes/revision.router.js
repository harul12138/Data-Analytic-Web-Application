var express = require('express');
var router = express.Router();

var overall_controller = require('../controllers/overall.controller')
var user_controller = require('../controllers/user.controller')
var ind_controller = require('../controllers/indi.controller')

router.get('/', overall_controller.overall)
router.get('/individual/:title',ind_controller.individual)
router.post('/individual/userDistribution/:title&:user&:random',user_controller.user)

module.exports = router;
