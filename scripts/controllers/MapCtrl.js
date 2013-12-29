var dragging = false;

(function(){
    'use strict';

    var controllers = angular.module('gbApp.controllers');

    controllers.controller('gbApp.controllers.MapCtrl',['$scope', '$http', '$rootScope' ,function($scope, $http, $rootScope){

        $('.logout').hide();
        $('.goback').show();

        if($http.defaults.headers.common.Authorization !== null){
            $('.login').hide();
            $('.logout').show();
        }

        $scope.indicators;
    	$scope.zoominTimer;
    	$scope.zoomoutTimer;

    	$scope.initMap = function(){
    		Dimensions().set.Initialize();

			//ADD MOUSEWHEEL EVENT LISTENERS
			if(window.addEventListener)
			    document.addEventListener('DOMMouseScroll', MouseWheel, false);
			document.onmousewheel = MouseWheel;

			//ADD MOUSEMOVE EVENT LISTENER
			document.addEventListener('mousemove', MouseMove, false);

			//load indicators
			$http({method: 'GET', url: $rootScope.URLAPI + '/indicator' }).
                success(function(data, status) {
                    $scope.indicators = data;

                    console.log($scope.indicators);
                }).
                error(function() {
                    alert('error');
                })
			
    	}

    	$scope.zoom = {
			in: {
				mousedown: function(){
					var zoomin = function(){
						var dimensions = Dimensions().get.MapDimensions();
						Dimensions().set.MapDimensions(
							dimensions.width * 1.05,
							dimensions.height * 1.05 
						);
					}
					$scope.zoominTimer = setInterval(function(){
						zoomin();
						if(Dimensions().checkZoomBoundaries() != 0){
							clearInterval($scope.zoominTimer);
						} 
					}, 50);
				},
				mouseup: function(){
					clearInterval($scope.zoominTimer)
				}
			},
			out: {
				mousedown: function(){
					var zoomout = function(){
						var dimensions = Dimensions().get.MapDimensions();
						Dimensions().set.MapDimensions(
							dimensions.width * 0.95,
							dimensions.height * 0.95 
						);
					}

					$scope.zoomoutTimer = setInterval(function(){
						zoomout();
						if(Dimensions().checkZoomBoundaries() != 0){
							clearInterval($scope.zoomoutTimer);
						} 
					}, 50);
				},
				mouseup: function(){
					clearInterval($scope.zoomoutTimer)
				}
			}
    	}

    	$scope.dragstart = function(){
    		 dragging = true;
    	}

    	$scope.dragend = function(){
    		 dragging = false;
    	}

    	$scope.showDescription = function(index){
			$scope.activeIndicatorIndex = index;
    	}
    	$scope.hideDescription = function(){
			$scope.activeIndicatorIndex = -1;
    	}
    	$scope.isShowing = function(index){
    		console.log($scope.activeIndicatorIndex === index);
	        return  $scope.activeIndicatorIndex === index;
	    };
    }]);
})();

function Dimensions(){
	var map = $('#interactive_map');
	var container = $('#map_container');
	var that = this;

	this.getContainerDimensions = function(){
		return {
			width: container.width(),
			height: container.height()
		}
	}

	this.setContainerDimensions = function(){
		$('#content-wrapper').css({
			'padding': '0',
			'margin': '0'
		});

		container 	.height(($(window).height() - 70 )+ 'px')
					.width(($(window).width() - 10) + 'px');
	}
	
	this.initMapDimensions = function(){
		var dim = that.getOriginalDimensions()

	    map.css({
	    	'width' : dim.width + 'px',
	    	'height' : dim.height + 'px',
	    	'background-size' : '100% 100%'
	    });
	}
	this.getMapDimensions = function(){
		return {
			width: map.width(),
			height: map.height()
		}
	}
	this.setMapDimensions = function(width, height){
		map .height(height + 'px')
			.width(width + 'px');
	}

	this.getOriginalDimensions = function(){
		var imageSrc = map 	.css('background-image')
							.replace(/url\(['"]?(.*)['"]?\)/gi, '$1')
							.replace(/"/g,"")
							.split(',')[0];

	    var image = new Image();
			image.src = imageSrc;

		return {
			width: image.width,
			height: image.height
		}

	}

	this.checkZoomBoundaries = function(){
		var disabled = 0;
		var map_dimensions = that.getMapDimensions();
		var container_dimensions = that.getContainerDimensions();
		var originalimage_dimensions = that.getOriginalDimensions();

		if(map_dimensions.width*0.95*0.95 < container_dimensions.width ||
			map_dimensions.height*0.95*0.95 < container_dimensions.height){
			$('#zoomout').attr('disabled', 'disabled');
			disabled = -1;

		} else {
			$('#zoomout').removeAttr('disabled');
			disabled = 0;
		} 

		if(!disabled){
			if(map_dimensions.width > originalimage_dimensions.width ||
				map_dimensions.height > originalimage_dimensions.height){
				$('#zoomin').attr('disabled', 'disabled');
				disabled = 1;
			} else {
				$('#zoomin').removeAttr('disabled');
				disabled = 0;
			}
		}

		return disabled;
	}

	return {
		get: {
			MapDimensions: that.getMapDimensions,
			ContainerDimensions: that.getContainerDimensions
		},
		set: {
			Initialize: function(){
				that.setContainerDimensions();
				that.initMapDimensions();
			},
			ContainerDimensions: that.setContainerDimensions,
			MapDimensions: that.setMapDimensions
		}, 
		checkZoomBoundaries: that.checkZoomBoundaries
	}
}

function MouseWheel(event){
	if($('#interactive_map').is(':hover')){
		var delta = 0;

		if (!event) 
			event = window.event;

		// normalize the delta
		if (event.wheelDelta) {
		    delta = event.wheelDelta / 60;

		} else if (event.detail) {
		    delta = -event.detail / 2;
		}

		var disabled = Dimensions().checkZoomBoundaries();

		if(delta > 0 && disabled != 1) {
			var dimensions = Dimensions().get.MapDimensions();
			Dimensions().set.MapDimensions(
				dimensions.width * 1.05,
				dimensions.height * 1.05 
			);
		} else if (delta < 0 && disabled != -1) {
			var dimensions = Dimensions().get.MapDimensions();
			Dimensions().set.MapDimensions(
				dimensions.width * 0.95,
				dimensions.height * 0.95 
			);
		}
	}
}

var prevX = 0;
var prevY = 0;

function MouseMove(event){
	if(dragging){
		var map = $('#interactive_map');

		var left = parseInt(map.css('left').replace('px', ''));
		var top = parseInt(map.css('top').replace('px', ''));
		var mapDimensions = Dimensions().get.MapDimensions();
		var containerDimensions = Dimensions().get.ContainerDimensions();

		posX = event.clientX;
		posY = event.clientY;

		//direction: right
		if(posX < prevX && posY === prevY
			&& (left + mapDimensions.width) > containerDimensions.width){
			map.css('left', '-=4px')
		}

		//direction: left
		if(posX > prevX && posY === prevY
			&& left < 0){
			map.css('left', '+=4px')
		}

		//direction: up
		if(posX === prevX && posY < prevY
			&& (top + mapDimensions.height) > containerDimensions.height){
			map.css('top', '-=2px')
		}

		//direction: down
		if(posX === prevX && posY > prevY
			&& top < 0){
			map.css('top', '+=2px')
		}
		//direction: up right
		if(posX < prevX && posY < prevY
			&& (left + mapDimensions.width) > containerDimensions.width
			&& (top + mapDimensions.height) > containerDimensions.height){
			map.css({
				'left': '-=4px',
				'top': '-=2px'
			});
		}

		//direction: up left
		if(posX > prevX && posY < prevY
			&& (top + mapDimensions.height) > containerDimensions.height
			&& left < 0){
			map.css({
				'left': '+=4px',
				'top': '-=2px'
			});
		}

		//direction: down right
		if(posX < prevX && posY > prevY
			&& top < 0
			&& (left + mapDimensions.width) > containerDimensions.width){
			map.css({
				'left': '-=4px',
				'top': '+=2px'
			});
		}

		//direction: down left
		if(posX > prevX && posY > prevY
			&& top < 0
			&& left < 0){
			map.css({
				'left': '+=4px',
				'top': '+=2px'
			});
		}

	prevX = posX;
	prevY = posY;

	}
}