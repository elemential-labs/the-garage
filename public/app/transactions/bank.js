const app = require('../main')
const toastr = require('toastr')
const salert = require('sweetalert')

app.controller('BankTransactionsCtrl', ['$scope', 'HTTP', 'Upload', ($scope, HTTP, Upload) => {
  $('#navBankTransactionsHistory').addClass('active')

  const actionDict = {
    'userRecords-create': 'User record added',
    'userRecords-fetch-multiple': 'User record queried',
    'userRecords-update': 'User record updated',
    'userRecords-verify-bank': 'User record verified by bank'
  }
  HTTP.get(`/api/v1/transactions/${$scope.activeUserProfile.token}`)
    .fork(e => $scope.transactions = [], txs => $scope.transactions = txs.map(formatTransaction))

  function formatTransaction (tx) {
    let obj =  {
      action: actionDict[tx.action],
      comment: getTransactionComment(tx),
      height: tx.height,
      created_at: new Date(tx.timestamp)
    }
    if (tx.action == 'userRecords-fetch-multiple' && tx.credit_search)
      obj.action = 'User record credit search'
    return obj
  }
  function getTransactionComment (tx) {
    if (tx.action == 'userRecords-create') return 'A user record has been inserted.'
    if (tx.action == 'userRecords-create') return 'A user record has been inserted.'
    if (tx.action == 'userRecords-fetch-multiple') return `A query has been made using the following parameters - ${getQueryParameters(tx)}.`
    if (tx.action == 'userRecords-update') return 'User record has been updated.'
    if (tx.action == 'users-create') return 'A user has been onboarded.'
  }
  function getQueryParameters (tx) {
    let obj = {}
    if (tx.panNum) obj.PAN = tx.panNum
    if (tx.aadharNum) obj.AADHAR = tx.aadharNum
    if (tx.passportNum) obj.PASSPORT = tx.passportNum
    if (tx.ckycId) obj.CKYCID = tx.ckycId
    return JSON.stringify(obj)
  }
}])
