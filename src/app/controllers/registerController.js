const { multipleMongooseToObject } = require('../../util/mongoose');
const bcrypt = require("bcrypt");
const User = require('../models/user');
class RegisterController {
    //[get] /register
    renderRegister(req, res, next) {
        res.render('register', { layout: 'authentication' });
    }
    //[post] /register/storeuser
    async register(req, res, next) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashed;

            const user = new User(req.body);
            user
                .save()
                .then(() => res.redirect('/login'))
                .catch((error) => next(error));
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = new RegisterController();
