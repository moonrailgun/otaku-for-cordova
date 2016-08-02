angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

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
    }
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
