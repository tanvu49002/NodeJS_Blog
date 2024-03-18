const newRoute = require('./news');
const courseRoute = require('./courses');
const loginRoute = require('./login');
const registerRoute = require('./register');
const homeRoute = require('./home');
const logoutRoute = require('./logout');
const accountRoute = require('./user')

function route(app) {
    app.use('/home', homeRoute)
    app.use('/', homeRoute);
    app.use('/account', accountRoute)
    app.use('/news', newRoute);
    app.use('/course', courseRoute);
    app.use('/login', loginRoute);
    app.use('/register', registerRoute);
    app.use('/logout', logoutRoute);

}
module.exports = route;
