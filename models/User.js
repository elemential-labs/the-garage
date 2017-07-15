const mongoose = require('mongoose')

const schema = mongoose.Schema({
  created_at: Date,
  updated_at: Date
}, {strict: false})

const User = mongoose.model('User', schema)

module.exports = { User }
