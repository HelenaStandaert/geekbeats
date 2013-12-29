(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.ChecklistCtrl',['$scope', '$rootScope', '$http',function($scope,$rootScope, $http){

        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }

        $http({
                method: 'GET',
                url: $rootScope.URLAPI + "/user/info"
            })
                .success(function(data, status, headers, config) {
                    if(data !== null){
                        $scope.todos = data.person.checklist;

                    }
                })
                .error(function(data, status, headers, config) {
                    alert('Error: ' + status + data)
                });

        $scope.addTodo = function() {
            var todos = $scope.todos;

            var count = 0;
            for (var todo in todos) {
                if (todos.hasOwnProperty(todo)) {
                    ++count;
                }
            }

            $scope.todos[count] = {
                "text": $scope.todoText,
                "done": "false"
            };
            $scope.todoText = '';
        };

        $scope.updateChecklist = function(){
            $rootScope.user.person.checklist = $scope.todos;

            $http({
                method: 'POST',
                url: $rootScope.URLAPI + '/user/info',
                data:  $rootScope.user
            })
                .success(function(data, status) {

                })
                .error(function(data, status) {
                    alert('Error: ' + status + data);
                })
        }
    }]);
})();
