angular.module('starter.services')
  .factory('Download', function($rootScope) {
    var downloadList = []; //局部存储缓冲{id:0,name:"计算器",progress:0}
    $rootScope.downloadList = downloadList; //全局存储变量
    return {
      addToDownloadList: function(obj) {
        if (this.checkDownloadListExist()) {
          console.log("添加到下载列表失败：下载列表已有该项目");
        } else {
          downloadList.push(obj);
          this.updateDownloadList();
        }
      },
      updateDownloadList: function() {
        //$rootScopt.$broadcast('OnDownloadListUpdate', downloadList);
        console.log("updateDownloadList" + JSON.stringify($rootScope.downloadList));
        $rootScope.downloadList = downloadList;
      },
      getDownloadList: function() {
        return downloadList;
      },
      checkDownloadListExist: function(id) {
        for (var i = 0; i < downloadList.length; i++) {
          if (downloadList[i].id == id) {
            return true;
          }
        }
        return false;
      },
      removeDownloadList: function(id) {
        for (var i = 0; i < downloadList.length; i++) {
          if (downloadList[i].id == id) {
            downloadList.splice(i, 1);
            this.updateDownloadList()
            return;
          }
        }
      },
      //更新单个下载文件信息
      updateDownloadingInfo: function(obj) {
        for (var i = 0; i < downloadList.length; i++) {
          if (downloadList[i].id == obj.id) {
            downloadList[i] = obj;
            break;
          }
        }
        this.updateDownloadList();
      }
    };
  });