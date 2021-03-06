const express = require('express')
const router = express.Router()
const { get, post } = require('../lib/http')
const { User } = require('../models/User')

const uuid = require('node-uuid')

module.exports = io => {
  router.post('/v1/a3d2ggth/verification', api)

  return router
}

function api (req, res) {
  if (! req.body.uid) return res.status(400).send({code: 1, message: 'UID missing'})
  User.find({uid: req.body.uid}, (err, user) => {
    console.log(user)
    if (err) return res.status(500).send({code: 500, message: 'Internal error'})
    if (user.length == 0) return res.status(400).send({code: 2, message: 'No record with UID found'})
    user = user[0].toObject()
  console.log(user)
    const dataHash = cleanse(req.body)
    console.log(dataHash)
    let ans = {}
    Object.keys(dataHash).forEach(k => {
      if (user[k] != dataHash[k]) ans[k] = 1
      if (user[k] == dataHash[k]) ans[k] = 2
      console.log(user[k], dataHash[k])
    })
    return res.send(ans)
  })
    
}

function cleanse (obj) {
  const allowedKeys =  ["rc", "name", "street", "landmark", "locality", "village", "district", "state", "country", "postalcode", "postoffice", "gender", "dob", "mobile", "email"]
  Object.keys(obj).forEach(k => {
    if (allowedKeys.indexOf(k) < 0) delete obj[k]
  })
  return obj
}