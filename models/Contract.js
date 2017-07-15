const mongoose = require('mongoose')
const uuid = require('node-uuid')

const schema = mongoose.Schema({
  _id: Number,
  buyer: String,
  seller: String,
  buyer_status: {type: Number, default: 0},
  seller_status: {type: Number, default: 0},
  status: {type: Number, default: 0},
  applicant: String,
  counterparty: String,
  sale_of_goods: String,
  purchase_price: Number,
  payment_method: {
    type: String,
    enum: ['1', '2', '3']
    // enum: ['Cash', 'Cheque', 'Cards']
  },
  down_payment: Number,
  time_of_payment: {
    type: String,
    enum: ['1', '2', '3']
    // enum: ['Signing of agreement', 'Delivery of goods', 'Specified date']
  },
  time_of_payment_specified_date: Date,
  delivery_of_goods: Date,
  condition_of_goods: String,
  additional_terms_and_conditions: String,
  contract: {
    link: String,
    hash: String
  },
  token: {
    type: String,
    index: true
  },
  updates_log: [{
    by: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  versions: [String]
})
const Contract = mongoose.model('Contract', schema)

const saveContract = (data) =>
  fetchLastId(Contract)
    .chain(_id => saveRecord(Contract, Object.assign(data, {_id: _id + 1})))

module.exports = { Contract, saveContract }
