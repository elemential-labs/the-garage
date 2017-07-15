const mongoose = require('mongoose')

const schema = mongoose.Schema({
  applicant: String,
  beneficiary: String,
  bank: String,
  contract: String,
  contract_date: Date,
  application: String,
  amount: Number,
  validity: Date,
  claim_period: Date,
  issuing_branch: String,
  sig1_name: String,
  sig1_designation: String,
  sig1_pa_no: String,
  sig2_name: String,
  sig2_designation: String,
  sig2_pa_no: String,
  type_of_guarantee: {
    type: String,
    enum: ['1', '2', '3']
    // enum: ['Financial', 'Performance']
  },
  nature_of_guarantee: {
    type: String,
    enum: ['0', '1', '2', '3', '4', '5']
    // enum: ['Advance payment', 'Customs', 'Bid bond', 'Warranty', 'Trade debt', 'Others']
  },
  nature_of_guarantee_others: String,
  method_of_issue: {
    type: String,
    enum: ['1', '2']
    // enum: ['Swift', 'Physical']
  },
  bank_account_no: String,
  margin_money: Number,
  bond: {
    link: String,
    hash: String
  },
  token: {
    type: String,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})
const BankGuarantee = mongoose.model('BankGuarantee', schema)

module.exports = { BankGuarantee }
