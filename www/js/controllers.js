angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaInAppBrowser) {
    $scope.apps = [
      {
        "name":"计算器",
        "icon":"http://a4.mzstatic.com/us/r30/Purple18/v4/59/e3/2e/59e32e26-d0a4-2d3d-5fbb-0203444c5337/icon175x175.jpeg",
        "path":"local/apps/calc/index.html"
      },{
        "name":"test",
        "icon":"https://avatars1.githubusercontent.com/u/6964737?v=3&s=460",
        "path":""
      },{},{},{}
    ];

    $scope.openApp = function(name, path){
      console.log(name + "|" + path);

      //alert(path);
      /*
      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
      };
      $cordovaInAppBrowser.open('http://ngcordova.com', '_blank', options)
        .then(function(event) {
          // success
          console.log(event);
        })
        .catch(function(event){
          console.log(event);
        })*/
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
