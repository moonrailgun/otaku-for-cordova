/**
 * Created by Chen on 2016-08-19.
 */

angular.module('starter.controllers')
  .controller('DashCtrl', function($scope, App, $cordovaInAppBrowser, $http, $timeout, Locals, $ionicPopup) {
    console.log("DashCtrl");
    $scope.systemApps = [];
    $scope.localApps = [];

    var shopCache = Locals.getObject('shopCache')
    var tmp = [];
    for (var i = 0; i < shopCache.length; i++) {
      tmp[shopCache[i].id] = shopCache[i];
    }
    $scope.shopCache = tmp;

    $http.get('local/apps/catalog.json')
      .success(function(response) {
        $scope.systemApps = response
      });

    $timeout(function() {
      App.getAppList(function(list) {
        //console.log(JSON.stringify(list));
        for (var i = 0; i < list.length; i++) {
          var item = list[i];

          $scope.localApps.push({
            id: item.id,
            name: item.name,
            icon: item.icon || $scope.shopCache[item.id] && $scope.shopCache[item.id]["icon"] != "" ? $scope.shopCache[item.id]["icon"] : "img/default_app_icon.png"
          })
        }
      })
    }, 1500);

    $scope.$on('UpdateView', function() {
      console.log("UpdateView");
      $scope.update();
    });

    $scope.update = function() {
      var isRefreshComplete = false;

      var shopCache = Locals.getObject('shopCache')
      var tmp = [];
      for (var i = 0; i < shopCache.length; i++) {
        tmp[shopCache[i].id] = shopCache[i];
      }
      $scope.shopCache = tmp;

      $http.get('local/apps/catalog.json')
        .success(function(response) {
          $scope.systemApps = response
        });
      App.getAppList(function(list) {
        //console.log(JSON.stringify(list));
        $scope.localApps = [];
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          $scope.localApps.push({
            id: item.id,
            name: item.name,
            icon: item.icon || $scope.shopCache[item.id] && $scope.shopCache[item.id]["icon"] != "" ? $scope.shopCache[item.id]["icon"] : "img/default_app_icon.png"
          })
        }
        $scope.$broadcast('scroll.refreshComplete');
        isRefreshComplete = true;
      });
      $timeout(function() {
        if (!isRefreshComplete) {
          console.log("刷新超时");
          $scope.$broadcast('scroll.refreshComplete');
        }
      }, 10000);
    }

    $scope.openSystemApp = function(name, path) {
      console.log(name + "|" + path);

      $http.get(path + '/package.json')
        .success(function(response) {
          var url = "";
          if (response.type == "web") {
            url = response.url;
          } else if (response.type == "app") {
            url = path + "/" + response.content;
          }

          if (url != "") {
            App.openAppInBrowser(url);
          }
        });
    };

    $scope.openLocalApp = function(id) {
      console.log("open local app:" + id);

      App.openApp(id);
    }

    $scope.deleteApp = function(id) {
      $ionicPopup.confirm({
        title: '警告',
        template: '是否删除该APP'
      }).then(function(res) {
        console.log(res);
        if (res == true) {
          console.log("正在删除应用:" + id);
          App.deleteAppById(id, function() {
            console.log("删除应用成功");
            $scope.update();
          }, function(error) {
            console.log("删除文件似乎出了一些错误: " + JSON.stringify(error));
          })
        }
      });
    }
  });