var app = angular.module('webapp', ['ionic', 'ngCordova']);
app.config(function($locationProvider){
	//$locationProvider.html5Mode(true);  
});
app.controller('webappCtrl', function($scope,$location){
	//console.log($location);
})