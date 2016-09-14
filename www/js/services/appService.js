angular.module('starter.services')
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
								callback(data);
							});
					});
			},
			saveAppList: function(data, callback, saveErrorCb) {
				console.log("saving app list:" + JSON.stringify(data));
				$cordovaFile.writeFile("cdvfile://localhost/persistent/", "apps/catalog.json", JSON.stringify(data), true)
					.then(function(success) {
						console.log("apps索引文件保存完毕:" + JSON.stringify(success));
						callback();
					}, function(error) {
						console.log("apps索引文件保存失败:" + JSON.stringify(error));
						saveErrorCb(error);
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
			},
			checkAppExist: function(id, callback) {
				this.getAppList(function(list) {
					console.log("开始进行APP存在性检测");
					for (var i = 0; i < list.length; i++) {
						if (list[i].id == id) {
							callback(true);
							return;
						}
					}
					callback(false);
				})
			},
			deleteAppById: function(id, callback, deleteErrorCb) {
				var _app = this;
				_app.checkAppExist(id, function(isExist) {
					if (isExist) {
						_app.getAppInfoById(id, function(info) {
							console.log("删除应用信息:" + JSON.stringify(info));
							var name = info.name;

							_app.getAppList(function(list) {
								for (var i = 0; i < list.length; i++) {
									if (list[i].id == id) {
										list.splice(i, 1); //删除该项
										_app.saveAppList(list, function() {
											//索引文件修改完毕。移除文件夹
											$cordovaFile.removeRecursively("cdvfile://localhost/persistent/", "apps/" + name)
												.then(function(success) {
													//文件删除完毕
													callback();
												}, function(error) {
													deleteErrorCb(error);
												});
										}, function(error) {
											//save error
											deleteErrorCb(error);
										})
									}
								}
							});
						}, function(error) {
							deleteErrorCb(error);
						});
					} else {
						deleteErrorCb("应用不存在");
					}
				});
			},
			openApp: function(id) {
				_app = this;
				_app.getAppInfoById(id, function(data) {
					console.log("app info:" + JSON.stringify(data))
					if (!!data) {
						_app.getAppInfo(data.infoPath, function(info) {
							console.log(JSON.stringify(info));
							if (info.type == "app") {
								var url = "cdvfile://localhost/persistent/apps/" + info.name + "/" + info.content;
								_app.openAppInBrowser(url);
							} else if (info.type == "html") {
								var url = info.content;
								_app.openAppInBrowser(url);
							}
						})
					} else {
						console.log("应用不存在,打开失败");
					}
				});
			}
		}
	});