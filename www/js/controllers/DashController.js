/**
 * Created by Chen on 2016-08-19.
 */

angular.module('starter.controllers')
  .controller('DashCtrl', function ($scope, $cordovaInAppBrowser, $http, App) {
    $scope.apps = [];
    $http.get('local/apps/catalog.json')
      .success(function (response) {
        $scope.apps = response
      });

    App.getAppList(function(list){
      console.log(JSON.stringify(list));
    })

    $scope.openApp = function (name, path) {
      console.log(name + "|" + path);

      $http.get(path + '/package.json')
        .success(function (response) {
          var url = "";
          if (response.type == "web") {
            url = response.url;
          } else if (response.type == "app") {
            url = path + "/" + response.content;
          }

          if (url != "") {
            var options = {
              location: 'yes',
              clearcache: 'yes',
              toolbar: 'yes'
            };
            $cordovaInAppBrowser.open(url, '_blank', options)
              .then(function (event) {
                // success
                console.log(event);
              })
              .catch(function (event) {
                console.log(event);
              });
          }
        });
    };
  });
