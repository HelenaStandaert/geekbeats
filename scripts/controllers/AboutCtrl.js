(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.AboutCtrl',['$scope', '$http',function($scope, $http){
        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }
    }]);
})();
