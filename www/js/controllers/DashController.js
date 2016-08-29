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
        console.log(list);
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
    });

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
            var settings = Locals.getObject('settings');
            var options = {
              location: settings.enableLocal == true ? 'yes' : 'no',
              clearcache: 'yes',
              toolbar: settings.enableTool == true ? 'yes' : 'no'
            };
            $cordovaInAppBrowser.open(url, '_blank', options)
              .then(function(event) {
                // success
                console.log(event);
              })
              .catch(function(event) {
                console.log(event);
              });
          }
        });
    };

    $scope.openLocalApp = function(id) {
      console.log("open local app:" + id);
    }
  });