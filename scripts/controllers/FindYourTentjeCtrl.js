(function(){
    'use strict';

	/** Converts numeric degrees to radians */
	if (typeof(Number.prototype.toRad) === "undefined") {
	  Number.prototype.toRad = function() {
	    return this * Math.PI / 180;
	  }
	}

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.FindYourTentjeCtrl',['$scope', 'gbApp.services.GeolocSrvc', '$http', '$rootScope',function($scope, GeolocSrvc, $http, $rootScope){

        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }

        var prevDist = 0;
    	$scope.init=function(){
    		$http({method: 'GET', url: $rootScope.URLAPI + '/user/info' }).
                success(function(data, status) {
                	if(!$.isEmptyObject(data.person.geoloctent)){
                    	$scope.tentlocation = data.person.geoloctent;
                	} else {
                		$scope.nolocation = true;
                	}
                }).
                error(function(data, status) {
                    alert('error');
                })
    	}


    	$scope.startSearch = function(){
		 	prevDist = 0

    		$scope.search = true;
    		checkGeoloc();
    		$scope.zoomoutTimer = setInterval(checkGeoloc,3000);
    	}

function checkGeoloc(){
	var ind = $('.hot_and_cold_indicator');
	GeolocSrvc.getGeoLoc().then(function(data){

		var x1 = parseFloat($scope.tentlocation.lat);
		var y1 = parseFloat($scope.tentlocation.long);
		var x2 = data.coords.latitude;
		var y2 = data.coords.longitude;

		var distance = calculateDistance(x1, y1, x2, y2);
		console.log(distance);
		if(distance > 1){
			//in kilometer
			$scope.distance = Math.round(distance*1000)/1000 + " km";
		} else {
			//in meter
			$scope.distance = Math.round(distance * 1000 * 10)/10 + " m";
		}

		if($scope.distance > prevDist){
			ind.css('background-color', 'blue');
		} else {
			ind.css('background-color', 'red');
		}

		prevDist = $scope.distance;
	});
}
    }]);
})();

function calculateDistance(lat1, lon1, lat2, lon2){
	var R = 6371;
	var dLat = (lat2-lat1).toRad();
	var dLon = (lon2-lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var distance = R * c;

	return distance;
}