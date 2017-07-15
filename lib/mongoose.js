const Task = require('data.task')

const fetchLastRecord = (Collection) => new Task((reject, resolve) =>
  Collection.findOne({}, {}, { sort: { 'created_at' : -1 } })
    .exec((err, data) => 
      err ? reject(err) : resolve(data)))

const fetchLastId = (Collection) => new Task((reject, resolve) =>
  Collection.findOne({}, {}, { sort: { 'created_at' : -1 } })
    .exec((err, doc) => 
      err ? reject(err) : resolve(doc ? (parseInt(doc._id) || 0) : 0)))

const saveRecord = (Collection, data) => new Task((reject, resolve) =>
  (new Collection(data))
    .save((err, doc) => err ? reject(err) : resolve(doc)))

const fetchOne = (Collection, queryObj) => new Task((reject, resolve) => 
  Collection.findOne(queryObj, (err, doc) => err ? reject(err) : resolve(doc ? doc.toObject() : {})))

const fetch = (Collection, queryObj) => new Task((reject, resolve) => 
  Collection.find(queryObj).lean().exec((err, docs) => err ? reject(err) : resolve(docs || [])))

module.exports = { fetchLastRecord, fetchLastId, fetch, fetchOne, saveRecord }