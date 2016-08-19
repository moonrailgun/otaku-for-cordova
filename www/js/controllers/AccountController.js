/**
 * Created by Chen on 2016-08-19.
 */

angular.module('starter.controllers')
  .controller('AccountCtrl', function ($scope, Shop) {
    $scope.settings = {
      enableFriends: true
    };
    $scope.deleteAllApp = function () {
      Shop.deleteAllApp(function () {
        alert("所有APP删除完毕");
      });
    }
  });
