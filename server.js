const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')


// connect to the db
mongoose.connect('mongodb://localhost/booksapp', {useNewUrlParser: true, useUnifiedTopology: true})
// check db connection
mongoose.connection.once('open', () => {
    console.log('connection to the database has been established')
}).on('error', (error) => console.log(error))

// localStrategy
require('./config/passport-local')(passport)


// express app
const app = express()

//ejs set up
app.set('view engine', 'ejs')

// serve static files
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/users', express.static(path.join(__dirname, 'public')))

// body parser middleware
app.use( express.urlencoded({extended: false}) )

// express session
app.use( session({
    secret: 'my secret',
    resave: true,
    saveUninitialized: true
}) )

// connect flash
app.use(flash())

// global variables
app.use( (req, res, next) => {
    res.locals.error_msg = req.flash('error_msg')
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error = req.flash('error')
    next()
} )

// passport middleware
app.use( passport.initialize() )
app.use( passport.session() )

// method override middleware
app.use( methodOverride('newMethod') )

// routes handlers
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

// create a port
const port = process.env.port || 5000

// listen for requests
app.listen(port, () => console.log(`Now Listening for requests on localhost:${port}`))