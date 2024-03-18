const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../util/mongoose');
const User = require('../models/user');
const Course = require('../models/course');
const bcrypt = require("bcrypt");

class userController {
    //[get] /account
    showAccountDetail(req, res, next) {
        let userId = req.user.userId;
        Promise.all([User.findOne({ _id: userId })])
            .then(([user]) => {
                res.render('accountdetail', {
                    user: mongooseToObject(user),
                });
                // res.json(courses)
            })
            .catch((error) => next(error));
    }
    //[patch] /account/update/:id
    async updateAccount(req, res, next) {
        try {
            const user = await User.findById(req.params.id);
            const { password, ...updatedata } = req.body;
            if (!user) {
                return res.status(404).send('User not found');
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).send('Incorrect password');
            }
            User.updateOne({ _id: req.params.id }, updatedata)
                .then(() => res.redirect('/account?updateSuccess=true'))
                .catch(next);
        } catch (error) {
            next(error);
        }
    }
    //[patch] /account/changepass/:id
    async changePassword(req, res, next) {
        try {
            const user = await User.findById(req.params.id);
            const currentpassword = req.body.currentpass;
            let newpassword = req.body.newpass;
            if (!user) {
                return res.status(404).send('User not found');
            }
            const passwordMatch = await bcrypt.compare(currentpassword, user.password);
            if (!passwordMatch) {
                return res.status(401).send('Incorrect password');
            }
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(newpassword, salt);
            newpassword = hashed;
            User.updateOne({ _id: req.params.id }, { password: newpassword })
                .then(() => res.redirect('/account?updateSuccess=true'))
                .catch(next);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new userController();
