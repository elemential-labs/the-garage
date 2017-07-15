const app = require('../main')
const toastr = require('toastr')
const salert = require('sweetalert')

app.controller('UserRecordsSearchCtrl', ['$scope', 'HTTP', 'Upload', ($scope, HTTP, Upload) => {
  $('#navUserRecordsSearch').addClass('active');
  window.s = $scope
  $scope.label = 'one'
  const recordStatusDict = {
    0: 'Invalid record',
    1: 'Verified record',
    2: 'Partially verified record'
  }
  $scope.search = search
  $scope.reset = reset
  $scope.showRecord = showRecord
  $scope.updateRecord = updateRecord
  $scope.trackUserRecord = trackUserRecord
  $scope.verify = verify

  function search (obj) {
    if (! obj) {
      toastr.error('Please fill atleast one parameter to begin search')
      return
    }
    $scope.startingSearch = true
    let searchTask
    if (obj.credit_search) searchTask = HTTP.post('/records/search-credit', obj)
    else searchTask = HTTP.post('/records/search', obj)
    const tx = {
      action: 'userRecords-fetch-multiple',
      payload: Object.assign(obj, {user: $scope.activeUserProfile.token})
    }
    console.log($scope.activeUserProfile.token)
    HTTP.post('http://localhost:9142/generate-transaction', tx)
    .chain(tx => obj.credit_search ? HTTP.post('/records/search-credit', {tx: tx}) : HTTP.post('/records/search', {tx: tx}))
    .fork(fail, matches => {
      $scope.matches = matches.map(formatMatches)
      if (matches.length == 0) salert('No records found', 'User records with the specified parameters were not found', 'info')
      else $scope.showReset = true
      $scope.startingSearch = false
    })
  }
  function reset () {
    $scope.user = {}
    $scope.matches = []
    $scope.showReset = false
    $scope.hideVerify = false
  }
  function showRecord (user, $index) {
    $scope.user = user
    $scope.showResults = true
    $scope.showProbableOptionsBtn = true
    HTTP.get(`/api/v1/user-records/${user.token}/verify`)
      .fork(e => {}, d => {
        if (d.length == 0) return
        $scope.hideVerify = true
      })
  }
  function updateRecord (user) {
    if (! user.token) return
    if ($scope.activeUserProfile.type != 1) return
    const tx = {
      action: 'userRecords-update',
      payload: {
        user: $scope.activeUserProfile.token,
        token: user.token,
        userRecord: user
      }
    }
    HTTP.post('http://localhost:9142/generate-transaction', tx)
    .chain(tx => HTTP.post('/records/'+user.token, {tx: tx}))
      .fork(fail, user => {
        salert('Successfully updated', 'The user record is successfully updated', 'success')
        // setTimeout(x => window.location.reload(), 5000)
      })
  }
  function trackUserRecord (user) {
    if (! user || !  user.token) return
    HTTP.post('/records/actions/track/'+user.token, user)
      .fork(fail, user => {
        salert('Tracking record', 'This user record is being tracked', 'success')
        // setTimeout(x => window.location.reload(), 5000)
      })
  }
  function verify (user) {
    if (! user || !  user.token) return
    const tx = {
      action: 'userRecords-verify-bank',
      payload: {
        user: $scope.activeUserProfile.token,
        token: user.token
      }
    }
    HTTP.post('http://localhost:9142/generate-transaction', tx)
    .chain(tx => HTTP.post(`/records/${user.token}/verify`, {tx: tx}))
    .chain(res => HTTP.post(`/api/v1/user-records/${user.token}/verify`))
      .fork(fail, user => {
        salert('Verified', 'The user record has been verified by you', 'success')
        // setTimeout(x => window.location.reload(), 5000)
      })
  }

  function formatMatches (match) {
    return Object.assign(match, {record_status: recordStatusDict[match.vm || 0]})
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
