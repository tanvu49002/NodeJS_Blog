const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const sortMiddleware = require('./app/middleware/sortMiddleware.js');
const cookieParser = require('cookie-parser');
const appRoot = require('app-root-path');

const path = require('path');
const db = require('./config/db');
const app = express();
const port = 3000;
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000/', // Thay đổi thành địa chỉ trang web của bạn
    credentials: true,
};

//Connect to db
db.connect();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sortMiddleware);
app.use(cookieParser());
const route = require('./routes/index');
app.use(express.static(path.join(__dirname, '/public')));
//http request log
app.use(morgan('combined'));
//template engine
app.engine(
    '.hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: require('./helpers/handlebarshelper.js')
    }),
);
app.set('view engine', '.hbs');
app.set('views', './src/resources/views');
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
app.use(methodOverride('_method'));

route(app);
