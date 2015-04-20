function draw() {
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
	var shape, rect;
	var connect_couple, connect_first, connect_second;
	
	/* GOAL SHAPE */
	ctx.globalAlpha = 0.8;
	if (goal_shape != null) {
		for (i = 0; i < goal_shape.rectangles.length; i++) {
			rect = goal_shape.rectangles[i];
			ctx.fillStyle = rect.fill;
			ctx.fillRect (rect.x, rect.y, rect.w, rect.h);
			if (rect.neg) {
				ctx.drawImage(neg_img, rect.x + (rect.w / 2 - 15), rect.y + (rect.h / 2 - 15));
			}
			
		// Draws feint border around each rectangle.
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = "#fff";
			ctx.rect(rect.x, rect.y, 
			rect.w, rect.h);  
			ctx.stroke();
		}
	}
	
	ctx.globalAlpha = 1;
	for (i = 0; i < (shapes.length + hyp_shapes.length); i++) {
		if (i < shapes.length)
			shape = shapes[i];
		
		else {
			shape = hyp_shapes[i - shapes.length];
			ctx.globalAlpha = shape.opacity;
			ctx.beginPath();
			ctx.lineWidth = border_width;
			ctx.strokeStyle = border_colour_hyp;
			ctx.rect(shape.left.x - border_width / 2, shape.top.y - border_width / 2, 
			shape.width + border_width, shape.height + border_width);  
			ctx.stroke();
		}
		
		ctx.globalAlpha = shape.opacity;

		for (j = 0; j < shape.rectangles.length; j++) {
			rect = shape.rectangles[j];
			ctx.fillStyle = rect.fill;
			ctx.fillRect (rect.x, rect.y, rect.w, rect.h);
			if (rect.neg) {
				ctx.drawImage(neg_img, rect.x + (rect.w / 2 - 15), rect.y + (rect.h / 2 - 15));
			}
			
		// Draws feint border around each rectangle.
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = "#fff";
			ctx.rect(rect.x, rect.y, 
			rect.w, rect.h);  
			ctx.stroke();
		}
		
		if (shape.is_eligible) { 	
			ctx.beginPath();
			ctx.lineWidth = border_width;
			ctx.strokeStyle = border_colour_elig;
			ctx.rect(shape.left.x - border_width / 2, shape.top.y - border_width / 2, 
			shape.width + border_width, shape.height + border_width);  
			ctx.stroke();
		}
		
// 		else if(shape == hyp_1 || shape == hyp_2) {
// 			ctx.beginPath();
// 			ctx.lineWidth = border_width;
// 			ctx.strokeStyle = border_colour_hyp;
// 			ctx.rect(shape.left.x - border_width / 2, shape.top.y - border_width / 2, 
// 			shape.width + border_width, shape.height + border_width);  
// 			ctx.stroke();
// 		}
		
		if (shape.modus_selected) { 	
			ctx.beginPath();
			ctx.lineWidth = border_width;
			ctx.strokeStyle = border_colour_modus;
			ctx.rect(shape.left.x - border_width / 2, shape.top.y - border_width / 2, 
			shape.width + border_width, shape.height + border_width);  
			ctx.stroke();
		}
  	}
}

function get_eligible_shapes(selected_shape) {
	clear_eligible_shapes();

	var height = selected_shape.height;
	for (i = 0; i < shapes.length; i++) {
		var shape = shapes[i];
		if (selected_shape != shape) {
			if (shape.height == height)
				shape.is_eligible = true;
		}
	}	
}

function clear_eligible_shapes() {
	var shape;
	for (i = 0; i < (shapes.length + hyp_shapes.length); i++) {
		if (i < shapes.length)
			shape = shapes[shapes.length - 1 - i];
		
		else 
			shape = hyp_shapes[i - shapes.length];
		
		shape.is_eligible = false;
	}
}

function clear_modus_shapes() {
	var shape;
	for (i = 0; i < shapes.length; i++) {
		shape = shapes[i];
		shape.modus_selected = false;
	}
}

function clear_eligible_rects() {
	var shape, rect;
	for (i = 0; i < shapes.length; i++) {
		shape = shapes[i];
		for (j = 0; j < shape.rectangles.length; j++) {
			rect = shape.rectangles[j];
			rect.is_eligible = false;
		}
	}
}