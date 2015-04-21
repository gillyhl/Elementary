$(document).ready(function () {

	var edu_width = 0;
	var tab_id = 1;
	var number_of_tabs = $(".game_rules_content").size();
	$(".game_rules_content").each(function () {
		edu_width += parseInt($(this).css("width"));
	});
	
	edu_width += 4 * (number_of_tabs - 1);
	
	
	$("#game_rules_holder").width(edu_width);
	
	$(".tut_right").click(function () {
		var button_clicked = $(this);
		if (tab_id != number_of_tabs) {
			var delta_left = -parseInt($(".game_rules_content").css("width")) - 3.5;
			var cur_left = parseInt($("#game_rules_holder").css("left"));

			cur_left += delta_left;
			tab_id++;
		
			$("#game_rules_holder").animate({left: cur_left + "px"}, 'slow', function () {
				if (button_clicked.hasClass("final")) {
					setCookie("rules_done", 1, 365);
					$("#game_rules .down_arrow").slideDown('slow');
					$("#game").show();
					$("#game_rules .down_arrow").click(function () {
						$('body').scrollTo($("section").outerHeight() * 3);
					});
				}
			});
		}
	});
	
	$(".tut_left").click(function () {
		if (tab_id != 1) {
			var delta_left = parseInt($(".game_rules_content").css("width")) + 3.5;
			var cur_left = parseInt($("#game_rules_holder").css("left"));

			cur_left += delta_left;
			
			$("#game_rules_holder").animate({left: cur_left + "px"}, 'slow');
			tab_id--;
		}
	});
});