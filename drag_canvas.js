/**
 *
 * Function based off the tutorial on
 * http://nickstips.wordpress.com/2011/03/14/html5-drag-and-drop
 * -multiple-objects-on-the-canvas-element/
 *
 */
function mouseDown(e) {
	getMouse(e);
	var shape;
//	Check to see if a shape on the canvas has been clicked.
	for (i = 0; i < (shapes.length + hyp_shapes.length); i++) {
		if (i < shapes.length)
			shape = shapes[shapes.length - 1 - i];

		else  
			shape = hyp_shapes[i - shapes.length];
			
		// Calculate boundaries of shape.
		var left = shape.left.x;
		var right = shape.left.x + shape.width;
		var top = shape.top.y;
		var bottom = shape.bottom.y + shape.height;
		// Determine if the shape was clicked
	
		if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom
		&& shape.opacity == 1) {
// 			if((horizontal_connect || vertical_connect) && !int_con) {
// 				get_eligible_shapes(shape);
				selected_shape = shape;		
// 			}
			
			if(modus_ponens) {
				modus_mouse_down(shape);
				return;
			}
			
			else if (flag_end) {
				end_flag(shape);
				return;
			}
			else if(return_bar) {
				
				add_to_button_holder(shape_to_div_converter(shape));
				shapes.splice((shapes.length - 1 - i),1);
				clear_return();
				clear_eligible_shapes();
				return_bar = false;
				$("#ret").removeClass("selected");
				return;
			}
			
			else {
				document.addEventListener('mousemove', mouseMove);
				document.addEventListener('touchmove', mouseMove);
				canvas.addEventListener('mouseup', mouseUp);
				canvas.addEventListener('touchend', mouseUp);
				shape.is_dragging = true;
				return;
			}
		}
	}
}

function modus_mouse_down(shape) {
	if (modus_1 == null) {
		shape.modus_selected = true;
		modus_1 = shape;
	}
	
	else {
		var ratio;
		if(shape != modus_1) {
			modus_2 = shape;
			modus_ponens = false;
			$("#imp_el").toggleClass("selected");
			if (modus_1.width > modus_2.width)
			ratio = modus_1.width / modus_2.width;
			else {
				ratio = modus_2.width / modus_1.width;
			}
			modus_ponens_check(modus_1, modus_2, ratio);
			clear_modus_shapes();
			canvas.removeEventListener('mousemove',mouseMoveModus);
		}
	}
}

function introduce_flag(flag_shape) {
	var shape;
	if (flag_shape == hyp_1)
		return;
		
	for (i = 0; i < shapes.length; i++) {
		shape = shapes[i];
		if(flag_shape != shape) {
			shape.opacity *= 0.5;
		}
	}
	
	if (flag_level == 1)
		hyp_1 = flag_shape;
	else if (flag_level == 2)
		hyp_2 = flag_shape;
	
	flag_level++;
	flag_introduction = !flag_introduction;
	$("#flag_in").removeClass("selected");
	canvas.removeEventListener('mousemove',mouseMoveReturn);
	clear_eligible_shapes();
}

function end_flag(flag_shape) {
	console.log(flag_shape);
	populate_shape_prev();
	var shape, hyp_shape;
	var delete_index = [];
	
	hyp_shape = hyp_shapes[hyp_shapes.length - 1];
	console.log(hyp_shape);

	if (flag_shape == hyp_shape) {
		return;
	}
	shapes.push(hyp_shapes.pop());
	connect_to_bottom(shapes[shapes.length - 1], flag_shape);
	for (i = 0; i < (shapes.length + hyp_shapes.length); i++) {
		if (i < shapes.length)
			shape = shapes[i];
		
		else 
			shape = hyp_shapes[shapes.length - i];
			
		if (shape.opacity != 1)
			shape.opacity *= 2;
		
		else if (i == (shapes.length - 1))
			continue; 
		
		else {
			delete_index.push(i);
		}
	}
	
	console.log(shapes);
	console.log(delete_index);
	for (i = delete_index.length - 1; i >= 0; i--)
		shapes.splice(delete_index[i],1);
	
	flag_end = !flag_end;
	$("#flag_end").removeClass("selected");
	canvas.removeEventListener('mousemove',mouseMoveReturn);
	clear_eligible_shapes();
}

function mouseMoveModus(e) {
	getMouse(e);
	clear_eligible_shapes();
//	Check to see if a shape on the canvas has been clicked.
	for (i = 0; i < (shapes.length + hyp_shapes.length); i++) {
		if (i < shapes.length)
			shape = shapes[shapes.length - 1 - i];
		
		else 
			shape = hyp_shapes[i - shapes.length];
		
		if (shape.modus_selected) {
			continue;
		}
		// Calculate boundaries of shape.
		var left = shape.left.x;
		var right = shape.left.x + shape.width;
		var top = shape.top.y;
		var bottom = shape.bottom.y + shape.height;
		// Determine if the shape was clicked
	
		if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom
		&& shape.opacity == 1) {
			shape.is_eligible = true;
			return;
		}
	}
}

function mouseMoveReturn(e) {
	getMouse(e);
	clear_eligible_shapes();
	
	for (var i = 0; i < shapes.length; i++) {
		var shape = shapes[shapes.length - 1 - i];
		// Calculate boundaries of shape.
		var left = shape.left.x;
		var right = shape.left.x + shape.width;
		var top = shape.top.y;
		var bottom = shape.bottom.y + shape.height;
		// Determine if the shape was clicked
	
		if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom 
		&& shape.opacity == 1) {
			shape.is_eligible = true;
			return;
		}
	}	
}

function proximity_check(selected_shape) {
	var change = false;
	var in_proximity = [];
	var closest_proximity, distance, shape;

	for (i = 0; i < shapes.length; i++) {
		shape = shapes[i];

		if (shape != selected_shape && shape.opacity == 1
		&& (shape != hyp_1 && shape != hyp_2)) {
			if (selected_shape.top.y > shape.top.y - range / 2 && 
				selected_shape.top.y + selected_shape.height < 
					shape.top.y + shape.height + range / 2) {
				if(selected_shape.left.x + selected_shape.width > shape.left.x - range
				&& selected_shape.left.x + selected_shape.width < shape.left.x) {
					distance = shape.left.x - (selected_shape.left.x + selected_shape.width);
					in_proximity.push(new Proximity(shape, window["connect_to_left"], distance));
				}

				else if(selected_shape.left.x < shape.left.x + shape.width + range
				&& selected_shape.left.x > shape.left.x + shape.width) {
					distance = selected_shape.left.x - (shape.left.x + shape.width);
					in_proximity.push(new Proximity(shape, window["connect_to_right"], distance));
				}
				
				change = true;
			}
		}
		shape.is_elgible = false;
	}
	
	for (i = 0; i < in_proximity.length; i++) {
		var current = in_proximity[i];
		if (closest_proximity == null || closest_proximity.distance > current.distance) {
			closest_proximity = current;
		}
	}

	if (closest_proximity != null)  {
		closest_proximity.shape.is_eligible = true;	
		closest_prox_global = closest_proximity;
	}

	return change;
}

function mouseMove(e) {
	e.preventDefault();
	clear_eligible_shapes();
	closest_prox_global = null;
	proximity_check(selected_shape);
	blockMenuHeaderScroll = true;
	for (i = 0; i < shapes.length; i++) {
		shape = shapes[i];
		if (shape.is_dragging) {
			getMouse(e);
			for (j = 0; j < shape.rectangles.length; j++) {
				var rect = shape.rectangles[j];
				rect.x = rect.x + changeInX;
				rect.y = rect.y + changeInY;
				
			/*
			 * TO DO: MAKE SHAPES GOING OUT OF BOUNDS STOP THE DRAG.
			 */
			}
		
			 // Update the variables indicating whether or not the mouse in on the canvas
			offX = (mouseX > CANVAS_RIGHT || mouseX < CANVAS_LEFT)
			offY = (mouseY > CANVAS_BOTTOM || mouseY < CANVAS_TOP)
		
			
		}
	}
}	

function clear_dragging_shapes() {
	for (i = 0; i < shapes.length; i++) {
		shapes[i].is_dragging = false;
	}
}

function mouseUp(e) {
// 	proximity_check(selected_shape);
	document.removeEventListener('mousemove', mouseMove);
	document.removeEventListener('touchmove', mouseMove);
	clear_eligible_shapes();
	clear_dragging_shapes();
	canvas.removeEventListener('mouseup', mouseUp);
	canvas.removeEventListener('touchend', mouseUp);
	
	if (mouseY > (360 - goal_area_height)) {
		goal_check(selected_shape); 	
	}
	
	if (closest_prox_global != null) {
		closest_prox_global.fun_call(closest_prox_global.shape, selected_shape);
		closest_prox_global = null;
	}
	selected_shape = null;
}

function goal_check(shape) {
	var equal_shape_rects;
	var shape_left = shape.left.x; 
	var shape_top = shape.top.y;
	var mag_x = goal_shape.width / shape.width;
	var mag_y = goal_shape.height / shape.height;
	
	enlarge_shape_x(shape, mag_x);
	enlarge_shape_y(shape, mag_y);
	
	translate_shape(shape, -shape_left, -shape_top);
	translate_shape(goal_shape, -(405 - goal_shape.width / 2), -(310 - goal_shape.height / 2));
			
	equal_shape_rects = common_rectangles(goal_shape, shape);
	
	if (equal_shape_rects.length == shape.rectangles.length &&
		equal_shape_rects.length == goal_shape.rectangles.length) {
		$("#level_complete").fadeIn('slow');
		timer_running = false;
	}
	
	enlarge_shape_x(shape, (1 / mag_x));
	enlarge_shape_y(shape, (1 / mag_y));
	
	translate_shape(shape, shape_left, shape_top);
	translate_shape(goal_shape, (405 - goal_shape.width / 2), (310 - goal_shape.height / 2));
	
	
}

/**
 * Transforms shape by enlarging with magnitude in the x direction
 */
function enlarge_shape_x(shape, magnitude) {
	var left = shape.left.x;
	var top = shape.top.y;
	var rect;
	
	translate_shape(shape, -left, -top);
	
	for (i = 0; i < shape.rectangles.length; i++) {
		rect = shape.rectangles[i];
		rect.x *= magnitude;
		rect.w *= magnitude;
	}
	

	translate_shape(shape, left, top);
}

/**
 * Transforms shape by enlarging with magnitude in the y direction
 */
function enlarge_shape_y(shape, magnitude) {
	var left = shape.left.x;
	var top = shape.top.y;
	var rect;
	
	translate_shape(shape, -left, -top);
	
	for (i = 0; i < shape.rectangles.length; i++) {
		rect = shape.rectangles[i];
		rect.y *= magnitude;
		rect.h *= magnitude;
	}
	
	translate_shape(shape, left, top);
}

/**
 * Transforms shape by enlarging with magnitude in the x and y direction
 */
function enlarge_shape(shape, magnitude) {
	var left = shape.left.x;
	var top = shape.top.y;
	var rect;
	
	translate_shape(shape, -left, -top);
	
	for (i = 0; i < shape.rectangles.length; i++) {
		rect = shape.rectangles[i];
		rect.x *= magnitude;
		rect.w *= magnitude;
		rect.y *= magnitude;
		rect.h *= magnitude;
	}
	
	translate_shape(shape, left, top);
}

$(document).ready(function () {
	canvas.addEventListener('mousedown', mouseDown); 
	canvas.addEventListener('touchstart', mouseDown);
});