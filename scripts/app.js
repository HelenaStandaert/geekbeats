'use strict';
alert('EHM..');

angular.module('LocalStorageModule').value('prefix', 'gb');

angular.module('gbApp.controllers', []);
angular.module('gbApp.services', []);
angular.module('gbApp.directives', []);

var app = angular.module('gbApp', [
    'ngRoute',
    'ngResource',
    'gbApp.controllers',
    'gbApp.services',
    'gbApp.directives',
    'LocalStorageModule', 
    'base64', 
    'ngAutocomplete'
])
.config(['$routeProvider','$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
        $httpProvider.defaults.useXDomain = true;//Cross Domain Calls --> Ok Ready
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $routeProvider.when('/', {templateUrl:'views/main.html', controller:'gbApp.controllers.MainCtrl'});
        $routeProvider.when('/register', {templateUrl:'views/register.html', controller:'gbApp.controllers.RegisterCtrl'});
        $routeProvider.when('/login', {templateUrl:'views/login.html', controller:'gbApp.controllers.LoginCtrl'});
        $routeProvider.when('/myschedule', {
            templateUrl:'views/myschedule.html',
            controller:'gbApp.controllers.MyScheduleCtrl',
            resolve: {
                myschedule: appCtrl.getArtistsInMySchedule
            }});
        $routeProvider.when('/lineup', {
            templateUrl:'views/lineup.html',
            controller:'gbApp.controllers.LineUpCtrl',
            resolve: {
                artists: appCtrl.getDataArtists
            }});
        $routeProvider.when('/stage/:stageId/artist/:artistId', {
            templateUrl:'views/artist.html',
            controller:'gbApp.controllers.ArtistCtrl',
            resolve: {
                artists: appCtrl.getDataArtists
            }});
        $routeProvider.when('/publictransport', {
            templateUrl:'views/publictransport.html',
            controller:'gbApp.controllers.PublicTransportCtrl',
            resolve: {
                geolocation: appCtrl.getGeoloc
        }});

        $routeProvider.when('/map', {templateUrl:'views/map.html', controller:'gbApp.controllers.MapCtrl'});
        $routeProvider.when('/findyourtentje', {
            templateUrl:'views/findyourtentje.html',
            controller:'gbApp.controllers.FindYourTentjeCtrl'
        });
        $routeProvider.when('/profile', {templateUrl:'views/profile.html', controller:'gbApp.controllers.ProfileCtrl'});
        $routeProvider.when('/checklist', {templateUrl:'views/checklist.html', controller:'gbApp.controllers.ChecklistCtrl'});
        $routeProvider.when('/carpooling', {
            templateUrl:'views/carpooling.html',
            controller:'gbApp.controllers.CarpoolingCtrl',
            resolve:{
                geolocation: appCtrl.getGeoloc
            }
        });
        $routeProvider.when('/settings', {
            templateUrl:'views/settings.html', 
            controller:'gbApp.controllers.SettingsCtrl',
            resolve:{
                geolocation: appCtrl.getGeoloc
            }
        });
        $routeProvider.when('/about', {templateUrl:'views/about.html', controller:'gbApp.controllers.AboutCtrl'});
        $routeProvider.when('/app', {
            templateUrl:'views/app.html',
            controller:'AppCtrl',
            resolve: {
                appInitialized: appCtrl.loadData
            }});
        $routeProvider.when('/transport/:id', {
            templateUrl:'views/transport.html',
            controller:'gbApp.controllers.TransportCtrl'
        });
        $routeProvider.otherwise({redirectTo: '/'});
    }])
.run(['$rootScope', '$timeout', '$location', '$window', '$http', 'localStorageService',function($rootScope, $timeout, $location, $window, $http, localStorageService){
        $rootScope.URLAPI = "http://192.168.1.144/nmdadiii/geekbeats/laravel/public/api";
        $rootScope.appInitialized = false;
        $rootScope.$on('$routeChangeStart', function(event, next, current){
           if(!$rootScope.appInitialized){
               $location.path('/app');
           }else if($rootScope.appInitialized && $location.path() === '/app'){
               $location.path('/');
           }
        })
        $rootScope.goBack = function(){
            setTimeout(function() {
              $window.history.back();
            },100);
        }
        $rootScope.logOut = function(){
            $http.defaults.headers.common.Authorization = "";
            $rootScope.user = '';
            localStorageService.remove('user');
            window.location.reload();

        }        
        $rootScope.refreshUser = function(){
            $http({method: 'GET', url: $rootScope.URLAPI + "/user/info"})
            .success(function(data, status, headers, config) {
                if(data !== null){
                    $rootScope.user = data;
                }
            })
            .error(function(data, status, headers, config) {
               alert(error);
            });
        }
    }]);

/*
    AppCtrl
    =======
    Controller for the App
    ----------------------
    * Load Data Via the services
    * Return the promises
    * Resolve for each route
*/
var appCtrl = app.controller('AppCtrl', ['$scope', '$location', 'appInitialized', 'localStorageService', '$http', '$rootScope', function($scope, $location, appInitialized, localStorageService, $http, $rootScope){
    if(appInitialized){
        $location.path('/');
    }
    if(localStorageService.get('user') !== null){
        var user = localStorageService.get('user');
        $http.defaults.headers.common.Authorization = 'Basic ' + user;
        $http({method: 'GET', url: $rootScope.URLAPI + "/user/info"})
            .success(function(data, status, headers, config) {
                if(data !== null){
                    $rootScope.user = data;
                }
            })
            .error(function(data, status, headers, config) {
               alert(error);
            });
    }
}]);

appCtrl.loadData = ['$rootScope', '$q', '$timeout', 'gbApp.services.PerformanceSrvc', function($rootScope, $q, $timeout, PerformanceSrvc){
    var deferred = $q.defer();

    PerformanceSrvc.loadData().then(
        function(data){
            $timeout(function(){
                $rootScope.appInitialized = true;
                deferred.resolve(true);
            },2000);
        },
        function(error){
            deferred.reject(error);
            console.log(deferred.promise);
        }
    );

    return deferred.promise;
}];


appCtrl.getDataArtists = ['$q', 'gbApp.services.PerformanceSrvc', function($q, PerformanceSrvc){
    var deferred = $q.defer();

    PerformanceSrvc.getDataArtists().then(
        function(data){
            deferred.resolve(data);
        },
        function(error){
            deferred.reject(error);
        }
    );

    return deferred.promise;
}];


appCtrl.getArtistsInMySchedule = ['$q', 'gbApp.services.PerformanceSrvc', function($q, PerformanceSrvc){
    var deferred = $q.defer();

    PerformanceSrvc.getMySchedule().then(
        function(data){
            deferred.resolve(data);
        },
        function(error){
            deferred.reject(error);
        }
    );
    return deferred.promise;
}];

appCtrl.getGeoloc = ['$q', 'gbApp.services.GeolocSrvc', function($q, GeolocSrvc){
    var deferred = $q.defer();

    GeolocSrvc.getGeoLoc().then(
        function(data){
            deferred.resolve(data);
        },
        function(error){
            deferred.reject(error);
        }
    );
    return deferred.promise;
}];