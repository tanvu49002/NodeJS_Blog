sortMiddleware = (req, res, next) => {
    res.locals.sort = {
        enable: false,
        type: 'default',
    }
    if (req.query.hasOwnProperty('sort')) {
        res.locals.sort.enable = true
        const isValidtype = ['asc', 'desc'].includes(req.query.type)
        if (!isValidtype) {
            req.query.type = 'desc'
        }
        res.locals.sort.type = req.query.type
        res.locals.sort.column = req.query.column

    }
    next()
}
module.exports = sortMiddleware; 