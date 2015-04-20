$(window).load(function() {
// When the page has loaded
// 	$("body").finish();
	setTimeout (function () {
	  scrollTo(0,0);
	 }, 100);
  $('body').on({
	'mousewheel': function(e) {
		e.preventDefault();
		e.stopPropagation();
		}
	});
	
	var animation_time = 1500;
	
	if(getCookie("visited") == 1)
		animation_time = 0;
		
	setCookie("visited", 1, 365);
	
	$("body").hide().fadeTo(animation_time ,1, function() {
		$("#introduction .soft_blur_overlay").hide().fadeTo(animation_time, 1,
					function() {
			$("#introduction h1").fadeTo(animation_time, 1, function () {
				$("#introduction h3").animate({
					opacity: "1",
					left: "0"}, animation_time, function() {
						$("#introduction .down_arrow").slideDown('slow', function () {	
							$('body').off('mousewheel');	
						});
					});
				});
			});
		});
		
	if (getCookie("education_done") == 1) {
		$("#game_rules").show();
		$("#education .down_arrow").show();
		$("#education .down_arrow").click(function () {
			$('body').scrollTo($("section").outerHeight() * 2);
			console.log("HERE");
		});
		if (getCookie("rules_done") == 1) {
			$("#game").show();
			$("#game_rules .down_arrow").show();
			$("#game_rules .down_arrow").click(function () {
				$('body').scrollTo($("section").outerHeight() * 3);
			});
		}
	}
	
	init();
});

$(document).ready(function () {
	
	$("#undo").click(function() {
		undo();
	});
	
	$("#restart").click(function() {
		restart();
	});
	
	$("#next_level").click(function() {
		$("#level_start_template").show();
		$("#level_complete").fadeOut('slow', function() {
			load_level(++current_level_game);
		});
	});
	
	$("#retry_level").click(function() {
		$("#level_start_template").show();
		$("#level_complete").fadeOut('slow', function() {
			load_level(current_level_game);
		});
	});
	
	$("#modus_explain").hide();
	
	$("#gotcha").click(function () {
		$("#modus_explain").fadeOut(500);
	});
	
	$("#level_complete").hide();
	
	$("#level_start").hide();
	
	$("#loading").hide();
	
	$("#level_start_template").hide();
	
	document.getElementById("canvas")
		.addEventListener('dragenter', handleDragEnter, false);
	document.getElementById("canvas")
		.addEventListener('dragleave', handleDragLeave, false);
	document.getElementById("canvas")
		.addEventListener('touchenter', handleDragEnter, false);
	document.getElementById("canvas")
		.addEventListener('touchleave', handleDragLeave, false);
	document.getElementById("canvas")
		.addEventListener('drop', handleDrop, false);
	document.getElementById("canvas")
		.addEventListener('touchend', handleDrop, false);
		
	$(".down_arrow").hide();
	
	$("#introduction .down_arrow").click(function () {
		$('body').scrollTo($('section').outerHeight());
		console.log("DRAG HERE");
	});	
});
