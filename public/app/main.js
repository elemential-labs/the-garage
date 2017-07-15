require('../js/scripts')
const angular = require('angular')
require('angular-http-task')
require('ng-file-upload')

const app = angular.module('ElementialApp', ['HTTP', 'ngFileUpload'])

app.directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        ctrl.$validators.pwCheck = function (modelValue, viewValue) {
          if (modelValue  == $(firstPassword).val() || viewValue  == $(firstPassword).val()) return true;
          return false;
        }
      }
    }
  }])
  .directive('isphoneno', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$validators.isphoneno = function (modelValue, viewValue) {
          var regex = /^[0-9]+$/gi;
          if(! modelValue) return true;
          if (modelValue.length == 10 && regex.test(modelValue)) return true;
          return false;
        }
      }
    }
  }])
  .directive('islandline', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$validators.isphoneno = function (modelValue, viewValue) {
          var regex = /^[0-9]+$/gi;
          if(! modelValue) return true;
          if (modelValue.length <= 15 && regex.test(modelValue)) return true;
          return false;
        }
      }
    }
  }])
  .directive('isvalidpassword', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$validators.isvalidpassword = function (modelValue, viewValue) {
          // var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?#&])[A-Za-z\d$@$!%*?#&]{8,}/g

          return (modelValue && modelValue.length >= 3);
        }
      }
    }
  }])
  .directive('isnumber', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$validators.isnumber = function (modelValue, viewValue) {
          if (! modelValue) return true;
          var regex = /^\d+$/g
          return regex.test(modelValue)
        }
      }
    }
  }])
  .directive('isfloat', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$validators.isfloat = function (modelValue, viewValue) {
          if (! modelValue) return true;
          var regex = /\d+(?:\.\d\d)?/
          return regex.test(modelValue)
        }
      }
    }
  }])
  .directive('isnot0', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$validators.isnot0 = function (modelValue, viewValue) {
          return (modelValue && modelValue != 0)
        }
      }
    }
  }])
  .directive('myDatepicker', function () {
    return {
      require : 'ngModel',
      link : function (scope, element, attrs, ngModelCtrl) {
        $(function(){
          element.datepicker({
            changeYear:true,
            changeMonth:true,
            dateFormat:'yy-mm-dd',
            yearRange: "-100:+0",
            onSelect:function (dateText, inst) {
              ngModelCtrl.$setViewValue(dateText);
              scope.$apply();
            }
          });
        });
      }
    }
  })
  .filter('numberFixedLen', function () {
      return function (n, len) {
          var num = parseInt(n, 10);
          len = parseInt(len, 10);
          if (isNaN(num) || isNaN(len)) {
              return n;
          }
          num = ''+num;
          while (num.length < len) {
              num = '0'+num;
          }
          return num;
      };
  })
  .directive('validdate', [function () {
  	return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$validators.validdate = function (modelValue, viewValue) {
        	let today = new Date()
        	if (! modelValue) return true
          return (modelValue.getTime() > Date.now() ||
          	((modelValue.getYear() == today.getYear()) && (modelValue.getMonth() == today.getMonth()) && (modelValue.getDate() == today.getDate()) ))
        }
      }
    }

  }])

module.exports = app
