angular.module('starter.services', [])

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  })
  .factory('App', function ($cordovaFile) {
    return {
      getAppList:function(callback){
        console.log("aaaaaaaaa");
        $cordovaFile.checkFile("cdvfile://localhost/persistent/", "apps/catalog.json")
          .then(function (success) {
            // success
            $cordovaFile.readAsText("cdvfile://localhost/persistent/", "apps/catalog.json")
              .then(function (success) {
                // success
                console.log(JSON.stringify(success));
              }, function (error) {
                // error
                console.log("读取失败:" + JSON.stringify(error));
              });
          }, function (error) {
            // error
            var data = [];
            $cordovaFile.writeFile("cdvfile://localhost/persistent/", "apps/catalog.json", JSON.stringify(data), true);
            callback(data);
          });
      },
      checkApps:function(callback){

      }
    };
  })
  .factory('Shop', function ($http, App, $cordovaFile, $cordovaFileTransfer, $cordovaZip) {
    var shopItemList = [];//控制器间切换不会保留
    var baseServerUrl = "http://api.moonrailgun.com/otaku";
    var baseAppFilePath = "cdvfile://localhost/persistent/apps";//安卓兼容配置

    return {
      checkDir: function () {
        $cordovaFile.checkDir("cdvfile://localhost/persistent/", "apps")
          .then(function (success) {
            // success
            console.log(success);
          }, function (error) {
            // error
            console.log("checkDir error: " + JSON.stringify(error));
            $cordovaFile.createDir("cdvfile://localhost/persistent/", "apps", false)
              .then(function (success) {
                // success
                console.log("创建完毕");
                alert("创建完毕");
              });
          });
      },
      getList: function (callback) {
        console.log("获取商店列表");
        $http.get("local/shop/shop-item-list.json")
          .success(function (response) {
            console.log("获取商店列表完毕，共有" + response.length + "个应用");
            shopItemList = response;
            callback(shopItemList);
          });
      },
      getItemDetail: function (id, callback) {
        if (shopItemList.length > 0) {
          //已获得商店完整列表
          for (var index in shopItemList) {
            var item = shopItemList[index];
            if (item.id == id) {
              callback(item);
              return;
            }
          }
          callback(null);
        } else {
          var getItemDetail = this.getItemDetail;
          this.getList(function (shopItemList) {
            if (shopItemList.length > 0) {
              getItemDetail(id, callback);
            }
          });
        }
      },
      download: function (id, callback) {
        console.log(cordova);
        this.checkDir();

        var url = baseServerUrl + "/apps/" + id + ".zip";
        var target = baseAppFilePath + "/" + id + ".zip";//不能是中文
        console.log(target);
        var trustHosts = true;
        var options = {};

        var res = {
          complete: false,
          progress: 0,
          error: null,
          source: url,
          target: target
        };
        $cordovaFileTransfer.download(url, target, options, trustHosts)
          .then(function (result) {
            // Success!
            console.log("success:" + JSON.stringify(result));
            res.complete = true;
            callback(res)
          }, function (err) {
            console.log("download error");
            res.error = err;
            callback(res);
          }, function (progress) {
            var _progress = (progress.loaded / progress.total) * 100;
            console.log("downloading..." + _progress);
            res.progress = _progress;
            callback(res);
          });
      },
      unzip: function (path) {
        $cordovaZip.unzip(path, baseAppFilePath)
          .then(function () {
            console.log('unzip success');


            //删除压缩包
            var tmp = path.split('/');
            var filename = tmp[tmp.length - 1];
            $cordovaFile.removeFile("cdvfile://localhost/persistent/", "apps/" + filename)
              .then(function(success){
                console.log("压缩包删除成功:" + JSON.stringify(success));
              },function(error){
                console.log("压缩包删除失败" + JSON.stringify(error));
              });
          }, function () {
            console.log('unzip error');
            alert("文件解压缩失败");
          }, function (progressEvent) {
            console.log("文件解压缩中..." + JSON.stringify(progressEvent));
          });
      },
      deleteAllApp: function (callback) {
        $cordovaFile.removeRecursively("cdvfile://localhost/persistent/", "apps")
          .then(function (success) {
            // success
            callback();
          }, function (error) {
            // error
            console.log("删除失败:" + JSON.stringify(error));
          });
      }
    }
  });
