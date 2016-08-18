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
.factory('Shop',function($http, $cordovaFile,$cordovaFileTransfer){
    var shopItemList = [];//控制器间切换不会保留
    var baseServerUrl = "http://api.moonrailgun.com/otaku";
    /*var baseAppFilePath;
    if(!!cordova.file){
      baseAppFilePath = cordova.file.documentsDirectory + "apps";
    }*/

    return {
      checkDir:function(){
        $cordovaFile.checkDir(cordova.file.documentsDirectory, "apps")
          .then(function (success) {
            // success
            console.log(success);
          }, function (error) {
            // error
            console.log(error);
            $cordovaFile.createDir(cordova.file.documentsDirectory, "apps", false)
              .then(function (success) {
                // success
                console.log("创建完毕");
                alert("创建完毕");
              });
          });
      },
      getList:function(callback){
        console.log("获取商店列表");
        $http.get("local/shop/shop-item-list.json")
          .success(function(response) {
            console.log("获取商店列表完毕，共有" + response.length + "个应用");
            shopItemList = response;
            callback(shopItemList);
          });
      },
      getItemDetail:function(id,callback){
        if(shopItemList.length > 0){
          //已获得商店完整列表
          for(var index in shopItemList){
            var item = shopItemList[index];
            if(item.id == id){
              callback(item);
              return;
            }
          }
          callback(null);
        }else{
          var getItemDetail = this.getItemDetail;
          this.getList(function(shopItemList) {
            if(shopItemList.length > 0) {
              getItemDetail(id,callback);
            }
          });
        }
      },
      download:function(id, callback){
        this.checkDir();

        var url = baseServerUrl + "/apps/" + id + ".zip";
        var target = cordova.file.documentsDirectory + "apps/" + id + ".zip";//不能是中文
        console.log(target);
        var trustHosts = true;
        var options = {};

        var res = {
          complete:false,
          progress:0,
          error:null
        };
        $cordovaFileTransfer.download(url, target, options, trustHosts)
          .then(function(result){
            // Success!
            res.complete = true;
            callback(res)
          },function(err){
            res.error = err;
            callback(res);
          },function(progress) {
            res.progress = (progress.loaded / progress.total) * 100;
            callback(res);
          });
      }
    }
  })
.factory('App',function($cordovaInAppBrowser){
    return{
    }
  });
