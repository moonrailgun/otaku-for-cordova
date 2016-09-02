angular.module('starter.services', [])

.factory('Chats', function() {
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
      all: function() {
        return chats;
      },
      remove: function(chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  })
  .factory('App', function($cordovaFile, $cordovaInAppBrowser, Locals) {
    return {
      addToAppList: function(obj, callback) {
        var _app = this;
        _app.getAppList(function(data) {
          data.push(obj);
          console.log("添加信息:" + JSON.stringify(obj));
          _app.saveAppList(data, callback);
        });
      },
      getAppList: function(callback) {
        console.log("获取app列表");
        $cordovaFile.checkFile("cdvfile://localhost/persistent/", "apps/catalog.json")
          .then(function(success) {
            // success
            $cordovaFile.readAsText("cdvfile://localhost/persistent/", "apps/catalog.json")
              .then(function(success) {
                // success
                console.log("读取成功:" + success);
                callback(JSON.parse(success));
                //console.log()
                //callback(data);
              }, function(error) {
                // error
                console.log("读取失败:" + JSON.stringify(error));
                callback([]);
              });
          }, function(error) {
            // error
            console.log("文件不存在, 返回空数组:" + JSON.stringify(error));
            var data = [];
            $cordovaFile.writeFile("cdvfile://localhost/persistent/", "apps/catalog.json", JSON.stringify(data), true)
              .then(function(success) {
                console.log("apps索引文件创建完毕");
                callback(data);
              }, function(error) {
                console.log("apps索引文件创建失败:" + JSON.stringify(error));
              });
          });
      },
      saveAppList: function(data, callback) {
        console.log("saving app list:" + JSON.stringify(data));
        $cordovaFile.writeFile("cdvfile://localhost/persistent/", "apps/catalog.json", JSON.stringify(data), true)
          .then(function(success) {
            console.log("apps索引文件保存完毕:" + JSON.stringify(success));
            callback();
          }, function(error) {
            console.log("apps索引文件保存失败:" + JSON.stringify(error));
          });
      },
      getAppInfoById: function(id, callback) {
        //根据id返回catalog中的信息
        $cordovaFile.readAsText("cdvfile://localhost/persistent/", "apps/catalog.json")
          .then(function(success) {
            var json = JSON.parse(success);
            if (!!json) {
              var data;
              for (var i = 0; i < json.length; i++) {
                if (json[i].id == id) {
                  data = json[i];
                }
              }
              callback(data);
            }
          });
      },
      getAppInfo: function(path, callback) {
        //返回app信息
        console.log("正在获取app信息:" + path);
        $cordovaFile.readAsText("cdvfile://localhost/persistent/", path)
          .then(function(success) {
            callback(JSON.parse(success));
          }, function(error) {
            console.log("读取失败:" + JSON.stringify(error));
          })
      },
      openAppInBrowser: function(url) {
        var settings = Locals.getObject('settings');
        var options = {
          location: settings.enableLocal == false ? 'no' : 'yes',
          clearcache: 'yes',
          toolbar: settings.enableTool == false ? 'no' : 'yes'
        };
        $cordovaInAppBrowser.open(url, '_blank', options)
          .then(function(event) {
            // success
            console.log("[openAppInBrowser]success:" + JSON.stringify(event));
          })
          .catch(function(event) {
            console.log("[openAppInBrowser]catch error:" + JSON.stringify(event));
          });
      }
    }
  })
  .factory('Shop', function($http, App, $cordovaFile, $cordovaFileTransfer, $cordovaZip, ApiServer) {
    var shopItemList = []; //控制器间切换不会保留
    var baseServerUrl = "http://api.moonrailgun.com/otaku";
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
                console.log("创建完毕");
                alert("创建完毕");
              });
          });
      },
      getList: function(callback) {
        console.log("获取商店列表");
        var shopListUrl = ApiServer + "/catalog.json"
        $http.get(shopListUrl)
          .success(function(data,status,headers,config) {
            console.log("获取商店列表成功:" + JSON.stringify(data));
            console.log("共有" + data.length + "个应用");
            shopItemList = data;
            callback(shopItemList);
          }).error(function(data,status,headers,config){
            console.log(status + ":" +  data);
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
      download: function(id, callback) {
        console.log(cordova);
        this.checkDir();

        var url = baseServerUrl + "/apps/" + id + ".zip";
        var target = baseAppFilePath + "/" + id + ".zip"; //不能是中文
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
          .then(function(result) {
            // Success!
            console.log("success:" + JSON.stringify(result));
            res.complete = true;
            callback(res)
          }, function(err) {
            console.log("download error");
            res.error = err;
            callback(res);
          }, function(progress) {
            var _progress = (progress.loaded / progress.total) * 100;
            console.log("downloading..." + _progress);
            res.progress = _progress;
            callback(res);
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
  })
  .factory('Download', function($rootScopt) {
    var downloadList = []; //{id:0,name:"计算器",progress:0}
    return {
      addToDownloadList: function(obj) {
        this.downloadList.append(obj);
        this.updateDownloadList();
      },
      updateDownloadList: function() {
        $rootScopt.$broadcast('OnDownloadListUpdate', this.downloadList);
      },
      getDownloadList: function() {
        return this.downloadList;
      }
    };
  })
  //本地存储数据===================================
  .factory('Locals', ['$window', function($window) {
    return {
      //存储单个属性
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      //读取单个属性
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      //存储对象，以JSON格式存储
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      //读取对象
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }

    }
  }])
  .factory('Utils', function() {
    return {
      isEmptyObject(obj) {
        for (var x in obj) {
          return false;
        }
        return true;
      }
    };
  });