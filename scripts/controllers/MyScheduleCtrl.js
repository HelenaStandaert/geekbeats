(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.MyScheduleCtrl',['$scope', 'gbApp.services.PerformanceSrvc', 'myschedule', '$http', function($scope, PerformanceSrvc, myschedule, $http){

        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }

        $scope.myschedule = myschedule;

        $scope.isAtStage1 = function(artist){
            return artist.stage.id === "1";
        };

        $scope.isAtStage2 = function(artist){
            return artist.stage.id === "2";
        };

        $scope.setOrder = function (order) {
            $scope.order = order;
        };

        /*angular.forEach($scope.myschedule, function(performance){
            performance.start < $scope.myschedule.start;
        });*/
    }]);
})();
