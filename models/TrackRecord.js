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

const TrackRecord = mongoose.model('TrackRecord', schema)

module.exports = { TrackRecord }