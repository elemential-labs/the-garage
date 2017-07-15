const app = require('../main')

app.directive('sidenav', ['$http', function ($http) {
  return {
    templateUrl: '/side-nav.html',
    link: function (scope, el, attrs) {

    }
  }
}]);
