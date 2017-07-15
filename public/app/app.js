require('./pages')
const app  = require('./main')

const salert = require('sweetalert')
app.controller('MainCtrl', ['$scope', '$http', ($scope, $http) => {
  $('[data-toggle="tooltip"]').tooltip()
  window.s = $scope
  $scope.goTo = function  (link) {
  	window.location.href = link
  }
  $scope.activeUserProfile = me

  $scope.goToW = function  (link) {
  	window.open(link)
  }
}]);

const socket = io.connect()

socket.on('userRecords-update-notify', record => {
  salert('User record update tracked', `User record with ${getDetails(record)} has been updated`, 'info')
})

function getDetails (record) {
  console.log(record)
  if (record.panNum) return `PAN: ${record.panNum}`
  if (record.passportNum) return `Passport: ${record.passportNum}`
  if (record.aadharNum) return `Aadhar: ${record.aadharNum}`
  return `Token: ${record.token}`
}
