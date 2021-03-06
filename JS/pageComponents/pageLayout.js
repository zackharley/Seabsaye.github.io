angular.module("pageLayoutModule", ["constantsModule"])

.controller("pageLayoutController", ["$scope", "layoutDimensionsFactory", "constantsFactory", "buttonFactory", "hyperTextFactory", function($scope, layoutDimensionsFactory, constantsFactory, buttonFactory, hyperTextFactory) {

	//move to .ready eventually
	constantsFactory.setCONTENT_HOME_ID("#contentHome");
	constantsFactory.setFOOTER_ID("#sectionContact");
	constantsFactory.setHAMBURGER_BUTTON_ID("#hamburgerCollapseToggle");
	constantsFactory.setNAVBAR_ID("#navBar");
	constantsFactory.setNAVBAR_COLLAPSED_TAB_CONTAINER_ID("#collapsedNavBarTabContainer");
	constantsFactory.setNAVBAR_TABS_LIST_CLASS(".navBarTabsList");
	constantsFactory.setNAVBAR_TEXT_CLASS(".navBarText");
	constantsFactory.setLOADING_MASK_ID("#loadingMask");

	layoutDimensionsFactory.instantiateInitialHeight();
	layoutDimensionsFactory.heightResizeListener();

	$scope.augmentSize = function(elementEvent, sizeMultiplier) {

		var element = elementEvent.currentTarget;

		buttonFactory.augmentSize(element, sizeMultiplier);

	}

	$scope.augmentPosition = function(elementEvent, direction, displacement) {

		var element = elementEvent.currentTarget;

		buttonFactory.augmentPosition(element, direction, displacement);

	}

	$scope.onLinkHover = function(linkEvent) {

		var link = linkEvent.currentTarget;
		var elementType = "contentContainer";

		hyperTextFactory.enableHoverCSS(link, elementType);

	}

	$scope.offLinkHover = function(linkEvent) {

		var link = linkEvent.currentTarget;
		var elementType = "contentContainer";

		hyperTextFactory.disableHoverCSS(link, elementType);

	}

	$(window).load(function() {

		var loadingMask = constantsFactory.getLOADING_MASK_ID();

		$(loadingMask).fadeOut("slow");

	});


}])

.controller("scrollController", ["$scope", "triggerScrollFactory", function($scope, triggerScrollFactory) {

	$scope.scrollTo = function(scrollToElement) {
		triggerScrollFactory.navBarScroll(scrollToElement);
	}

}]) 

.factory("layoutDimensionsFactory", ["constantsFactory", function(constantsFactory) {
	
	//currently undefined... Fix!
	var contentHomeId = constantsFactory.getCONTENT_HOME_ID();

	return {

		instantiateInitialHeight: function() {

			var windowHeight = $(window).height();

			$("#contentHome").css({"height": windowHeight});

		},

		heightResizeListener: function() {

			$(window).resize(function() {

				var windowHeight = $(window).height();

				$("#contentHome").css({"height": windowHeight});

			});

		}

	}

}])

.factory("triggerScrollFactory", ["constantsFactory", function(constantsFactory) {

	var navBarId = constantsFactory.getNAVBAR_ID();
	var navBarCollapsed = constantsFactory.getNAVBAR_COLLAPSED_TAB_CONTAINER_ID();
	var hamburgerButtonId = constantsFactory.getHAMBURGER_BUTTON_ID();
	var navBarHeight = parseInt($(navBarId).css("height"));

	return {

		navBarScroll: function(scrollToElement) {

			var isExpanded = $(hamburgerButtonId).attr("aria-expanded");

			if (isExpanded == "true") {
				$(navBarCollapsed).collapse("hide");
			}

			var $root = $("html, body");

			$root.stop(true).animate({
				scrollTop: ($(scrollToElement).offset().top - navBarHeight)
			}, 600);

			return false;
		}

	}

}])

.factory("buttonFactory", function() {

	var priorElementProperties = {};

	return {

		upTheOpacity: function(element, alpha) {
			$(element).stop(true).animate({backgroundColor: jQuery.Color({alpha: alpha}) }, 225);
		},

		downTheOpacity: function(element) {
			$(element).stop(true).animate({backgroundColor: jQuery.Color({alpha: "0.00"}) }, 225);
		},

		augmentSize: function(element, sizeMultiplier) {

			var sizeOriginal;
			var sizeAugment;

			if (element === priorElementProperties.sizeElement) {

				sizeOriginal = priorElementProperties.size;
				sizeAugment = sizeOriginal * sizeMultiplier;

			} else {			

				sizeOriginal = parseInt($(element).css("fontSize"));
				sizeAugment = sizeOriginal * sizeMultiplier;
				priorElementProperties.size = sizeOriginal;
				priorElementProperties.sizeElement = element;

			}

			$(element).animate({fontSize: sizeAugment}, 225);
		},

		augmentPosition: function(element, direction, displacement) {

			var positionOriginal;
			var positionAugment;
			var displacementDirection;

			$(element).css({position: "relative"});

			switch (direction) {
				case "vertical":
					displacementDirection = "top";
					break;
				case "horizontal":
					displacementDirection = "left";
					break;
				default:
					console.log("invalid direction parameter");
			}

			//if element newly scrolled on
			if (element != priorElementProperties.positionElement) {

				if ($(element).css(displacementDirection) === "auto") {
					positionOriginal = 0;
				} else {
					positionOriginal = parseInt($(element).css(displacementDirection));
				}

				priorElementProperties.position = positionOriginal;
				priorElementProperties.positionElement = element;

			}

			positionAugment = priorElementProperties.position + displacement + "px";

			var displacementObject = {};

			displacementObject[displacementDirection] = positionAugment; 

			$(element).stop(true).animate(displacementObject);

		}

	}

})

.factory("hyperTextFactory", ["constantsFactory", function(constantsFactory) { 

	//var navBarId = constantsFactory.getNAVBAR_ID();
	var navBar = document.getElementById("navBar");
	var navBarTextResume = document.getElementById("navBarTextResume");
	var collapsedNavBarTextResume = document.getElementById("collapsableTextResume");
	var windowWidth = $(window).width();

	return {

		enableHoverCSS: function(element, elementType) {
			
			switch (elementType) {

				case "navBar":

					$(element).stop(true).animate({color: "#1AA0D6"}, 225);

					if (windowWidth < 768) {

						//reverts text colour of "Resume" in collapsable back to #000000 upon hovering onto other tabs
						if (element != collapsedNavBarTextResume) {
							if ($(collapsedNavBarTextResume).css("color") === "rgb(26, 160, 214)") {
								$(collapsedNavBarTextResume).animate({color: "#000000"}, 225);
							}
						}

					} else {

						if (element != navBarTextResume) {

							if ($(navBar).css("backgroundColor") === "rgba(0, 0, 0, 0)") {

								//reverts text colour of "Resume" in nav bar back to #FFFFFF upon hovering onto other tabs
								if ($(navBarTextResume).css("color") === "rgb(26, 160, 214)") {
									$(navBarTextResume).animate({color: "#FFFFFF"}, 225);
								}

							} else {

								//reverts text colour of "Resume" in nav bar back to #FFFFFF upon hovering onto other tabs
								if ($(navBarTextResume).css("color") === "rgb(26, 160, 214)") {
									$(navBarTextResume).animate({color: "#000000"}, 225);
								}

							}

						}

					}

					break;

				case "contentContainer":
					$(element).stop(true).animate({color: jQuery.Color({lightness: 0.37}) }, 225);
					break;
				default:
					//invalid elementType

			}

		},

		disableHoverCSS: function(element, elementType) {

			switch (elementType) {

				case "navBar":

					var whiteBackground = "rgb(255, 255, 255)";
					var verticalDisplacement = $(document).scrollTop();

					if ($("#navBar").css("background-color") === whiteBackground) {

						if (element === "#navBarTextName") {

							$(element).stop(true).animate({color: "#000000"}, 225);

							setTimeout(function() {

								if ($("#navBar").css("background-color") != whiteBackground) {
									$(element).stop(true).css({color: "#FFFFFF"});
								}

							}, 210);

						} else {
							$(element).stop(true).animate({color: "#000000"}, 225);
						}

					} else {

						//adjust accordingly if still scrolling
						//TODO: try window.onScroll?

						$(element).stop(true).animate({color: "#FFFFFF"}, 225);
						 
					}
	
					break;

				case "contentContainer":
					$(element).stop(true).animate({color: jQuery.Color({lightness: 0.45}) }, 225);
					break;
				default: 
					//invalid elementType

			}

		}

	}

}])