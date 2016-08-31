/**
 * Created by Chen on 2016-08-19.
 */

angular.module('starter.controllers')
  .controller('DashCtrl', function($scope, App, $cordovaInAppBrowser, $http, $timeout, Locals) {
    console.log("DashCtrl");
    $scope.systemApps = [];
    $scope.localApps = [];

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
            icon: item.icon || "img/default_app_icon.png"
          })
        }
      })
    }, 100);

    $scope.$on('UpdateView', function() {
      console.log("UpdateView");
      $scope.update();
    });

    $scope.update = function() {
      var isRefreshComplete = false;
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
            icon: item.icon || "img/default_app_icon.png"
          })
        }
        $scope.$broadcast('scroll.refreshComplete');
        isRefreshComplete = true;
      });
      $timeout(function() {
        if(!isRefreshComplete){
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

      App.getAppInfoById(id, function(data) {
        console.log("app info:" + JSON.stringify(data))
        if (!!data) {
          App.getAppInfo(data.infoPath, function(info) {
            console.log(JSON.stringify(info));
            if (info.type == "app") {
              var url = "cdvfile://localhost/persistent/apps/" + id + "/" + info.content;
              App.openAppInBrowser(url);
            }
          })
        }
      });
    }
  });