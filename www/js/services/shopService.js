angular.module('starter.services')
  .factory('Shop', function($http, App, $cordovaFile, $cordovaFileTransfer, $cordovaZip, ApiServer, App, Download) {
    var shopItemList = []; //控制器间切换不会保留
    var baseServerUrl = ApiServer;
    var baseAppFilePath = "cdvfile://localhost/persistent/apps"; //安卓兼容配置

    return {
      checkDir: function() {
        $cordovaFile.checkDir("cdvfile://localhost/persistent/", "apps")
          .then(function(success) {
            // success
            console.log(success);
          }, function(error) {
            // error
            console.log("checkDir error: " + JSON.stringify(error));
            $cordovaFile.createDir("cdvfile://localhost/persistent/", "apps", false)
              .then(function(success) {
                // success
                console.log("apps文件夹创建完毕");
                //alert("创建完毕");
              });
          });
      },
      getList: function(callback, error) {
        console.log("获取商店列表");
        var shopListUrl = ApiServer + "/admin/catalog.php"
        $http.get(shopListUrl)
          .success(function(data, status, headers, config) {
            console.log("获取商店列表成功:" + JSON.stringify(data));
            console.log("共有" + data.length + "个应用");
            shopItemList = data;
            callback(shopItemList);
          }).error(function(data, status, headers, config) {
            console.log(status + ":" + data);
            error(status);
          });
      },
      getItemDetail: function(id, callback) {
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
          this.getList(function(shopItemList) {
            if (shopItemList.length > 0) {
              getItemDetail(id, callback);
            }
          });
        }
      },
      download: function(id, name, url, callback, isExistError) {
        _shop = this;
        App.checkAppExist(id, function(isExist) {
          if (!isExist) {
            console.log(cordova);
            _shop.checkDir();

            //var url = baseServerUrl + "/apps/" + id + ".zip";
            var target = baseAppFilePath + "/" + id + ".zip"; //不能是中文
            console.log(target);
            var trustHosts = true;
            var options = {};

            //添加到下载列表
            var downloadingInfo = {
              id: id,
              name: name,
              progress: 0
            }
            Download.addToDownloadList(downloadingInfo);

            //创建下载任务
            var res = {
              complete: false,
              progress: 0,
              error: null,
              source: url,
              target: target
            };
            $cordovaFileTransfer.download(url, target, options, trustHosts)
              .then(function(result) {
                // Success!
                console.log("success:" + JSON.stringify(result));
                res.complete = true;
                Download.removeDownloadList(id); //删除下载列表
                callback(res)
              }, function(err) {
                console.log("download error");
                res.error = err;
                Download.removeDownloadList(id); //删除下载列表
                callback(res);
              }, function(progress) {
                var _progress = (progress.loaded / progress.total) * 100;
                console.log("downloading..." + _progress);
                res.progress = _progress;
                downloadingInfo.progress = _progress;
                Download.updateDownloadingInfo(downloadingInfo); //更新下载列表
                callback(res);
              });
          } else {
            isExistError();
          }
        });
      },
      unzip: function(path, callback) {
        $cordovaZip.unzip(path, baseAppFilePath)
          .then(function() {
            console.log('unzip success');

            //删除压缩包
            var tmp = path.split('/');
            var filename = tmp[tmp.length - 1];
            $cordovaFile.removeFile("cdvfile://localhost/persistent/", "apps/" + filename)
              .then(function(success) {
                console.log("压缩包删除成功:" + JSON.stringify(success));
              }, function(error) {
                console.log("压缩包删除失败" + JSON.stringify(error));
              });

            callback();
          }, function() {
            console.log('unzip error');
            alert("文件解压缩失败");
          }, function(progressEvent) {
            console.log("文件解压缩中..." + JSON.stringify(progressEvent));
          });
      },
      deleteAllApp: function(callback) {
        $cordovaFile.removeRecursively("cdvfile://localhost/persistent/", "apps")
          .then(function(success) {
            // success
            callback();
          }, function(error) {
            // error
            console.log("删除失败:" + JSON.stringify(error));
          });
      }
    }
  });