const app = require('../main')
const toastr = require('toastr')
const salert = require('sweetalert')

app.controller('UserRecordAddCtrl', ['$scope', 'HTTP', 'Upload', ($scope, HTTP, Upload) => {
  $('#navUserRecordsAdd').addClass('active');
  window.s = $scope
  $scope.user = {vm: verificationMeasureSet()}
  $scope.label = 'one'
  $scope.userSave = userSave

  /**
   * Check if active user is nse or bank and return value of verification_measure accordingly
   * nse => type: 1, vm: 1
   * bank => type: 2, vm: 2
   */
  function verificationMeasureSet () {
    return $scope.activeUserProfile.type == 1 ? 1 : $scope.activeUserProfile.type == 2 ? 2 : 0
  }

  function userSave (user) {
    HTTP.post('/records/records:generate', {user: user})
      // .map(x => {console.log(x); return x;})
      .chain(tx => HTTP.post('http://localhost:9142/generate-transaction', tx))
      .chain(txs => HTTP.post('/records', {tx: txs}))
      .fork(err => {
        if (err.status == -1) {
          salert(`Vault is not connected`, `Please start the Vault application and load your keys.`, 'error')
          return
        }
        if (err.data.code == 1) {
          salert(`Keys missing`, `Please load keys in the Vault application.`, 'error')
          return
        }
      }, user => {
        salert(`User record ${user._id} saved`, 'The user record has been saved', 'success')
        // $scope.user = {}
      })
    // HTTP.post('http://localhost:9142/generate-transaction', {action: 'userRecords-create', payload: })
    //   .fork(err => {
    //     salert('Vault missing', 'The transaction could not be signed. The vault is missing.', 'error')
    //   }, tx => {
    //     salert('Transaction is:', tx, 'success')
    //     console.log(tx)
    //   })
    // HTTP.post('/records', {user: user})
    //   .fork(fail, user => {
    //     salert(`User record ${user._id} saved`, 'The user record has been saved', 'success')
    //     $scope.user = {}
    //   })
  }

  function fail (err) {
    if (err.data.code && (err.data.code == 'ECONNREFUSED' || err.data.code == 'ENOTFOUND')) {
      salert('Node is down', `You're blockchain node is shut down. Please connect to another node and try again.`, 'error')
      return
    }
    toastr.error('Something went wrong')
    console.log(err)
  }
}])
