$(document).ready(function () { 
	jQuery(function($) { 	
		var options = {
		  panelSelector: 'section',
		  namespace: '.panelSnap',
		  onSnapStart: function(){},
		  onSnapFinish: function(){},
		  onActivate: function(){},
		  directionThreshold: 50,
		  slideSpeed: 200,
		  easing: 'linear',
		  keyboardNavigation: {
			enabled: true,
			nextPanelKey: 40,
			previousPanelKey: 38,
			wrapAround: false
		  }
		};
	
		jQuery('body').panelSnap(options);
	});
});