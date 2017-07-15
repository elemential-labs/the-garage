const mongoose = require('mongoose')

const schema = mongoose.Schema({
  user: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

const VerifyRecord = mongoose.model('VerifyRecord', schema)

module.exports = { VerifyRecord }
