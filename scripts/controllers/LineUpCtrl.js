(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.LineUpCtrl',['$scope' , 'gbApp.services.PerformanceSrvc', 'artists', '$http', function($scope, PerformanceSrvc, artists, $http){

        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }

        $scope._artists = artists;

        $scope.isAtStage1 = function(artist){
          return artist.stage.id === "1";
        };

        $scope.isAtStage2 = function(artist){
            return artist.stage.id === "2";
        };

        /*$scope.formatDate = function(){
            angular.forEach($scope._artists, function(performance, key){
                performance.start = performance.start.substr(11,5) + " h";
            });
        }*/

        $scope.isArtistInMySchedule = function(artistId){
            return PerformanceSrvc.isArtistAlreadyInMySchedule(artistId.toString());
        };

    }]);
})();
