const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
// app.use(cors());
// const cors = require('cors');
app.use(cors({ origin: '*' })); // allow all origins (for testing)


// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});


//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
// app.use('/', require('./routes/root'));
app.use('^/register$', require('./routes/register'));
app.use('/', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// app.use(verifyJWT);
app.use('/info', require('./routes/info'))
app.use('/about', require('./routes/about'))
app.use('/history', require('./routes/history'))
app.use('/profile(.html)?', require('./routes/profile'))
app.use('/savesearch', require('./routes/saveSearch'))
app.use('/home', require('./routes/home'));
app.use('/scanner', require('./routes/scanner'));
app.use('/product-info(.html)?', require('./routes/productinfo'))
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});
   
app.use(errorHandler);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, '0.0.0.0', () => console.log("Running on 0.0.0.0:3500"));
