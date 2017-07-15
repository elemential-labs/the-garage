const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const swig = require('swig')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const config = require('./config')
const io = require('socket.io')()

const app = express()

// Mongoose setup
mongoose.connect(config.mongo.host)

// Socket.io setup
app.io = io

// view engine setup
app.engine('html', swig.renderFile)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')
app.set('view cache', false)
swig.setDefaults({ cache: false, varControls: ['<%=', '%>'] })

// Setting up middlewares
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// JWT stuff
const { User } = require('./models/User')
const safeURLs = ['/login', '/register', '/blockchain-meta', '/event']
app.use((req, res, next) => {
  jwt.verify(req.cookies.tracker, config.secret, function (err, decoded) {
    if (! err && decoded) {
      User.findOne({email: decoded.email}, function (err, user) {
        if (! err && user) req.user = user
        next()
      })
      return
    }
    // if (safeURLs.indexOf(req.originalUrl) < 0) return res.redirect('/login')
    next()
  })
})

// Declaring routes
app.use('/', require('./routes/index')(io))
// app.use('/records', require('./routes/userRecords')(io))
// // app.use('/users', require('./routes/users'))
// app.use('/blockchain', require('./routes/blockchain'))
// app.use('/', require('./routes/history'))
// app.use('/api/v1', require('./routes/v1'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  // next(err)
  return res.send('This is an invalid API call')
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
