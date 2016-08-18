angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaInAppBrowser, $http) {
    $scope.apps = [];
    $http.get('local/apps/catalog.json')
      .success(function(response){
        $scope.apps = response
      });
    
    $scope.openApp = function(name, path){
      console.log(name + "|" + path);

      $http.get(path + '/package.json')
        .success(function(response){
          var url = "";
          if(response.type == "web"){
            url = response.url;
          }else if(response.type == "app") {
            url = path + "/" + response.content;
          }

          if(url != ""){
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
              });
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
    };
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
      Shop.download(id,function(res){
        console.log(JSON.stringify(res));
        if(res.complete == true) {
          console.log("下载完毕开始解压缩");
          console.log(res.target);
          Shop.unzip(res.target);
        }
      })
    };
  })

.controller('DownloadCtrl', function($scope) {

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, Shop) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.deleteAllApp = function(){
    Shop.deleteAllApp(function(){
      alert("所有APP删除完毕");
    });
  }
});
