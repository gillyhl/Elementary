$(document).ready(function() {
	$(".hyp").append('<div class="selector button" draggable="true" style="margin-right: 8px; height: 40px; width: 80px;"> <div class="sub_button" style="background-color: rgb(69, 155, 236); width: 40; height: 40; left: 0; top: 0;"data-t="0"data-l="0"data-w="40"data-h="40"></div><div class="sub_button" style="background-color: rgb(179, 98, 164); width: 40; height: 40; left: 40; top: 0;"data-t="0"data-l="40"data-w="40"data-h="40"></div></div>');
	$(".hyp .button").each(function() {
		$(this).css({"margin-left": -$(this).width() / 2 +"px"});
		$(this).css({"margin-top": -$(this).height() / 2 +"px"});
		$(this).find(".sub_button").each(function () {
			$(this).css({"border" : "1px solid #eee"});
		});
	});
	
	$("#hyp_back").click(function () {
		$("#hyp").fadeOut('slow');
	});
	
});