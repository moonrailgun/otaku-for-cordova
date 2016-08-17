angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaInAppBrowser, $http) {
    $http.get('/local/apps/catalog.json')
      .success(function(response){
        $scope.apps = response
      });

    $scope.openApp = function(name, path){
      console.log(name + "|" + path);

      //alert(path);
      $http.get(path + '/package.json')
        .success(function(response){
          if(response.type == "web"){
            var url = response.url;
            var options = {
              location: 'yes',
              clearcache: 'yes',
              toolbar: 'yes'
            };
            $cordovaInAppBrowser.open(url, '_blank', options)
              .then(function(event) {
                // success
                console.log(event);
              })
              .catch(function(event){
                console.log(event);
              })
          }
        });
    };
  })

.controller('ShopCtrl', function($scope,Shop,$ionicLoading){
    $ionicLoading.show();
    $scope.items = [];
    Shop.getList(function(items){
      $ionicLoading.hide();
      $scope.items = items;
    });

    $scope.search = function(searchName){
      console.log("搜索内容:" + searchName);
    }
  })

.controller('ShopItemDetailCtrl',function($scope,$stateParams,$ionicLoading, Shop){
    $scope.screenshots = [];
    $scope.screenshotsSlide = 0;
    $scope.selectedTab = 0;

    $ionicLoading.show();
    Shop.getItemDetail($stateParams.itemId,function(item){
      $ionicLoading.hide();
      if(!!item){
        $scope.item = item;
        //$scope.screenshots = item.screenshots;
      }
    });

    $scope.downloadApp = function(id, url){
      console.log(id + url);
    };
  })

.controller('DownloadCtrl', function($scope) {

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
