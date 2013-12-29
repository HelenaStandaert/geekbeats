(function(){
    'use strict';

    var services = angular.module('gbApp.services');

    services.factory('gbApp.services.PerformanceSrvc',
        ['$rootScope', '$http', '$q', 'localStorageService', function($rootScope, $http, $q, localStorageService){
            var URL = $rootScope.URLAPI + "/performance";
            alert(URL);
            var MSG = "Could not load jsonp for stages";

            var _artists = null,
                _mySchedule = null,
                _numberOfResourcesToLoadViaAJAX = 1,
                _numberOfResourcesLoadedViaAJAX = 0;

            var that = this;

            this.loadArtists = function(){
                var deferred = $q.defer();

                if(_artists === null){
                    if(localStorageService.get('artists') === null){
                        $.ajax({
                            type:"GET",
                            dataType:"jsonp",
                            contentType:"application/json",
                            cache:false,
                            url:URL,
                            beforeSend: function(xhr){
                                    
                            },
                            success:function(data){
                                _artists = data;
                                localStorageService.set('artists', _artists);
                                deferred.resolve(_artists);
                            },
                            error:function(xhr, status, error){
                                deferred.reject(MSG);
                            }
                        });
                    }else{
                        _artists = localStorageService.get('artists');
                        deferred.resolve(_artists);
                    }
                }else{
                    deferred.resolve(_artists);
                }

                return deferred.promise;
            };

            this.loadMySchedule = function(){
                if(_mySchedule === null){
                    if(localStorageService.get('myschedule') === null){
                        _mySchedule = [];
                    }else{
                        _mySchedule = localStorageService.get('myschedule');
                    }
                }
            };

            return{
                loadData:function(){
                    var deferred = $q.defer();

                    that.loadMySchedule();

                    that.loadArtists().then(
                        function(data){
                            _numberOfResourcesLoadedViaAJAX++;
                            if(_numberOfResourcesLoadedViaAJAX === _numberOfResourcesToLoadViaAJAX){
                                deferred.resolve(true);
                            }
                        },
                        function(error){
                            deferred.reject(MSG);
                        }
                    );

                    return deferred.promise;
                },
                getDataArtists:function(){
                    var deferred = $q.defer();

                    if(_artists === null){
                        deferred.reject(MSG);
                    }else{
                        deferred.resolve(_artists);
                    }

                    return deferred.promise;
                },
                getMySchedule:function(){
                    var deferred = $q.defer();

                    var myschedule = [];
                    if(_mySchedule !== null){
                        _.each(_mySchedule, function(id){
                            var artist = _.find(_artists, function(artistId){
                                return artistId.artist_id === id;
                            });
                            if(typeof artist !== "undefined")
                                myschedule.push(artist);
                        });
                        deferred.resolve(myschedule);
                    }
                    else{
                        deferred.reject(MSG);
                    }
                    return deferred.promise;
                },
                isArtistAlreadyInMySchedule:function(artistId){
                    if(localStorageService.get('myschedule') === null)
                        return false;

                    var myschedule = localStorageService.get('myschedule');

                    var artist = _.find(myschedule, function(sId){
                        return sId === artistId;
                    });

                    if(typeof artist === 'undefined')
                        return false;

                    return true;
                },
                addArtistToMySchedule:function(artistId){
                    if(!this.isArtistAlreadyInMySchedule(artistId)){
                        _mySchedule = localStorageService.get('myschedule');

                        if(_mySchedule === null){
                            _mySchedule = [];
                        }

                        _mySchedule.push(artistId);
                        localStorageService.set('myschedule', _mySchedule);
                    }
                },
                removeArtistFromMySchedule:function(artistId){
                    if(this.isArtistAlreadyInMySchedule(artistId)){
                        _mySchedule = localStorageService.get('myschedule');

                        if(_mySchedule !== null){
                            _mySchedule = _.pull(_mySchedule, artistId);
                            localStorageService.set('myschedule', _mySchedule);
                        }
                    }
                }
            }
        }]);
})();