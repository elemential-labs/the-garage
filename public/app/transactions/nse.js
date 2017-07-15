const app = require('../main')
const toastr = require('toastr')
const salert = require('sweetalert')

app.controller('NSETransactionsCtrl', ['$scope', 'HTTP', 'Upload', ($scope, HTTP, Upload) => {
  const actionDict = {
    'users-create': 'User onboarded',
    'userRecords-create': 'User record added',
    'userRecords-fetch-multiple': 'User record queried',
    'userRecords-update': 'User record updated',
    'userRecords-verify-bank': 'User record verified by bank'
  }
  let usersDict
  // @todo :urgent change the hardcoded value to a dynamic value
  HTTP.get(`http://52.187.79.241:7000/api/v1/transactions-all/${$scope.activeUserProfile.token}`)
    .map(txs => txs)
    .chain(txs => HTTP.get('/api/v1/users').map(users => ({txs: txs, users: users})))
    .fork(e => $scope.transactions = [], obj => {
      usersDict = obj.users.reduce((obj, user) => {
        obj[user.public_key] = user.name
        return obj
      }, {})
      $scope.transactions = obj.txs.map(formatTransaction)
      console.log(usersDict)
    })

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
    if (tx.action == 'userRecords-create') return `A user record has been inserted by ${usersDict[tx.user]}.`
    if (tx.action == 'userRecords-fetch-multiple') return `A query has been made by ${usersDict[tx.user]} using the following parameters - ${getQueryParameters(tx)}.`
    if (tx.action == 'userRecords-update') return `User record has been updated by ${usersDict[tx.user]}.`
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
