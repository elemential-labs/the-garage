const app = require('../main')
const toastr = require('toastr')

app.controller('ContractElCtrl', ['$scope', 'HTTP', '$sce', ($scope, HTTP, $sce) => {
  window.s = $scope
  let whoAmI

  const paymentTimeStringer = {
    1: "Upon signing of agreement",
    2: "Upon delivery of goods",
    3: "At the specified date"
  }

  const paymentMethodStringer = {
    1: "Cash",
    2: "Cheque",
    3: "Cards"
  }

  const statusStringer = {
    0: "Not responded",
    1: "Accepted",
    2: "Rejected"
  }

  // $('#navContractsInbox').addClass('active')

  $scope.contract = formatContract(contract)
  
  function formatContract (contract) {

    whoAmI = (contract.buyer == me.token) ? "buyer" : "seller"
    contract.whoAmI = whoAmI
    contract.myStatus = contract[whoAmI+"_status"]
    if (contract.buyer_status > 0 && contract.seller_status > 0) {
      contract.completed = true
    };

    if (contract.buyer_status == 2 || contract.seller_status == 2) {
      contract.rejected = true
    }
    if (contract.buyer_status == 1 && contract.seller_status == 1) {
      contract.accepted = true
    }

    contract.created_at = new Date(contract.created_at)

    contract.time_of_payment = paymentTimeStringer[contract.time_of_payment]
    contract.payment_method = paymentMethodStringer[contract.payment_method]
    contract.buyer_status_code = contract.buyer_status
    contract.seller_status_code = contract.seller_status
    contract.buyer_status = statusStringer[contract.buyer_status]
    contract.seller_status = statusStringer[contract.seller_status]
    

    return contract
  }

  function fail (err) {
    toastr.error('Something went wrong')
    console.log(err)
  }
}])