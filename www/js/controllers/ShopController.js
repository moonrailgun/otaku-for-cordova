/**
 * Created by Chen on 2016-08-19.
 */

angular.module('starter.controllers')
  .controller('ShopCtrl', function ($scope, Shop, $ionicLoading) {
    $ionicLoading.show();
    $scope.items = [];
    console.log("ShopCtrl");
    Shop.getList(function (items) {
      $ionicLoading.hide();
      $scope.items = items;
    });

    $scope.search = function (searchName) {
      console.log("搜索内容:" + searchName);
    };
  })

  .controller('ShopItemDetailCtrl', function ($scope, $rootScope, $stateParams, $ionicLoading, Shop, App) {
    $scope.screenshots = [];
    $scope.screenshotsSlide = 0;
    $scope.selectedTab = 0;
    $scope.isDownloading = false;
    $scope.isDownloadComplete = false;
    

    $ionicLoading.show();
    Shop.getItemDetail($stateParams.itemId, function (item) {
      $ionicLoading.hide();
      if (!!item) {
        $scope.item = item;
        //$scope.screenshots = item.screenshots;
      }
    });

    $scope.downloadApp = function (id, url) {
      console.log(id + "|" + url);
      $scope.isDownloading = true;
      Shop.download(id, function (res) {
        console.log(JSON.stringify(res));
        if (res.progress) {
          $scope.indicatorValue = res.progress;
        }

        if (res.complete == true) {
          console.log("下载完毕开始解压缩");
          console.log(res.target);
          Shop.unzip(res.target,function(){
            //success
            var path = "apps/" + id + "/package.json"
            console.log("解压完毕,开始查找app信息:" + path);
            App.getAppInfo(path, function(obj){
              //app信息写入索引
              console.log("开始将App信息写入索引:" + JSON.stringify(obj));
              App.addToAppList({
                id:obj.id,
                name:obj.name,
                version:obj.version,
                type:obj.type,
                infoPath:path
              },function(){
                //添加完毕
                $rootScope.$broadcast('UpdateView');//通知更新页面
              });
            });
          });
          $scope.isDownloading = false;
          $scope.isDownloadComplete = true;
        }
      });
    };

    $scope.openApp = function(id){
      console.log("open app:" + id);
    }
  })
