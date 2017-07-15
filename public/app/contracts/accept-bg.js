const app = require('../main')
const toastr = require('toastr')

app.controller('AcceptBGCtrl', ['$scope', 'HTTP', '$sce', ($scope, HTTP, $sce) => {
  window.s = $scope
  $scope.acceptBG = acceptBG

  // const socket = io()
  // socket.on('BGs-created', insertContract)

  $('#navAcceptBG').addClass('active')

  HTTP.get('/contracts/action/accept-bgs')
    .map(bankGs => bankGs.map(formatContract))
    .fork(fail, bankGs => $scope.bankGs = bankGs)
  
  $scope.selectedContract = {}
  
  function formatContract (contract) {
    contract.updated_at = new Date(contract.updated_at)
    // contract.terms = $sce.trustAsHtml(contract.terms.replace(/\n/ig, '<br>'))
    return contract
  }

  function acceptBG (bankG) {
    bankG.accepted = true
    console.log(bankG)
    toastr.success("You have successfully accepted the terms of this BG")
  }

  function fail (err) {
    toastr.error('Something went wrong')
    console.log(err)
  }
}])