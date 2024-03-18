const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../util/mongoose');
const Course = require('../models/course');
const User = require('../models/user');
class homeController {
    /*async*/ index(req, res, next) {
        let user = req.user;
        Promise.all([Course.find({}), User.findOne({ _id: user.userId })])
            .then(([courses, user]) => {
                res.render('home', {
                    courses: multipleMongooseToObject(courses),
                    user: mongooseToObject(user)
                });
                // res.json(courses)
            })
            .catch((error) => next(error));
        // res.render('home');
    }
    //[GET] /home/search/:keyword
    search(req, res, next) {
        let userId = req.user.userId;
        let keyword = req.query.keyword;
        const sanitizedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        Promise.all([Course.find({ name: { $regex: new RegExp(sanitizedKeyword, 'i') } }), User.findOne({ _id: userId })])
            .then(([courses, user]) => {
                res.render('home', {
                    courses: multipleMongooseToObject(courses),
                    user: mongooseToObject(user)
                });
                // res.json(courses)
            })
            .catch((error) => next(error));
    }
}

module.exports = new homeController();
