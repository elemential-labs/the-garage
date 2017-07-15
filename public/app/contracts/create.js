const app = require('../main')
const toastr = require('toastr')
const salert = require('sweetalert')

app.controller('ContractAddCtrl', ['$scope', 'HTTP', 'Upload', ($scope, HTTP, Upload) => {
  window.s = $scope
  $('#navContracts').addClass('active');
  initForm(me)
  HTTP.get('/users')
  .map(users => users
    .filter(user => user.type < 5)
    .map(user => Object.assign(user, {option: `${user._id} - ${user.name}`})))
  .fork(fail, users => $scope.users = users)
  $scope.contractCreate = contractCreate
  $scope.fileUpload = fileUpload

  function contractCreate (contract) {
    if ($scope.contractCreateFrm.$invalid) {
      toastr.error('Fill all details')
      return
    }

    $scope.contract = Object.assign($scope.contract, {
      applicant: me.token,
      counterparty: (me.token == contract.seller) ? $scope.contract.buyer : $scope.contract.seller
    })
    HTTP.post('/contracts', $scope.contract)
      .fork(fail, res => {
        initForm(me)
        salert(`Contract id: ${res._id}`, 'The contract has been created and sent to the counterparty.', 'success')
        $scope.contractCreateFrm.$setPristine()
      })
    console.log(contract)
  }
  function fileUpload ($file) {
    if (! $file) return;
    console.log($file)
    Upload.upload({
      url: 'http://52.187.62.157:8000/api/files',
      data: {file: $file, token: 'esscale'}
    }).then(d => {
      toastr.success('File is uploaded')
      $scope.contract.contract = {link: d.data.url}
    }, fail)
  }

  function initForm (me) {
    $scope.contract = {
      status: 0
    }
    if (me.type == 0) {
      $scope.contract.buyer = me.token
    }
    if (me.type == 1) {
      $scope.contract.seller = me.token
    }
  }

  function fail (err) {
    toastr.error('Something went wrong')
    console.log(err)
  }
}])
