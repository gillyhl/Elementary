$(document).ready(function () {

	var edu_width = 0;
	var tab_id = 1;
	var number_of_tabs = $(".education_content").size();
	var content_height;
	var margin_top;

	$(".education_content").each(function () {
		edu_width += parseInt($(this).css("width"));
	});
	
	edu_width += 4 * (number_of_tabs - 1);
	
	$("#education_holder").width(edu_width);
	
	$(".edu_right").click(function () {
		var button_clicked = $(this);
		if (tab_id != number_of_tabs) {
			var delta_left = -parseInt($(".education_content").css("width")) - 3.5;
			console.log(delta_left);
			var cur_left = parseInt($("#education_holder").css("left"));
			
			cur_left += delta_left;
			tab_id++;
			
			$("#education_holder").animate({left: cur_left + "px"}, 'slow', function () {
				if (button_clicked.hasClass("final")) {
					setCookie("education_done", 1, 365);
					$("#education .down_arrow").slideDown('slow');
					$("#game_rules").show();
					$("#education .down_arrow").click(function () {
						$('body').scrollTo($("section").outerHeight() * 2);
						console.log("HERE");
					});
				}
			});
			
		}
	});
	
	$(".edu_left").click(function () {
		if (tab_id != 1) {
			var delta_left = parseInt($(".education_content").css("width")) + 3.5;
			var cur_left = parseInt($("#education_holder").css("left"));
			
			cur_left += delta_left;
			
			$("#education_holder").animate({left: cur_left + "px"}, 'slow');
			tab_id--;
		}
	});
	
	var alternate_col_text = $("#alternate_col").html();
	var new_alternate_col_text = "";
	var spaces = 0;
	for (i = 0; i < alternate_col_text.length; i++) {
		if (alternate_col_text[i] == " ") {
			spaces++;
			new_alternate_col_text += " ";
			continue;
		}
		
		if ((i - spaces) % 2 == 0) {
			new_alternate_col_text += '<span class="pink_block">';
		}
		
		else {
			new_alternate_col_text += '<span class="blue_block">';
		}
		
		new_alternate_col_text += alternate_col_text[i];
		new_alternate_col_text += '</span>';
	}
	
	$("#alternate_col").html(new_alternate_col_text);
	
	$("#game_rules").hide();
	$("#game").hide();
	
});