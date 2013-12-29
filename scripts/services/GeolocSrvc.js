
(function(){
    'use strict';

    var services = angular.module('gbApp.services');

   services.factory("gbApp.services.GeolocSrvc", ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
        var position = null;
        var that = this;

        this.getGeoLoc = function () {
            var deferred = $q.defer();

            if (!$window.navigator) {
                $rootScope.$apply(function() {
                    deferred.reject(new Error("Geolocation is not supported"));
                });
            } else {
                $window.navigator.geolocation.getCurrentPosition(function (position) {
                    $rootScope.$apply(function() {
                        deferred.resolve(position);
                    });
                }, function (error) {
                    $rootScope.$apply(function() {
                        deferred.reject(error);
                    });
                });
            }
            return deferred.promise;
        }

        return {
            getGeoLoc:function(){
                var deferred = $q.defer();

                that.getGeoLoc().then(
                    function(data){
                        if(data !== null){
                            deferred.resolve(data);
                        } else {
                            deferred.reject(new Error("We were unable to obtain your position"));
                        }
                    }
                );

                return deferred.promise;
            },
        }
    }]);
})();
