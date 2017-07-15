const mongoose = require('mongoose')
// const {  } = require('mongoose')

const schema = mongoose.Schema({
  applicant: String,
  applicant_address: String,
  beneficiary: String,
  beneficiary_address: String,
  bank: String,
  status: {
    type: Number,
    default: 0
  },
  rejection_reason: String,
  contract: String,
  amount: Number,
  validity: Date,
  claim_period: Date,
  financial_record: {
    link: String,
    hash: String
  },
  collateral_details: String,
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
  token: {
    type: String,
    index: true
  },
  purpose: String,
  term: Date,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})
const BankGuaranteeApplication = mongoose.model('BankGuaranteeApplication', schema)

module.exports = { BankGuaranteeApplication }
