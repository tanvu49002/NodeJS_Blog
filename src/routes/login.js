var express = require('express');
var router = express.Router();
const loginController = require('../app/controllers/loginController');

router.post('/authen', loginController.login);
router.get('/', loginController.renderLogin);
router.post('/refresh', loginController.refreshToken)
module.exports = router;
