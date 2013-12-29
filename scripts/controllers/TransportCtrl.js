(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.TransportCtrl',['$scope', '$http', '$rootScope', '$routeParams', function($scope, $http, $rootScope, $routeParams){



        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }

        $scope.init = function(){
    	$scope.transport = {};
        $scope.transport.user = {};
        $scope.transport.user.id = 0;
    		$http({method: 'GET', url: $rootScope.URLAPI + '/transport/get/' + $routeParams.id }).
                success(function(data, status) {
                    $scope.transport = data;
                    
                }).
                error(function(){
                    alert('error');
                });
    	}

    	$scope.SendRequest = function(){
    		$scope.request = {};
    		$scope.request.user_id = $rootScope.user.id;
    		$scope.request.transport_id = $routeParams.id;

    		$http({
 				method: 'POST', 
 				url: $rootScope.URLAPI + '/transport/request/create',
 				data:  $scope.request,
 			}).success(function(data, status) {
                }).
                error(function(data, status) {
                })
    	}
        $scope.userIsCreator = function(){
            return $scope.transport.user.id === $rootScope.user.id;
        }
        $scope.isApproved = function(approved){
            return approved !== null;
        }
    }]);
})();