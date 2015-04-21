function init() {       
	canvas = document.getElementById('canvas');      
	ctx = canvas.getContext('2d');
	
// Set how often the draw method will be called
	setInterval(draw, INTERVAL);
	$("canvas").attr('width', 810);
	$("canvas").attr('height', 360);
	HEIGHT = canvas.height;
	WIDTH = canvas.width;   
	
// 	timer = setInterval(increment_timer, 1000);
	
	load_level(current_level_game);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}



/**
 * EVENT LISTENERS
 */

/*
 * TOUCH START FOR BUTTONS
 */
 
 function button_touch_start(e) {
 	this.style.opacity = '0.4';
	e.preventDefault();
	if (e.stopPropagation) {
		e.stopPropagation(); // Stops some browsers from redirecting.
	}
	blockMenuHeaderScroll = true;
	document.addEventListener('touchend', button_touch_end);
	var new_rect = new Rectangle(0, 0, block_size, block_size, this.style.backgroundColor,
		this.classList.contains("neg"));
	touch_el = this;
 }
 
 function button_touch_end(e) {
	getMouse(e);
	
	if(mouseX > 0 && mouseX < 810 && mouseY > 0 && mouseY < 360)
		div_to_shape_converter(touch_el);
		
	else {
		touch_el.style.opacity = '1';
	}

	blockMenuHeaderScroll = false;
	document.removeEventListener('touchend', button_touch_end);
	clear_eligible_shapes();
 }

/*
 * DRAG START FOR BUTTONS
 */
function new_DragStart(e) {
	this.style.opacity = '0.4';
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/plain', $(this).attr("id"));
	var new_rect = new Rectangle(0, 0, block_size, block_size, this.style.backgroundColor,
		this.classList.contains("neg"));
	drag_new_shape = new Shape([new_rect]);
}

/*
 * ACTION PICK UP
 */
function action_start(e) {
	this.style.opacity = '0.4';
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/plain', $(this).attr("id"));
}

/*
 * ACTION DROP
 */
function action_drop(e) {
	getMouse(e);
	if (e.stopPropagation) {
		e.stopPropagation(); // Stops some browsers from redirecting.
	}
	
	this.classList.remove('over');  // this / e.target is previous target element.
	clear_eligible_shapes();
	e.preventDefault();
	return false; 
}

/*
 * DRAG ENTER
 */

function handleDragEnter(e) {
// this / e.target is the current hover target.
	this.classList.add('over');
}

/*
 * DRAG OVER
 */
 
function handleDragOver(e) {
  if (e.preventDefault) {
	e.preventDefault(); // Necessary. Allows us to drop.
  }

	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
	
	return false;
}

/*
 * DRAG LEAVE
 */
function handleDragLeave(e) {
	this.classList.remove('over');  // this / e.target is previous target element.
	clear_eligible_shapes();
}

/*
 * DRAG END
 */
 function handleDragEnd(e) {
  // this/e.target is the source node.
	this.style.opacity = '1'; 
// 		var val = this.getElementsByTagName("SPAN")[0].innerHTML;
// 		if(val != 0 && isNumber(val)) {
// 			this.getElementsByTagName("SPAN")[0].innerHTML--;
// 		}
// 		
// 		if (this.getElementsByTagName("SPAN")[0].innerHTML == 0) {
// 			this.setAttribute("draggable", "false");
// 			for(i = 0; i < this.children.length; i++) {
// 				this.children[i].setAttribute("draggable", "false");
// 			}
// 		}
	
}

/*
 * DROP
 */
function handleDrop(e) {
	getMouse(e);
	if (e.stopPropagation) {
		e.stopPropagation(); // Stops some browsers from redirecting.
	}
	var msg = e.dataTransfer.getData('text/plain');
	var el = document.getElementById(msg);
	if ($(el).find(".sub_button").size() == 0) {
		insert_shape_to_canvas(el);	
	}
	
	else {
		div_to_shape_converter("#" + msg);
	}

	this.classList.remove('over');  // this / e.target is previous target element.
	clear_eligible_shapes();
	e.preventDefault();
	return false;   
}

function set_button_ids() {
	var buts = $('.button_holder .button:not(.action)');
	var acts = $('.button_holder .action');
	
	[].forEach.call(acts, function(act) {
		act.addEventListener('dragstart', action_start, false);
// 		act.addEventListener('touchstart', button_touch_start, false);
		act.addEventListener('dragend', handleDragEnd, false);
		act.addEventListener('dragover', handleDragOver, false);
	});
	
	[].forEach.call(buts, function(but) {
	  but.addEventListener('dragstart', new_DragStart, false);
	  but.addEventListener('touchstart', button_touch_start, false);
	  but.addEventListener('dragend', handleDragEnd, false);
	  
	  but.addEventListener('dragover', handleDragOver, false);
	});	
	
	$(".button:not(.action)").each(function(i) {
		$(this).attr("id", "button-" + i);
	});
	
	$(".action").each(function(i) {
		$(this).attr("id", "action-" + $(this).find("div span").text().toLowerCase());
	});
}

function get_shape_width(shape) {
	var far_left = shape.left.x;
	var far_right = shape.right.x + shape.right.w;
	
	shape.width = far_right - far_left;
}

function get_shape_height(shape) {
	var far_top = shape.top.y;
	var far_bottom = shape.bottom.y + shape.bottom.h;
	
	shape.height = far_bottom - far_top;
}

// Finds the top, bottom, left, and rightmost rects of the selected shape.
function get_extreme_rects(shape) {
	shape.top = shape.top;              
	shape.left = null;
	shape.right = null;
	shape.bottom = null;
    for (var i = 0; i < shape.rectangles.length; i++) {
        var rect = shape.rectangles[i];
			   
		if (shape.top == null || rect.y < shape.top.y)
			shape.top = rect;

		if (shape.bottom == null || rect.y > shape.bottom.y)
			shape.bottom = rect;

		if (shape.left == null || rect.x < shape.left.x)
			shape.left = rect;

		if (shape.right == null || rect.x > shape.right.x)
			shape.right = rect;             
    }
}

function getMouse(e) {
	var element = canvas;
	var offsetX = 0;
	var offsetY = 0;

	// Calculate offsets
	if (element.offsetParent) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}   
 
	// Calculate the mouse location
	mouseX = e.pageX - offsetX;
	mouseY = e.pageY - offsetY;

	// Calculate the change in mouse position for the last
	// time getMouse was called
	changeInX = mouseX - lastMouseX;
	changeInY = mouseY - lastMouseY;

	// Store the current mouseX and mouseY positions
	lastMouseX = mouseX;
	lastMouseY = mouseY;      
}

function connect_to_left(shape, selected_shape) {
	if (shape.height < selected_shape.height) {
		connect_to_right(selected_shape, shape);
		return;
	}
	populate_shape_prev();
    var delta_x = (shape.left.x - selected_shape.width) - selected_shape.left.x;
    var delta_y = shape.top.y - selected_shape.top.y;
	var ratio = shape.height / selected_shape.height;
	
	add_to_button_holder(shape_to_div_converter(shape));
	add_to_button_holder(shape_to_div_converter(selected_shape));
    for (i = 0; i < selected_shape.rectangles.length; i++) {
        var rect = selected_shape.rectangles[i];
        var new_x, new_y, new_h;

        new_x = rect.x + delta_x;
        new_y = ((rect.y + delta_y - shape.top.y) * ratio) + shape.top.y;
        new_h = rect.h * ratio;
        
        shape.rectangles.push(rect);
        shape.rectangles[shape.rectangles.length - 1].x = new_x;
        shape.rectangles[shape.rectangles.length - 1].y = new_y;
//     	if (i = selected_shape.rectangles.length - 1) 
// 			shape.rectangles[shape.rectangles.length - 1].h = shape.width - new_h;
// 		
// 		else
			shape.rectangles[shape.rectangles.length - 1].h = new_h;
    }
    	
    refresh_shape_data(shape);
    shapes.splice(shapes.indexOf(selected_shape),1);
}

function connect_to_right(shape, selected_shape) {
	if (shape.height < selected_shape.height) {
		connect_to_left(selected_shape, shape);
		return;
	}
    populate_shape_prev();
    var delta_x = (shape.left.x + shape.width) - selected_shape.left.x;
    var delta_y = shape.top.y - selected_shape.top.y;
	var ratio = shape.height / selected_shape.height;
	
	add_to_button_holder(shape_to_div_converter(shape));
	add_to_button_holder(shape_to_div_converter(selected_shape));
	for (i = 0; i < selected_shape.rectangles.length; i++) {
		var rect = selected_shape.rectangles[i];
		var new_x, new_y, new_h;

		new_x = rect.x + delta_x;
		new_y = ((rect.y + delta_y - shape.top.y) * ratio) + shape.top.y;
		new_h = rect.h * ratio;
	
		shape.rectangles.push(rect);
		shape.rectangles[shape.rectangles.length - 1].x = new_x;
		shape.rectangles[shape.rectangles.length - 1].y = new_y;
// 		if (i = selected_shape.rectangles.length - 1) 
// 			shape.rectangles[shape.rectangles.length - 1].h = shape.width - new_h;
// 		
// 		else
			shape.rectangles[shape.rectangles.length - 1].h = new_h;
	
	}    	
    refresh_shape_data(shape);
    shapes.splice(shapes.indexOf(selected_shape),1);

}

function connect_to_top(shape, selected_shape) {
	if (shape.width < selected_shape.width) {
		connect_to_bottom(selected_shape, shape);
		return;
	}
    populate_shape_prev();
    var delta_x = shape.left.x - selected_shape.left.x;
    var delta_y = (shape.top.y - selected_shape.height) - selected_shape.top.y;
	var ratio = shape.width / selected_shape.width;
	
// 	add_to_button_holder(shape_to_div_converter(shape));
// 	add_to_button_holder(shape_to_div_converter(selected_shape));
	for (i = 0; i < selected_shape.rectangles.length; i++) {
		var rect = selected_shape.rectangles[i];
		var new_x, new_y, new_w;
		
		new_x = ((rect.x + delta_x - shape.left.x) * ratio) + shape.left.x;
		new_y = rect.y + delta_y;
		new_w = rect.w * ratio;
	
		shape.rectangles.push(rect);
		shape.rectangles[shape.rectangles.length - 1].x = new_x;
		shape.rectangles[shape.rectangles.length - 1].y = new_y;
		// if (i = selected_shape.rectangles.length - 1) 
// 			shape.rectangles[shape.rectangles.length - 1].w = shape.width - new_x;
// 		
// 		else
			shape.rectangles[shape.rectangles.length - 1].w = new_w;
	}
    refresh_shape_data(shape);
    shapes.splice(shapes.indexOf(selected_shape),1);

}

function connect_to_bottom(shape, selected_shape) {
	if (shape.width < selected_shape.width) {
		connect_to_top(selected_shape, shape);
		return;
	}
    populate_shape_prev();
    var delta_x = shape.left.x - selected_shape.left.x;
    var delta_y = shape.top.y - selected_shape.top.y + shape.height;
	var ratio = shape.width / selected_shape.width;

// 	add_to_button_holder(shape_to_div_converter(shape));
// 	add_to_button_holder(shape_to_div_converter(selected_shape));
	for (i = 0; i < selected_shape.rectangles.length; i++) {
		var rect = selected_shape.rectangles[i];
		var new_x, new_y, new_w;
		new_x = ((rect.x + delta_x - shape.left.x) * ratio) + shape.left.x;
		new_y = rect.y + delta_y;
		new_w = rect.w * ratio;
	
		shape.rectangles.push(rect);
		shape.rectangles[shape.rectangles.length - 1].x = new_x;
		shape.rectangles[shape.rectangles.length - 1].y = new_y;
// 		if (i = selected_shape.rectangles.length - 1) 
// 			shape.rectangles[shape.rectangles.length - 1].w = shape.width - new_x;
// 		
// 		else
			shape.rectangles[shape.rectangles.length - 1].w = new_w;
	}
    console.log(shape);    	
    refresh_shape_data(shape);
    shapes.splice(shapes.indexOf(selected_shape),1);

}

function insert_shape_to_canvas(el) {
	var in_span = el.getElementsByTagName("SPAN")[0].innerHTML;
	if (in_span != 0 && !el.classList.contains("action")) {
// 		alert(background);
		drag_new_shape.rectangles[0].x = mouseX - (block_size / 2);
		drag_new_shape.rectangles[0].y = mouseY - (block_size / 2);

		refresh_shape_data(drag_new_shape);

		populate_shape_prev();
		shapes.push(drag_new_shape);
		proximity_check(drag_new_shape);
		if (mouseY > (360 - goal_area_height)) 
			goal_check(drag_new_shape);
		drag_new_shape = null;

		el.getElementsByTagName("SPAN")[0].innerHTML = --in_span;
		if(in_span == 0) {
			$(el).attr("draggable", "false");
			$(el).find("*").each(function() {
				$(this).attr("draggable", "false");
			});
		}
	}
}

function undo() {
	shapes = [];
	hyp_shapes = [];
	var status, prev_status;
	var prev_shape, prev_hyp;
	remove_buttons();
	if (shapes_prev.length == 0) {
		return;
	}
	
	prev_shape = shapes_prev.pop();
	prev_hyp = hyp_shapes_prev.pop();
	if (prev_block_status.length == 0) {
		return;
	}
	
	status = prev_block_status.pop();
	for (i = 0; i < status.length; i++) {
		console.log(status[i]);
		$(".button_holder").append(status[i]);
	}
	var old_shape, old_opacity, old_rect, x, y, w, h, fill, neg, connected, new_rect;
	var rectangles;
	for (i = 0; i < prev_shape.length; i++) {
		old_shape = prev_shape[i];
		old_opacity = prev_shape[i].opacity
		rectangles = [];
		for (j = 0; j < old_shape.rectangles.length; j++) {
			old_rect = old_shape.rectangles[j];
			x = old_rect.x;
			y = old_rect.y;
			w = old_rect.w;
			h = old_rect.h;
			fill = old_rect.fill;
			neg = old_rect.neg;
			connected = old_rect.connected;
		
			new_rect = new Rectangle(x,y,w,h,fill,neg);
			new_rect.connected = old_rect.connected;
		
			rectangles.push(new_rect);
		}
		
		shapes.push(new Shape(rectangles));
		shapes[shapes.length - 1].opacity = old_opacity;
	}
	
	for (i = 0; i < prev_hyp.length; i++) {
		old_shape = prev_hyp[i];
		old_opacity = prev_hyp[i].opacity
		rectangles = [];
		for (j = 0; j < old_shape.rectangles.length; j++) {
			old_rect = old_shape.rectangles[j];
			x = old_rect.x;
			y = old_rect.y;
			w = old_rect.w;
			h = old_rect.h;
			fill = old_rect.fill;
			neg = old_rect.neg;
			connected = old_rect.connected;
		
			new_rect = new Rectangle(x,y,w,h,fill,neg);
			new_rect.connected = old_rect.connected;
		
			rectangles.push(new_rect);
		}
		
		hyp_shapes.push(new Shape(rectangles));
		hyp_shapes[hyp_shapes.length - 1].opacity = old_opacity;
	}
}

function restart() {
	var status;
	if (prev_block_status.length == 0) {
		return;
	}
	remove_buttons();
	shapes = [];
	hyp_shapes = [];
	status = prev_block_status[0];
	for (i = 0; i < status.length; i++) {
		$(".button_holder").append(status[i]);
	}
	prev_block_status = [];
	shapes_prev = []; 
}

function remove_buttons() {
	$(".button_holder .button").remove();
}

function populate_shape_prev() {
// 	shapes_prev = [];
// 	prev_block_status = [];
	var prev_push = [];
	var status_push = [];
	var status;
	
	$(".button_holder .button").each(function() {
		status_push.push($(this));
	});
	
	prev_block_status.push(status_push);

	var old_shape, old_opacity, old_rect, x, y, w, h, fill, neg, connected, new_rect;
	var rectangles;
	for (i = 0; i < shapes.length; i++) {
		rectangles = [];
		old_shape = shapes[i];
		old_opacity = shapes[i].opacity;
		for (j = 0; j < old_shape.rectangles.length; j++) {
			old_rect = old_shape.rectangles[j];
			x = old_rect.x;
			y = old_rect.y;
			w = old_rect.w;
			h = old_rect.h;
			fill = old_rect.fill;
			neg = old_rect.neg;
			connected = old_rect.connected;
		
			new_rect = new Rectangle(x,y,w,h,fill,neg);
			new_rect.connected = old_rect.connected;
		
			rectangles.push(new_rect);
		}
	
		prev_push.push(new Shape(rectangles));
		prev_push[prev_push.length - 1].opacity = old_opacity;
	}
	
	shapes_prev.push(prev_push);
	prev_push = [];
	
	for (i = 0; i < hyp_shapes.length; i++) {
		rectangles = [];
		old_shape = hyp_shapes[i];
		old_opacity = hyp_shapes[i].opacity;
		for (j = 0; j < old_shape.rectangles.length; j++) {
			old_rect = old_shape.rectangles[j];
			x = old_rect.x;
			y = old_rect.y;
			w = old_rect.w;
			h = old_rect.h;
			fill = old_rect.fill;
			neg = old_rect.neg;
			connected = old_rect.connected;
		
			new_rect = new Rectangle(x,y,w,h,fill,neg);
			new_rect.connected = old_rect.connected;
		
			rectangles.push(new_rect);
		}
	
		prev_push.push(new Shape(rectangles));
		prev_push[prev_push.length - 1].opacity = old_opacity;
	}
	
	hyp_shapes_prev.push(prev_push);
	
}

/*
 * THINGS TO AMMEND: WHEN SHAPE_1 == SHAPE_2.
 */
function modus_ponens_check(shape_1, shape_2, ratio) {
	var delta_x_1 = -(shape_1.left.x);
	var delta_x_2 = -(shape_2.left.x);
	var delta_y_1 = -(shape_1.top.y);
	var delta_y_2 = -(shape_2.top.y);
	
	translate_shape(shape_1, delta_x_1, delta_y_1);
	translate_shape(shape_2, delta_x_2, delta_y_2);
	
	equal_shape_width(shape_2, ratio);
	
	if (shape_1.height > shape_2.height)
		check_modus_shapes(shape_2, shape_1);
	else {
		check_modus_shapes(shape_1, shape_2);
	}
	
	equal_shape_width(shape_2, 1/ratio);
	
	translate_shape(shape_1, -delta_x_1, -delta_y_1);
	translate_shape(shape_2, -delta_x_2, -delta_y_2);
	
	clear_eligible_shapes();
}

/**
 * Make shapes equal width for correct checking.
 */
function equal_shape_width(shape, ratio) {
	var rect;
	for (i = 0; i < shape.rectangles.length; i++) {
		rect = shape.rectangles[i];

		rect.x *= ratio;
		rect.w *= ratio;
	}
	
	refresh_shape_data(shape);
}

function translate_shape(shape, delta_x, delta_y) {
	var rect;
	for (i = 0; i < shape.rectangles.length; i++) {
		rect = shape.rectangles[i];
		rect.x += delta_x;
		rect.y += delta_y;
	}
}

function clear_modus() {
	var shape;
	for (i = 0; i < (shapes.length + hyp_shapes.length); i++) {
		if (i < shapes.length)
			shape = shapes[i];
		
		else 
			shape = hyp_shapes[i - shapes.length];
		
		shape.modus_selected = false;
	}
	
	canvas.removeEventListener('mousemove', mouseMoveModus);
}	

function clear_return() {
	canvas.removeEventListener('mousemove', mouseMoveReturn);
}

function rectangle_eq_check(rect_1, rect_2) {
	if(rect_1.x != rect_2.x)
		return false;
	if(rect_1.y != rect_2.y)
		return false;
	if(rect_1.w != rect_2.w)
		return false;
	if(rect_1.h != rect_2.h)
		return false;
	if(rect_1.neg != rect_2.neg)
		return false;
	if(rect_1.fill != rect_2.fill)
		return false;
	
	return true;
}

function common_rectangles(shape_1, shape_2) {
	var equal_shape_rects = [];
	// Fills equal_shape_rects with common rectangles
	for (i = 0; i < shape_1.rectangles.length; i++) {
		rect_1 = shape_1.rectangles[i];
		for (j = 0; j < shape_2.rectangles.length; j++) {
			rect_2 = shape_2.rectangles[j];
			if (rectangle_eq_check(rect_1, rect_2)) {
				equal_shape_rects.push(clone_rect(rect_1));
				break;
			}
		}	
	}
	
	return equal_shape_rects;
}
/**
 * Takes shape_1 and shape_2, if shape_2 contains shape_1 on top, then create a new shape
 * with just the bottom difference of shape_2. shape_2 is the bigger shape.
 */
function check_modus_shapes(shape_1, shape_2) {
	var rect_1, rect_2, equal_shape, shape_2_copy, new_shape;
	var equal_shape_rects = [];
	var new_shape_rects = [];
	
	equal_shape_rects = common_rectangles(shape_1, shape_2);

			
	if (equal_shape_rects.length == shape_1.rectangles.length &&
		equal_shape_rects.length == shape_2.rectangles.length) 
			return;

	else if (equal_shape_rects.length > 0) 
		equal_shape = new Shape(equal_shape_rects);
				
	else {
		$("#modus_explain").fadeIn(500);
		return;	
	}

	// Continue if the equal shape is a full rectangle.
	if(full_shape_check(equal_shape, shape_1.width)) {
		shape_2_copy = clone_rect_array(shape_2.rectangles);

		// DELETE FROM SHAPE_2
		for (i = 0; i < equal_shape.rectangles.length; i++) {
			rect_1 = equal_shape.rectangles[i];
			for (j = 0; j < shape_2_copy.length; j++) {
				rect_2 = shape_2_copy[j];
				if (rect_2 != null) {
					if((rectangle_eq_check(rect_1, rect_2))) { 
						shape_2_copy[j] = null;
						break;
					}
				}
			}	
		}
 		
		for (i = 0; i < shape_2_copy.length; i++) {
			rect_1 = shape_2_copy[i];
			if (rect_1 != null) {
				new_shape_rects.push(rect_1);
			}
		}
		
		new_shape = new Shape(new_shape_rects);
		translate_shape(new_shape, 36, 12);
// 		shapes.push(new_shape);
		add_to_button_holder(shape_to_div_converter(new_shape));
		populate_shape_prev();
		clear_modus();
	}
}

function full_shape_check(shape, shape_width) {
	var shape_area = shape.height * shape_width;
	var check_shape_area = 0; // Current area of rectangles in var shape.
	var temp_area, temp_rect;
	for (i = 0; i < shape.rectangles.length; i++) {
		temp_rect = shape.rectangles[i];
		temp_area = temp_rect.h * temp_rect.w;
		
		check_shape_area += temp_area;
	}
	
	if (check_shape_area == shape_area)
		return true;
	else {
		return false;
	}
}

function clone_rect(rect_original) {
	var rect = new Rectangle;
	rect.x = rect_original.x;
	rect.y = rect_original.y;
	rect.w = rect_original.w;
	rect.h = rect_original.h;
	rect.fill = rect_original.fill;
	rect.neg = rect_original.neg;
	
	return rect;
}

function clone_shape(shape_original) {
	var rects = [];
	for (i = 0; i < shape_original.rectangles.length; i++) 
		rects.push(clone_rect(shape_original.rectangles[i]));
	return (new Shape(rects));
}

function clone_rect_array(rect_arr_original) {
	var rect_arr = [];
	for (i = 0; i < rect_arr_original.length; i++) {
		rect_arr.push(clone_rect(rect_arr_original[i]));
	} 
	
	return rect_arr;
}

function shape_to_div_converter(shape) {
	var div_string = '<div class="selector button" draggable="true" style="margin-right: 8px;"> ';
	var rect, rect_w, rect_h, rect_x, rect_y;
	var width_ratio = 40 / shape.width;
// 	div_string += 'data-wd="' + width_ratio + '" ';
	var height_ratio = 40 / shape.height;
// 	div_string += 'data-ht="' + height_ratio + '">';
	var left_pos = shape.left.x; // Left point of shape
	var top_pos = shape.top.y; // Top point of shape
	
	for (i = 0; i < shape.rectangles.length; i++) {
		rect = shape.rectangles[i];
		rect_w = rect.w * width_ratio;
		rect_h = rect.h * height_ratio;
		rect_x = (rect.x - left_pos) * width_ratio;
		rect_y = (rect.y - top_pos) * height_ratio;
		
		if(rect.neg)
			div_string += '<div class="sub_button neg" style="';
		else {
			div_string += '<div class="sub_button" style="';		
		}
		
		div_string += 'background-color: ' + rect.fill + '; ';
		div_string += 'width: ' + rect_w + '; ';
		div_string += 'height: ' + rect_h + '; ';
		div_string += 'left: ' + rect_x + '; ';
		div_string += 'top: ' + rect_y + ';"';
		div_string += 'data-t="' + (rect.y - top_pos) + '"';
		div_string += 'data-l="' + (rect.x - left_pos)  + '"';
		div_string += 'data-w="' + rect.w + '"';
		div_string += 'data-h="' + rect.h + '"></div>';
		
	}
	
	div_string += "</div>";
	return div_string;
}

function shape_to_div_converter_full(shape) {
	var div_string = '<div class="selector button" draggable="true" style="margin-right: 8px; ';
	div_string += 'height: ' + shape.height + 'px; ';
	div_string += 'width: ' + shape.width + 'px;"> ';
	var rect, rect_w, rect_h, rect_x, rect_y;

	var left_pos = shape.left.x; // Left point of shape
	var top_pos = shape.top.y; // Top point of shape
	
	for (i = 0; i < shape.rectangles.length; i++) {
		rect = shape.rectangles[i];
		rect_w = rect.w;
		rect_h = rect.h;
		rect_x = (rect.x - left_pos);
		rect_y = (rect.y - top_pos);
		
		if(rect.neg)
			div_string += '<div class="sub_button neg" style="';
		else {
			div_string += '<div class="sub_button" style="';		
		}
		
		div_string += 'background-color: ' + rect.fill + '; ';
		div_string += 'width: ' + rect_w + '; ';
		div_string += 'height: ' + rect_h + '; ';
		div_string += 'left: ' + rect_x + '; ';
		div_string += 'top: ' + rect_y + ';"';
		div_string += 'data-t="' + (rect.y - top_pos) + '"';
		div_string += 'data-l="' + (rect.x - left_pos)  + '"';
		div_string += 'data-w="' + rect.w + '"';
		div_string += 'data-h="' + rect.h + '"></div>';
		
	}
	
	div_string += "</div>";
	return div_string;
}

function div_full_to_div_hyp_converter(button) {
	var div_string = '<div class="selector button hyp_button" draggable="true" style="margin-right: 8px;">';
	var width_ratio = 40 / parseInt($(button).css("width"));
	var height_ratio = 40 / parseInt($(button).css("height"));
	$(button).find(".sub_button").each(function() {
		div_string += '<div class="sub_button" style="';
		
		div_string += 'background-color: ' + $(this).css("background-color") + '; ';
		div_string += 'width: ' + (parseInt($(this).css("width")) * width_ratio) + "px;";
		div_string += 'height: ' + (parseInt($(this).css("height")) * height_ratio) + "px;";
		div_string += 'left: ' + (parseInt($(this).css("left")) * width_ratio) + "px;";
		div_string += 'top: ' + (parseInt($(this).css("top")) * height_ratio) + "px;" + '"';
		div_string += 'data-t="' + $(this).data("t") + '"';
		div_string += 'data-l="' + $(this).data("l")  + '"';
		div_string += 'data-w="' + $(this).data("w") + '"';
		div_string += 'data-h="' + $(this).data("h") + '"></div>';
	});
	div_string += '</div>';
	
	return div_string;
}

function add_to_button_holder(div_string) {
	$(".button_holder").append(div_string);
	set_button_ids();
}

function div_to_shape_converter(button_id) {
	populate_shape_prev();
	var rects_array = [];
	var current_div, fill, x, y, h, w, neg, hr, wr;
	
	$(button_id).find(".sub_button").each(function(i) {
		fill = $(this).css("background-color");
		x = $(this).data("l");
		y = $(this).data("t");
		w = $(this).data("w");
		h = $(this).data("h");
		neg = $(this).hasClass("neg");
		
		rects_array.push(new Rectangle(x, y, w, h, fill, neg));
	});
	
	if($(button_id).hasClass("hyp_button")) {
		$(button_id).remove();
		var shape;
		
		for (i = 0; i < shapes.length; i++) {
			shape = shapes[i];
			shape.opacity *= 0.5;
		}
		
		for (i = 0; i < hyp_shapes.length; i++) {
			shape = hyp_shapes[i];
			shape.opacity *= 0.5;
		}
		
		hyp_shapes.push(new Shape(rects_array));
		translate_shape(hyp_shapes[hyp_shapes.length - 1], mouseX - (block_size / 2), 
		mouseY - (block_size / 2));
	}
	
	else {
		$(button_id).remove();
	
		shapes.push(new Shape(rects_array));
		translate_shape(shapes[shapes.length - 1], mouseX - (block_size / 2), 
			mouseY - (block_size / 2));
	
		proximity_check(shapes[shapes.length - 1]);
	
		if (closest_prox_global != null) {
			closest_prox_global.fun_call(closest_prox_global.shape, shapes[shapes.length - 1]);
			closest_prox_global = null;
		}
	
		if (mouseY > (360 -	goal_area_height))
			goal_check(shapes[shapes.length - 1]);
	}		
}

function append_control(id) {
	var control_string = '<div class="selector" style="margin-right: 8px;" id="' + id + '" title="';
	if (id == "imp_el")
		control_string += 'Modus Explonens"></div>';
	else if (id == "con_in")
		control_string += 'Conjunction Introduction"></div>';
	else if (id == "ret")
		control_string += 'Return to Bar"></div>';	
	else if (id == "flag_in")
		control_string += 'Introduce Flag"></div>';
	else if (id == "flag_end")
		control_string += 'Introduce Implication"></div>';
	
	$(".button_holder").append(control_string);
}

function refresh_shape_data(shape) {
	get_extreme_rects(shape);
	get_shape_width(shape);
	get_shape_height(shape);
}

function parse_rectangles(rect_container) {
	var rects = [];
	$(rect_container).find("rectangle").each(function() {
		x = parseInt($(this).find("x").text());
		y = parseInt($(this).find("y").text());
		w = parseInt($(this).find("w").text());
		h = parseInt($(this).find("h").text());
		fill = $(this).find("fill").text();
		neg = $(this).find("neg").text() === 'true';
		
		rects.push(new Rectangle(x, y, w, h, fill, neg));
	});
	
	return rects;
}

function clear_modes() {
	if($("#imp_in").hasClass("selected")) {
		$("#imp_in").toggleClass("selected");
		vertical_connect = !vertical_connect;
	}
	
	if($("#imp_el").hasClass("selected")) {
		$("#imp_el").toggleClass("selected");
		modus_ponens = !modus_ponens;
	}
	
	if($("#ret").hasClass("selected")) {
		$("#ret").toggleClass("selected");
		return_bar = !return_bar;
	}
	
	if($("#flag_in").hasClass("selected")) {
		$("#flag_in").toggleClass("selected");
		flag_introduction = !flag_introduction;
	}
	
	if($("#flag_end").hasClass("selected")) {
		$("#flag_end").toggleClass("selected");
		flag_end = !flag_end;
	}
}

function add_event_listeners() {
	$("#start_btn").off().click(function() {
		$("#level_start_template").fadeOut('slow');
		$("#level_start").fadeOut('slow', function() {
			timer_running = true;
		});
	});
	
	$(".hyp .button").off().click(function () {
		var div_string = div_full_to_div_hyp_converter($(this));
		add_to_button_holder(div_string);
		$("#hyp").fadeOut('slow');
		add_event_listeners();
	});
	
	$("#flag_end").off().click(function () {
		if($("#imp_in").hasClass("selected")) {
			$("#imp_in").toggleClass("selected");
			vertical_connect = !vertical_connect;
		}
	
		if($("#imp_el").hasClass("selected")) {
			$("#imp_el").toggleClass("selected");
			modus_ponens = !modus_ponens;
		}
	
		if($("#ret").hasClass("selected")) {
			$("#ret").toggleClass("selected");
			return_bar = !return_bar;
		}
	
		if($("#flag_in").hasClass("selected")) {
			$("#flag_in").toggleClass("selected");
			flag_introduction = !flag_introduction;
		}
		
		if (hyp_shapes.length != 0) {
			$(this).toggleClass("selected");
			flag_end = !flag_end;
		
			clear_modus();
			clear_return();
			if(flag_end) {
				canvas.addEventListener("mousemove", mouseMoveReturn);
			}
		}
		
		else {
			alert("HYPOTHESISE HYPOTHESISE");
		}
	});
	
	$("#flag_in").off().click(function () {
		$("#hyp").fadeIn('slow'); 
	});
	
	$("#ret").off().click(function () {
		if($("#imp_in").hasClass("selected")) {
			$("#imp_in").toggleClass("selected");
			vertical_connect = !vertical_connect;
		}
	
		if($("#imp_el").hasClass("selected")) {
			$("#imp_el").toggleClass("selected");
			modus_ponens = !modus_ponens;
		}
	
		if($("#flag_in").hasClass("selected")) {
			$("#flag_in").toggleClass("selected");
			flag_introduction = !flag_introduction;
		}
	
		if($("#flag_end").hasClass("selected")) {
			$("#flag_end").toggleClass("selected");
			flag_end = !flag_end;
		}

		$(this).toggleClass("selected");
		return_bar = !return_bar;
		
		clear_modus();
		clear_return();
		if(return_bar) 
			canvas.addEventListener("mousemove", mouseMoveReturn);
	});
	
	$("#imp_el").off().click(function () {
		if($("#imp_in").hasClass("selected")) {
			$("#imp_in").toggleClass("selected");
			vertical_connect = !vertical_connect;
		}
	
		if($("#ret").hasClass("selected")) {
			$("#ret").toggleClass("selected");
			return_bar = !return_bar;
		}
	
		if($("#flag_in").hasClass("selected")) {
			$("#flag_in").toggleClass("selected");
			flag_introduction = !flag_introduction;
		}
	
		if($("#flag_end").hasClass("selected")) {
			$("#flag_end").toggleClass("selected");
			flag_end = !flag_end;
		}
		
		$(this).toggleClass("selected");
		modus_ponens = !modus_ponens; 
		clear_modus();
		clear_return();
		if (modus_ponens) {
			modus_1 = modus_2 = null;
			canvas.addEventListener('mousemove', mouseMoveModus);
		}
            
		clear_return();
	});
	
	
	$(".button").attr("draggable", "true");
	
// 	$("#imp_in").off().click(function() {	
// 		if($("#imp_el").hasClass("selected")) {
// 			$("#imp_el").toggleClass("selected");
// 			modus_ponens = !modus_ponens;
// 		}
// 	
// 		if($("#ret").hasClass("selected")) {
// 			$("#ret").toggleClass("selected");
// 			return_bar = !return_bar;
// 		}
// 	
// 		if($("#flag_in").hasClass("selected")) {
// 			$("#flag_in").toggleClass("selected");
// 			flag_introduction = !flag_introduction;
// 		}
// 	
// 		if($("#flag_end").hasClass("selected")) {
// 			$("#flag_end").toggleClass("selected");
// 			flag_end = !flag_end;
// 		}
// 		
// 		$(this).toggleClass("selected");
// 		vertical_connect = !vertical_connect;
// 		
// 		clear_modus();
// 		clear_return();
// 	});
	
	var buts = $('.button_holder .button:not(.action)');
	var acts = $('.button_holder .action');
	
	[].forEach.call(acts, function(act) {
		act.addEventListener('dragstart', action_start, false);
// 		act.addEventListener('touchstart', button_touch_start, false);
		act.addEventListener('dragend', handleDragEnd, false);
		act.addEventListener('dragover', handleDragOver, false);
	});
	
	[].forEach.call(buts, function(but) {
	  but.addEventListener('dragstart', new_DragStart, false);
	  but.addEventListener('touchstart', button_touch_start, false);
	  but.addEventListener('dragend', handleDragEnd, false);
	  but.addEventListener('dragover', handleDragOver, false);
	});
}

function clear_level() {
	$("#timer").text("00:00");
	$(".button_holder").children().each(function () {
		$(this).remove();
	});
	
	shapes_prev = [];
	prev_block_status = [];
	
	shapes = [];
	hyp_shapes = [];
	// RESET MODES
	return_bar = modus_ponens = flag_introduction = false;
	flag_level = 1;
	hyp_1 = hyp_2 = null;
	
	$(".hyp .button").remove();
}

// function load_level(level_id) {
// 	var div_string;
// 	clear_level();
// 	$("#level_start_template").show();
// 	$("#loading").fadeIn('slow');
// 	
// 	setTimeout(function() { $.ajax({
// 			type: "GET",
// 			url: "../levels.xml",
// 			dataType: "xml",
// 			success: function(xml) {
// 				var current_level = $(xml).find("level[id=" + level_id + "]");
// 				var x, y, w, h, neg, fill;
// 				var rects = [];
// 
// 				$(current_level).find("controls").find("control").each(function() {
// 					append_control($(this).text());
// 				});
// 			
// 				$(current_level).find("assumptions").find("assumption").each(function() {
// 					div_string = shape_to_div_converter(new Shape (parse_rectangles(this)));
// 					add_to_button_holder(div_string);
// 				});
// 				
// 				$(current_level).find("hyps").find("hyp").each(function(i) {
// 					console.log("GET HYPE");
// 					div_string = shape_to_div_converter_full(new Shape (parse_rectangles(this)));
// 					$(".hyp:eq(" + i + ")").append(div_string);
// 				});
// 				
// 				$(".hyp .button").each(function() {
// 					$(this).css({"margin-left": -$(this).width() / 2 +"px"});
// 					$(this).css({"margin-top": -$(this).height() / 2 +"px"});
// 					$(this).find(".sub_button").each(function () {
// 						$(this).css({"border" : "1px solid #eee"});
// 					});
// 				});
// 			
// 				goal_shape = new Shape (parse_rectangles($(current_level).find("goal")));
// 			
// 				if (goal_shape != null) {
// 					translate_shape(goal_shape, -goal_shape.left.x, -goal_shape.top.y);
// 					translate_shape(goal_shape, 405 - goal_shape.width / 2, 310 - goal_shape.height / 2);
// 				}
// 			
// 				add_event_listeners();
// 			
// 				$("#level_id").text(level_id);
// 				$("#loading").fadeOut('slow', function () {
// 					$("#level_start").fadeIn("slow");
// 				});
// 				
// 				populate_shape_prev();
// 			}
// 		});
// 	}, 1000);
// }

function load_level(level_id) {
	var div_string;
	clear_level();
	$("#start_btn").click(function() {
		add_event_listeners();
		$("#level_start_template").fadeOut('slow');
		$("#level_start").fadeOut('slow', function() {
			timer_running = true;
		});
	});
	$("#level_start_template").show();
	$("#loading").fadeIn('slow');
	setTimeout(function() { 
				var xml = $.parseXML(xml_string);
				var current_level = $(xml).find("level[id=" + level_id + "]");
				var x, y, w, h, neg, fill;
				var rects = [];

				$(current_level).find("controls").find("control").each(function() {
					append_control($(this).text());
				});
			
				$(current_level).find("assumptions").find("assumption").each(function() {
					div_string = shape_to_div_converter(new Shape (parse_rectangles(this)));
					add_to_button_holder(div_string);
				});
				
				$(current_level).find("hyps").find("hyp").each(function(i) {
					console.log("GET HYPE");
					div_string = shape_to_div_converter_full(new Shape (parse_rectangles(this)));
					$(".hyp:eq(" + i + ")").append(div_string);
				});
				
				$(".hyp .button").each(function() {
					$(this).css({"margin-left": -$(this).width() / 2 +"px"});
					$(this).css({"margin-top": -$(this).height() / 2 +"px"});
					$(this).find(".sub_button").each(function () {
						$(this).css({"border" : "1px solid #eee"});
					});
				});
			
				goal_shape = new Shape (parse_rectangles($(current_level).find("goal")));
			
				if (goal_shape != null) {
					translate_shape(goal_shape, -goal_shape.left.x, -goal_shape.top.y);
					translate_shape(goal_shape, 405 - goal_shape.width / 2, 310 - goal_shape.height / 2);
				}
			
				add_event_listeners();
			
				$("#level_id").text(level_id);
				$("#loading").fadeOut('slow', function () {
					$("#level_start").fadeIn("slow");
				});
				
				populate_shape_prev();
	}, 1000);
}