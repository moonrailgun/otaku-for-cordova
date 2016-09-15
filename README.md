# Otaku! #

![](./www/img/default_app_icon.png)**by** ![](./www/img/ionic.png)

## 概述 ##
Otaku!基于ionic+AngularJS+Cordova技术制作的html5移动应用中心  
[如何开发基于Otaku!的HTML5移动应用程序](#开发Otaku!项目)

## 快照 ##
![](./doc/1.png)
![](./doc/2.png)
![](./doc/3.png)

## 开发Otaku!项目 ##
1. 进行正常html5 app开发
2. 完成后添加项目描述文件`otaku.project.json`
3. 访问[Otaku后台](http://otaku.moonrailgun.com)
4. 将文件夹打包成zip格式上传到服务端
5. 在手机商店列表就可以查找到你的应用

## 编译 ##
### 安装开发环境 ###
若没有npm请先安装nodejs开发环境

**安装cordova、ionic**
```bash
npm install -g cordova
npm install -g ionic
```

**从github上下载源码**
```bash
git clone https://github.com/moonrailgun/otaku-for-cordova.git
```

**自动安装依赖**
```bash
cd otaku-for-cordova/
ionic state restore
```

**开始编译**
```bash
ionic run/emulate/build andriod #在安卓平台编译
ionic run/emulate/build ios #在iOS平台编译
```

## 开源申明 ##
基于GPLv2协议进行开源。在保留原作者署名的情况下同意在此项目上进行二次开发，发布。其衍生产品必须继承GPLv2协议