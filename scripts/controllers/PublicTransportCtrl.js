(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.PublicTransportCtrl', ['$scope', 'geolocation', '$http',  function($scope, geolocation, $http){

        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }

        console.log(geolocation.coords.latitude);

		$scope.address = '';
	 	$scope.directionsDisplay = '';
    	$scope.directionsService = new google.maps.DirectionsService();
    	$scope.geocoder = '';

    	 var init = function(){
    	 	$scope.directionsDisplay = new google.maps.DirectionsRenderer();
    	 	$scope.directionsDisplay.setPanel(document.getElementById("directionsPanel"));
    	 	$scope.geocoder = new google.maps.Geocoder();
    	 }
    	 init();

    	 $scope.getDirections = function(){

			var request = {
				origin: $scope.details.formatted_address,
				destination:"Industrieweg 232,Gent-Mariakerke,belgium",
				travelMode: google.maps.TravelMode.TRANSIT
			};

			$scope.directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					$scope.directionsDisplay.setDirections(response);
				}
			});
    	 }

    	 $scope.getCurrentLocation = function(){
			var latlng = new google.maps.LatLng(geolocation.coords.latitude, geolocation.coords.longitude);
			 $scope.geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
                        $('#from').val(results[0].formatted_address);
                       	$scope.details = {};
                       	$scope.details.formatted_address = results[0].formatted_address;
					}
				} else {
					alert("Geocoder failed due to: " + status);
				}
			});
    	 }
    }]);
})();
