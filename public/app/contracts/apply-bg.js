const app = require('../main')
const toastr = require('toastr')
const banks = require('../../../banks')

app.controller('RequestBGCtrl', ['$scope', 'HTTP', '$sce', ($scope, HTTP, $sce) => {
  window.s = $scope
  $scope.contracts = []
  $scope.applyForBG = applyForBG
  const STATUS_MAP = {0: 'Yet to respond', 1: 'Accepted', 2: 'Rejected'}
  $scope.showApplyBGModal = showApplyBGModal
  $scope.selectedContract = ''
  $scope.banks = banks

  $('#navBankGuarantee').addClass('active')

  HTTP.get('/contracts/action/accepted')
    .map(contracts => contracts.map(formatContract))
    .fork(fail, contracts => $scope.contracts = contracts)
  
  $scope.selectedContract = {}
  
  function formatContract (contract) {
    contract.counterparty =  (me.type == 2) ? contract.buyer_id : contract.seller_id
    console.log(contract)
    contract.terms = $sce.trustAsHtml(contract.terms.replace(/\n/ig, '<br>'))
    contract.created_at = new Date(contract.created_at)
    contract.buyer_status_label = STATUS_MAP[contract.buyer_status]
    contract.seller_status_label = STATUS_MAP[contract.seller_status]
    return contract
  }

  function applyForBG (contract) {
    HTTP.post("/contracts/action/apply", contract)
      .fork(fail, (res) => {
        toastr.success("Your application has been recorded!")
      })
  }
  
  function showApplyBGModal ()
  {
    $('#openMe').modal('show')
    // $scope.selectedContract = contract
  }

  function fail (err) {
    toastr.error('Something went wrong')
    console.log(err)
  }
}])