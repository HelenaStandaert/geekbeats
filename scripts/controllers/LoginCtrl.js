(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.LoginCtrl',['$scope', '$rootScope', '$base64', '$http', '$location', 'localStorageService', function($scope, $rootScope, $base64, $http, $location, localStorageService){

        $('.logout').hide();
        $('.login').hide();
        $('.goback').show();

        $scope.errors = [];

        $scope.loginUser = function(){
            var email = $scope.user.email;
            var password = $scope.user.password;

            var encoded = $base64.encode(email + ':' + password);
            
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            $rootScope.refreshUser();

            $http({method: 'GET', url: $rootScope.URLAPI + '/user/info'}).
                success(function(data, status) {
                    if(data != null){
                        if($scope.user.remember){
                            localStorageService.set('user', encoded);
                        }
                        $rootScope.user = data;
                        $location.path('/main');
                    }
                    
                }).
                error(function(data, status) {
                    $scope.errors = [];

                    for(var i=0; i < data.text.length; i++){
                        $scope.errors.push(data.text[i]);
                    }
                })
            ;
        }
        $scope.hasErrors = function(){
            return $scope.errors.length > 0;
        }
    }]);
})();
