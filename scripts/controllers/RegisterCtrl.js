(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.RegisterCtrl',['$scope', '$rootScope',function($scope, $rootScope){

        $('.logout').hide();
        $('.login').hide();
        $('.goback').show();

        $scope.register = function(){
    		$.ajax({
	            type:"POST",
	            dataType:"jsonp",
	            contentType:"application/json",
	            data: JSON.stringify($scope.user),
	            url: $rootScope.URLAPI + "/user/create",
	            beforeSend: function(xhr){
	                    
	            },
	            success:function(data){
	            	if(data.success){
        				console.log(data);
	            	} else {
	            		var _errors = $.map(data.text, function(value, index) {
						    return [value];
						});

	            		$scope.showErrors = true;
            			$scope.errors = _errors;
	            	}
	            },
	            error:function(xhr, status, error){
	            	var _errors = $.map(data.text, function(value, index) {
					    return [value];
					});

	            	$scope.showErrors = true;
        			$scope.errors = _errors;
	            }
	        });
    	}
    }]);
})();
