const { multipleMongooseToObject } = require('../../util/mongoose');
const bcrypt = require("bcrypt");
const User = require('../models/user');
class LogoutController {
    //[post] /logout
    logout(req, res, next) {
        res.clearCookie('refreshtoken');
        res.clearCookie('token');
        res.redirect('/login');
    }
}

module.exports = new LogoutController();
