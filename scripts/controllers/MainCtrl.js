(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.MainCtrl',['$scope', '$http',function($scope, $http){
        $('.container').addClass('gbcontainer');

        if(typeof $http.defaults.headers.common.Authorization == 'undefined'){
            $('.ineedauserdiv').css('opacity','0.5');
            $('.ineedauserdiv a').css({'pointer-events':'none'},{'cursor':'default'});
            $('.logout').hide();
            $('.register').show();
            $('.goback').hide();
            $('.login').show();
            return false;
        }
        if($http.defaults.headers.common.Authorization !== null){
            $('.register').hide();
            $('.login').hide();
            $('.logout').show();
        }
    }]);
})();
