/**
 * Created by Chen on 2016-08-19.
 */

angular.module('starter.controllers')
  .controller('ShopCtrl', function ($scope, Shop, $ionicLoading,Locals) {
    console.log("ShopCtrl");
    $scope.items = [];
    $ionicLoading.show();
    Shop.getList(function (items) {
      $ionicLoading.hide();
      $scope.items = items;
      Locals.setObject('shopCache', items);
    },function(status){
      console.log("第一次获取超时:" + status);
      $ionicLoading.hide();
    });

    $scope.search = function (searchName) {
      console.log("搜索内容:" + searchName);
    };

    $scope.update = function(){
      Shop.getList(function (items) {
        $scope.items = items;
        Locals.setObject('shopCache', items);

        $scope.$broadcast('scroll.refreshComplete');
      },function(status){
        //error
        console.log("刷新超时:" + status);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  })

  .controller('ShopItemDetailCtrl', function ($scope, $rootScope, $stateParams, $ionicLoading, Shop, App,$ionicPopup,Locals,$cordovaNetwork) {
    $scope.screenshots = [];
    $scope.screenshotsSlide = 0;
    $scope.selectedTab = 0;
    $scope.isDownloading = false;
    $scope.isDownloadComplete = false;
    $scope.canOpenApp = false;
    

    $ionicLoading.show();
    Shop.getItemDetail($stateParams.itemId, function (item) {
      $ionicLoading.hide();
      if (!!item) {
        $scope.item = item;
        //$scope.screenshots = item.screenshots;
      }
    });

    App.checkAppExist(function(isExist){
      console.log("app 存在检测结果:" + isExist);
      $scope.canOpenApp = isExist;
    });

    $scope.downloadApp = function (id, name) {
      var url = $scope.item.file;
      console.log("开始下载:[" + id + "]" + url);
      if(Locals.getObject('settings').enableOnlyWifi == true){
        var type = $cordovaNetwork.getNetwork();
        console.log('网络状态:' + type);
        if(type == Connection.CELL_2G || type == Connection.CELL_3G || type == Connection.CELL_4G){
          console.log('使用的是手机网络,拒绝下载: ' + type);
          var alertPopup = $ionicPopup.alert({
            title: '拒绝下载',
            template: '使用的是手机网络,请在设置页面调整'
          });
          return;
        }
      }

      $scope.isDownloading = true;
      Shop.download(id, name, url, function (res) {
        console.log(JSON.stringify(res));
        if (res.progress) {
          console.log('更新圆形进度条:' + res.progress);
          $scope.indicatorValue = res.progress;
        }

        if (res.complete == true) {
          console.log("下载完毕开始解压缩");
          console.log(res.target);
          Shop.unzip(res.target,function(){
            //success
            var path = "apps/" + name + "/otaku.project.json";
            console.log("解压完毕,开始查找app信息:" + path);
            App.getAppInfo(path, function(obj){
              //app信息写入索引
              console.log("开始将App信息写入索引:" + JSON.stringify(obj));
              App.addToAppList({
                id:id,
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
      },function(){
        //app is exist
        console.log('app 已存在');
        $scope.isDownloading = false;
        var alertPopup = $ionicPopup.alert({
          title: '下载失败',
          template: '该App已存在,请选择更新'
        });
      });
    };

    $scope.openApp = function(id){
      console.log("open app:" + id);

      App.openApp(id);
    }
  })
