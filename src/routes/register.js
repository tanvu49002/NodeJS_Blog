var express = require('express');
var router = express.Router();
const registerController = require('../app/controllers/registerController');

router.post('/storeuser', registerController.register);
router.get('/', registerController.renderRegister);


module.exports = router;
