angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$cordovaFile) {
    $scope.apps = [
      {
        "name":"计算器",
        "icon":"http://a4.mzstatic.com/us/r30/Purple18/v4/59/e3/2e/59e32e26-d0a4-2d3d-5fbb-0203444c5337/icon175x175.jpeg",
        "path":""
      },{
        "name":"test",
        "icon":"https://avatars1.githubusercontent.com/u/6964737?v=3&s=460",
        "path":""
      },{},{},{}
    ];

    $scope.openApp = function(name, path){
      console.log(name + "|" + path);
    };

    $cordovaFile.checkDir(cordova.file.documentsDirectory,'apps/test')
      .then(function (success) {
        console.log('成功');
        console.log(success)
      },function(error){
        console.log(error)
      })
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

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
