var shapes = [];
var hyp_shapes = [];
var shapes_prev = [];
var hyp_shapes_prev = [];
var prev_block_status = [];
var init_shape = [];
var closest_prox_global;
var mouseX;                         // Current mouse X coordinate
var mouseY;                         // Current mouse Y coordinate
var lastMouseX = 0;                 // The last seen mouse X coordinate
var lastMouseY = 0;                 // the last seen mouse Y coordinate
var changeInX;                      // The difference between the last and current mouse X coordinate
var changeInY;                      // The difference between the last and current mouse Y coordinate
var ctx;
var HEIGHT;
var WIDTH;
var INTERVAL = 20;					// How often to redraw the canavas (ms)
var CANVAS_LEFT = 9;
var CANVAS_RIGHT = 800;
var CANVAS_TOP = 9;
var CANVAS_BOTTOM = 350;
var offX;
var offY;
var range = 50;						// Threshold of closeness to canvas for action 
var border_colour_init = "#E48080";	
var border_colour_elig = "#8AE480";	// Border colour if hovered over block is able to connect
var border_colour_modus = "#E48080";// Border colour if selected for Modus Ponens
var border_colour_hyp = "#FFD700";
var border_width = 4;
var selected_shape = null;
var drag_new_shape;

var modus_1 = null;
var modus_2 = null;
var modus_ponens = false; 			// Modus Ponens mode (ON/OFF)

var block_size = 40;
var total_shape_width;
var total_shape_height;

var top_most_rect;                    // Stores the topmost rect 
var bottom_most_rect;                 // Stores the bottommost rect 
var left_most_rect;                   // Stores the leftmost rect 
var right_most_rect;                  // Stores the rightmost rect 

var return_bar = false;

var timer;
var timer_running = false;

var neg_img = new Image;
neg_img.src = "img/red_x_30.png";

var con_block_1 = null;
var con_block_2 = null;
var con_block_3 = null;
var con_block_4 = null;

var goal_area_height = 100;
var goal_area_width = 360;
var goal_shape = null;

var int_con = false;

var touch_el = null; // MAKE ENCAPSULATED

var current_level_game = 1;

var flag_introduction = false;
var flag_end = false;
var flag_level = 1;
var hyp_1 = null;
var hyp_2 = null;

function Rectangle(x, y, w, h, fill, neg) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.fill = fill;
	this.neg = neg;
}

function Shape(rectangles) {
	this.top = null;
	this.right = null;
	this.bottom = null;
	this.left = null;
	
	this.rectangles = rectangles;
	
	this.width = null
	this.height = null;
	
	this.is_dragging = false;
	this.is_eligible = false;
	
	this.selected = false;
	
	this.opacity = 1;
	this.modus_selected = false;
	
	this.hyp_keep = false // safely keep the shape when flag ends.
	
	refresh_shape_data(this);
	
}

function Proximity(shape, fun_call, distance) {
    this.shape = shape;
    this.fun_call = fun_call;
    this.distance = distance;
}

function increment_timer() {
	if (timer_running) {
		var time_string = document.getElementById("timer").innerHTML;
		var s = parseInt(time_string[4]);
		var s2 = parseInt(time_string[3]);
		var m = parseInt(time_string[1]);
		var m2 = parseInt(time_string[0]);
		if (s == 9) {
			s = 0;
			if (s2 == 5) {
				s2 = 0;
				if (m == 9) {
					m = 0;
					m2++;
				}
			
				else {
					m++;
				}
			}
		
			else {
				s2++;
			}
		}
	
		else {
			s++;
		}
	
		time_string = "" + m2 + m + ":" + s2 + s;	
		document.getElementById("timer").innerHTML = time_string;
	}
}	

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

var xml_string = '<?xml version="1.0" encoding="UTF-8"?> <levels> <level id="0"> <controls> <control>imp_el</control> <control>flag_in</control> <control>flag_end</control> <control>ret</control> </controls> <assumptions> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </assumption> </assumptions> <goal> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>80</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>40</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> </goal> </level> <level id="1"> <controls> </controls> <assumptions> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </assumption> </assumptions> <goal> <rectangle> <x>40</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </goal> </level> <level id="2"> <controls> <control>imp_el</control> </controls> <assumptions> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </assumption> </assumptions> <goal> <rectangle> <x>40</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </goal> </level> <level id="3"> <controls> <control>imp_el</control> </controls> <assumptions> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </assumption> </assumptions> <goal> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>40</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </goal> </level> <level id="4"> <controls> <control>imp_el</control> </controls> <assumptions> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </assumption> </assumptions> <goal> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>40</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> </goal> </level> <level id="5"> <controls> <control>imp_el</control> <!-- <control>ret</control> --> </controls> <assumptions> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>40</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>80</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> </assumption> </assumptions> <goal> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>80</w> <fill>rgb(238, 238, 238)</fill> <neg>FALSE</neg> </rectangle> </goal> </level> <level id="6"> <controls> <control>flag_in</control> <control>flag_end</control> </controls> <assumptions> </assumptions> <goal> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </goal> <hyps> <hyp> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </hyp> </hyps> </level> <level id="7"> <controls> <control>flag_in</control> <control>flag_end</control> </controls> <assumptions> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </assumption> </assumptions> <goal> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </goal> <hyps> <hyp> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </hyp> </hyps> </level> <level id="8"> <controls> <control>flag_in</control> <control>flag_end</control> <control>imp_el</control> </controls> <assumptions> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> </assumption> </assumptions> <goal> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>40</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>80</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </goal> <hyps> <hyp> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </hyp> </hyps> </level> <level id="9"> <controls> <control>flag_in</control> <control>flag_end</control> <control>imp_el</control> </controls> <assumptions> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>80</y> <h>40</h> <w>40</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> </assumption> </assumptions> <goal> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>80</y> <h>40</h> <w>40</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> </goal> <hyps> <hyp> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </hyp> <hyp> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </hyp> </hyps> </level> <level id="10"> <controls> <control>imp_el</control> <control>flag_in</control> <control>flag_end</control> <control>ret</control> </controls> <assumptions> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> </assumption> <assumption> <rectangle> <x>0</x> <y>0</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>80</y> <h>40</h> <w>40</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> </assumption> </assumptions> <goal> <rectangle> <x>0</x> <y>40</y> <h>40</h> <w>40</w> <fill>rgb(69, 155, 236)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>00</y> <h>40</h> <w>40</w> <fill>rgb(179, 98, 164)</fill> <neg>false</neg> </rectangle> <rectangle> <x>0</x> <y>80</y> <h>40</h> <w>40</w> <fill>rgb(238, 238, 238)</fill> <neg>false</neg> </rectangle> </goal> </level> </levels>'