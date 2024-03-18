var express = require('express');
var router = express.Router();
const homeController = require('../app/controllers/homeController');
const verifyMiddleware = require('../app/middleware/verifyMiddleware');
// const { verify } = require('jsonwebtoken');

router.get('/', verifyMiddleware.verifyToken, homeController.index);
router.get('/search', verifyMiddleware.verifyToken, homeController.search)

module.exports = router;