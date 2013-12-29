(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.ArtistCtrl',['$scope', '$routeParams', 'gbApp.services.PerformanceSrvc', 'artists', '$http', function($scope, $routeParams, PerformanceSrvc, artists, $http){

        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }

        var artistId = $routeParams.artistId;
        var stageId = $routeParams.stageId;
        $scope.artists = _.find(artists, {"artist_id":artistId});

        $scope.isAtStage = function(artist){
            return artist.stage.id === stageId;
        };

        $scope.isArtistInMySchedule = PerformanceSrvc.isArtistAlreadyInMySchedule(artistId);

        $scope.addArtistToMySchedule = function(){
            if(!PerformanceSrvc.isArtistAlreadyInMySchedule(artistId)){
                PerformanceSrvc.addArtistToMySchedule(artistId);
                $scope.isArtistInMySchedule = true;
            }
        };

        $scope.removeArtistFromMySchedule = function(){
            if(PerformanceSrvc.isArtistAlreadyInMySchedule(artistId)){
                PerformanceSrvc.removeArtistFromMySchedule(artistId);
                $scope.isArtistInMySchedule = false;
            }
        };

    }]);
})();
