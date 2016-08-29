/**
 * Created by Chen on 2016-08-19.
 */

angular.module('starter.controllers')
  .controller('AccountCtrl', function($scope, Shop, $ionicPopup, Locals, Utils) {
    $scope.settings = Locals.getObject('settings');
    if (Utils.isEmptyObject($scope.settings)) {
      $scope.settings = {
        enableOnlyWifi: true,
        enableLocal: true,
        enableTool: true
      }
    }

    $scope.$watch('settings', function(newValue, oldValue, scope) {
      Locals.setObject('settings', newValue);
    }, true);

    $scope.deleteAllApp = function() {
      $ionicPopup.confirm({
        title: '警告',
        template: '是否删除所有APP'
      }).then(function(res) {
        console.log(res);
        if (res == true) {
          Shop.deleteAllApp(function() {
            $ionicPopup.alert({
              title: '',
              template: '所有APP删除完毕'
            });
          });
        }
      });
    }
  });