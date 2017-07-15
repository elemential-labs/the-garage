const app = require('../main')
const toastr = require('toastr')

app.controller('ContractListCtrl', ['$scope', 'HTTP', '$sce', ($scope, HTTP, $sce) => {
  window.s = $scope
  let whoAmI
  $scope.acceptContract = acceptContract
  $scope.rejectContract = rejectContract
  $scope.modifyContract = modifyContract
  // $scope.rejectReason = rejectReason
  const socket = io()
  socket.on('contracts-create', contract => {
    console.log(contract)
    if (contract.counterparty != me.token) return
    alertSound()
    toastr.success('New contract is issued for you')
    setTimeout(() => {
      window.location.reload()
    }, 700)
  })

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

  const statusStringer = 
  {
    0: "Not responded",
    1: "Accepted",
    2: "Rejected"
  }

  $('#navContractsInbox').addClass('active')

  HTTP.get('/contracts')
    .map(contracts => contracts.map(formatContract))
    .map(contracts => contracts.reverse())
    .fork(fail, contracts => $scope.contracts = contracts)
  
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

  function modifyContract(contract) {
    toastr.warning("Yet to be implemented")
  }

  function acceptContract(contract) {
    HTTP.post('/contracts/actions-accept-reject', {
      user_type: `${contract.whoAmI}_status`,
      user_status: 1,
      token: contract.token
    })
    .fork(fail, d => {
      toastr.success("Contract accepted")
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      // update contract to show self status
    })
  }

  function rejectContract(contract) {
    HTTP.post('/contracts/actions-accept-reject', {
      user_type: `${contract.whoAmI}_status`,
      user_status: 2,
      token: contract.token
    })
    .fork(fail, d => {
      toastr.warning("Contract rejected")
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      // update contract to show self status
    })
  }

  // function rejectReason(contract) {

  //   rejectContract(contract)
  //     .fork()
  // }

  function fail (err) {
    toastr.error('Something went wrong')
    console.log(err)
  }
}])