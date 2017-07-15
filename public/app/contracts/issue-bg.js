const app = require('../main')
const toastr = require('toastr')

app.controller('proposeBGCtrl', ['$scope', 'HTTP', '$sce', ($scope, HTTP, $sce) => {
  window.s = $scope
  $scope.applications = []
  $scope.selectedApplication = null
  $scope.proposeBG = proposeBG
  const STATUS_MAP = {0: 'Yet to respond', 1: 'Accepted', 2: 'Rejected'}
  const socket = io()
  socket.on('BGApplications-create', react)

  $('#navProposeBG').addClass('active')

  HTTP.get('/contracts/action/applied')
    .map(applications => applications.map(formatContract))
    .fork(fail, applications => $scope.applications = applications)
  
  $scope.selectedContract = {}
  $scope.BGCreateModalOpen = BGCreateModalOpen
  $scope.BGCreate = BGCreate

  function BGCreateModalOpen (application) {
    $('#BGCreateModal').modal('show')
    $scope.selectedApplication = application
  }
  function BGCreate  (application, proposal) {
    if ($scope.BGCreateFrm.$invalid) {
      toastr.error('Fill all details')
      return
    }
    const tx = {
      action: 'BGs-create',
      payload: {
        terms: proposal.terms,
        buyer_id: application.contract.seller_id,
        seller_id: application.contract.seller_id, 
        applicant: application.applicant,
        bga_token: application.token,
        buyer_status: 0,
        status: 1,
        created_at: Date.now(),
        updated_at: Date.now(),
      }
    }
    HTTP.post('/contracts/action/bg-create', tx)
      .fork(fail, d => {
        toastr.success('Bank guarantee has been sent to the buyer')
        $('#BGCreateModal').modal('hide')
      })
  }
  
  function formatContract (contract) {
    contract.created_at = new Date(contract.created_at)
    contract.contract.terms = $sce.trustAsHtml(contract.contract.terms.replace(/\n/ig, '<br>'))
    contract.buyer_status = STATUS_MAP[contract.contract.buyer_status]
    contract.seller_status = STATUS_MAP[contract.contract.seller_status]
    return contract
  }

  function proposeBG (contract) {



    HTTP.post("/contracts/action/bg-propose", contract)
      .fork(fail, (res) => {
        toastr.success("Your BG proposal has been sent!")
      })
  }
  
  let proposal = {
    created_at: Date.now(),
    terms: '',
    buyer_id: '',
    seller_id: '', 
    applicant: '',
    bga_token: '',
    updated_at: Date.now(),
    buyer_status: 0,
    status: 1,
  }
  
  function react (obj) {
    console.log('fired')
    alertSound()
    toastr.success('New request for Bank Guarantee received')
    setTimeout(function() {
      window.location.reload()
    }, 1000);
  }

  function fail (err) {
    toastr.error('Something went wrong')
    console.log(err)
  }
}])