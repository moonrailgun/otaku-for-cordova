angular.module('starter.services')
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