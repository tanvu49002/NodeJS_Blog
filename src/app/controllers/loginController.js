const { multipleMongooseToObject } = require('../../util/mongoose');
const bcrypt = require("bcrypt");
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
class LoginController {
    //[get] /login
    renderLogin(req, res, next) {
        res.render('login', { layout: 'authentication' });
    }
    //[post] /login/authen
    async login(req, res, next) {
        try {
            const user = await User.findOne({
                username: req.body.username
            })
            if (!user) {
                res.status(404).json("Wrong Username!");
                return
            }
            const ValidPassword = await bcrypt.compare(req.body.password, user.password);
            if (!ValidPassword) {
                res.status(404).json("Wrong Password!");
                return
            }
            if (user && ValidPassword) {
                const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_ACCESS_KEY, { expiresIn: '30d' });
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: false
                })
                // const refreshToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_REFRESH_KEY, { expiresIn: '365d' });
                // res.cookie("refreshtoken", refreshToken, {
                //     httpOnly: true,
                //     sameSite: "strict",
                //     secure: false
                // })
                // const { password, ...orthers } = user._doc;
                res.redirect('/home');
            }

        } catch (err) {
            res.status(500).json(err);
        }
    }
    //[post] /login/refresh
    refreshToken(req, res, next) {
        const refreshToken = req.cookies.refreshtoken;
        if (!refreshToken) {
            res.status(401).json('you are not authenticated');
        } else {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
                if (err) {
                    res.status(403).json("Token is not valid");
                } else {
                    const newAccessToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_ACCESS_KEY, { expiresIn: '30s' });
                    res.cookie("token", newAccessToken, {
                        httpOnly: true,
                        sameSite: "strict",
                        secure: false
                    })
                    const newRefreshToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_REFRESH_KEY, { expiresIn: '365d' });
                    res.cookie("refreshtoken", newRefreshToken, {
                        httpOnly: true,
                        sameSite: "strict",
                        secure: false
                    })
                    res.status(200).json({ accessToken: newAccessToken })
                }
            })
        }
    }
}

module.exports = new LoginController();
