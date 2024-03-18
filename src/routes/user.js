var express = require('express');
var router = express.Router();
const userController = require('../app/controllers/userController');
const verifyMiddleware = require('../app/middleware/verifyMiddleware');
// const { verify } = require('jsonwebtoken');

router.get('/', verifyMiddleware.verifyToken, userController.showAccountDetail);
router.patch('/update/:id', userController.updateAccount);
router.patch('/changepass/:id', userController.changePassword);

module.exports = router;