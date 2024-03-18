const jwt = require('jsonwebtoken');
const verifyMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.cookies.token;
        if (token) {
            jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    res.redirect('/login');
                } else {
                    req.user = user;
                    next();
                }
            });
        } else {
            res.redirect('/login');
        }
    },
    // verifyTokenAndAdminAuth: (res, req, next) => {
    //     verifyMiddleware.verifyToken(req, res, () => {
    //         if (req.user.isAdmin) {
    //             next();
    //         } else {
    //             res.status(403).json("Token is not valid");
    //         }
    //     })
    // }
}

module.exports = verifyMiddleware; 