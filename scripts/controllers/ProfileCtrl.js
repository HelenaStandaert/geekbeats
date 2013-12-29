(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.ProfileCtrl',['$scope', '$rootScope', '$http' ,function($scope, $rootScope, $http){
        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }
         $scope.showProfile = false;
         console.log($rootScope.user);
         $scope.errors = [];

        $scope.updateUser = function(){
            $http({
                method: 'POST',
                url: $rootScope.URLAPI + '/user/info',
                data:  $rootScope.user
            })
                .success(function(data, status) {
                    $('#myModal').modal('hide');
                })
                .error(function(data, status) {
                    alert('Error: ' + status + data);
                })
        }
        $scope.TogglePages = function(){
            $scope.showProfile = !$scope.showProfile;
            $('.nav-tabs li').each(function(){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }
            })
        }
        $scope.DeleteTransport = function(id){
            $http({
                method: 'POST', 
                url: $rootScope.URLAPI + '/transport/delete',
                data:  {id:id}
            }).success(function(data, status) {
                $rootScope.refreshUser();
                }).
                error(function(data, status) {
                })
        }
        $scope.confirmation = function(action, id){
            $('#confirmation').modal('show');
            $scope.action = action;
            $scope.confirmation_id = id;
        }
        $scope.execute = function(id){
            switch($scope.action){
                case 'approve':
                    $scope.approveRequest(id);
                    break;
                case 'decline':
                    $scope.declineRequest(id);
                    break;
            }
        }
        $scope.approveRequest = function(id){
            $http({
                method: 'POST', 
                url: $rootScope.URLAPI + '/transport/request/approve',
                data:  {id:id}
            }).success(function(data, status) {
                if(data.success){
                    $('#confirmation').modal('hide');
                    $rootScope.refreshUser();
                    $scope.showAlertSuccess = true;
                    $scope.success = data.text;
                } else {
                    $scope.showAlertErrors = true;
                    angular.forEach(data.text, function(value){
                        $scope.errors.push(value);
                    });
                }
            }).
            error(function(data, status) {
            })
        }
        $scope.declineRequest = function(id){
            $scope.errors = [];

            $http({
                method: 'POST', 
                url: $rootScope.URLAPI + '/transport/request/delete',
                data:  {id:id}
            }).success(function(data, status) {
                if(data.success){
                    $('#confirmation').modal('hide');
                    $rootScope.refreshUser();
                    $scope.showAlertSuccess = true;
                    $scope.success = data.text;
                } else {
                    $scope.showAlertErrors = true;
                    angular.forEach(data.text, function(value){
                        $scope.errors.push(value);
                    });
                }
                    
            }).
            error(function(data, status) {
            })
        }
        $scope.isApproved = function(approved){
            return approved !== null;
        }
        $scope.getUserRequests = function(){
            $http({
                method: 'POST', 
                url: $rootScope.URLAPI + '/transport/request/user',
                data:  {id:$rootScope.user.id},
            }).success(function(data, status) {
                $scope.userRequests = data;
            }).
            error(function(data, status) {
            })
        }
    }]);
})();
