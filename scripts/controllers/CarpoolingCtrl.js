(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.CarpoolingCtrl',['$scope', '$http', '$rootScope', 'geolocation', '$location' ,function($scope, $http, $rootScope, geolocation, $location){

        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }

        $scope.errors = [];
    	$scope.heenVisible = false;
    	$scope.terugVisible = false;
    	$scope.heenVisibleOnForm = false;
    	$scope.terugVisibleOnForm = false;
    	$scope.search = {};
    	$scope.search.direction = {};
    	$scope.search.direction.heen = false;
    	$scope.search.direction.terug = false;
    	 $scope.center = {
            latitude: 45,
            longitude: -73
        };
        $scope.markers = [];
        $scope.zoom = 8;

    	$scope.changeHeen = function(){
    		$scope.heenVisible = !$scope.heenVisible;
    	}
    	$scope.changeTerug = function(){
    		$scope.terugVisible = !$scope.terugVisible;
    	}
    	$scope.addTransport = function(){
    		$scope.errors = [];
    		if(typeof $scope.transport !== 'undefined'){
				
    		$scope.transport.user = $rootScope.user;

    		$http({
 				method: 'POST', 
 				url: $rootScope.URLAPI + '/transport/create',
 				data:  $scope.transport,
 			}).success(function(data, status) {
 					if(data.success){
 						$('#myModal').modal('hide');
 						$scope.transportAdded = true;
                        $rootScope.refreshUser();
                        $scope.addTransport.$setPristine(true)
 					} else {
 						$scope.showErrors = true;

 						for(var i=0; i < data.text.length; i++){
	                        $scope.errors.push(data.text[i]);
	                    }
 					}
                }).
                error(function(data, status) {
                    console.log('ooooh');
                })
			} else {
				$scope.showErrors = true;
				$scope.errors.push("Please fill in the form!");
			}
    	}

    	$scope.showHeenOnForm = function(){
    		$scope.heenVisibleOnForm = !$scope.heenVisibleOnForm;
    	}

    	$scope.showTerugOnForm = function(){
    		$scope.terugVisibleOnForm = !$scope.terugVisibleOnForm;
    	}
    	$scope.doSearch = function(){
            $scope.search.from = $scope.details.formatted_address;
            console.log($scope.search);
			$http({
 				method: 'POST', 
 				url: $rootScope.URLAPI + '/transport/search',
 				data:  $scope.search,
 			}).success(function(data, status) {
 					$scope.showResults = true;
 					$scope.results = data;
                }).
                error(function(data, status) {
                })
    	}
    	$scope.goToTransport = function(id){
			$location.path( "/transport/" + id);
    	}
    }]);
})();
