(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.SettingsCtrl',['$scope', 'geolocation', '$http', '$rootScope',function($scope, geolocation, $http, $rootScope){

        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }

        $scope.setTentGeoloc = function(){
 			console.log($rootScope.user);
 			$rootScope.user.person.geoloctent.lat = geolocation.coords.latitude;
 			$rootScope.user.person.geoloctent.long = geolocation.coords.longitude;

 			$http({
 				method: 'POST', 
 				url: $rootScope.URLAPI + '/user/info',
 				data:  $rootScope.user,
 			}).success(function(data, status) {
 					alert('you did it');
                }).
                error(function(data, status) {
                    console.log('ooooh');
                })
 		}   

    }]);

})();
