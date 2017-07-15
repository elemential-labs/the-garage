const app = require('./main')
const toastr = require('toastr')
const banks = require('../../banks')
const salert = require('sweetalert')
const Task = require('data.task')
const config = require('../../config-f')

app.controller('PeersCtrl', ['$scope', 'HTTP', '$sce', 'Upload', ($scope, HTTP, $sce, Upload) => {
  window.s = $scope
  HTTP.get('/api/v1/peers')
  .fork(e => $scope.peers = [], peers => {
    $scope.hideLoading = true
    $scope.peers = peers
  })
}])
