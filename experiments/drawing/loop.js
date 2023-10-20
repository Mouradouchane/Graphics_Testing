import {draw} from "../../draw/draw.js";
import {RGBA} from "../../color.js";
import {line , line_with_colors} from "../../line.js";
import {point2D, point2D_with_color} from "../../point.js";
import {rectangle , rectangle_with_gradient} from "../../rectangle.js";
import {triangle2D} from "../../triangle.js";
import {generate} from "../../generators.js";
import {circle2D} from "../../circle.js";
import {ellipse2D} from "../../ellipse.js";
import {check} from "../../check.js";
import {rotate} from "../../rotate.js";
import {plane2D} from "../../plane.js";
import {CURVE_2D_3_POINTS , CURVE_2D_4_POINTS} from "../../curve.js";
import { frame_buffer } from "../../buffers.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const buffer = new frame_buffer( 800 , 600 );

/*
    rendering/drawing "options"
*/
var render_loop = 0;
var grid = 0;
var show_debug_points = 1;
var interval_testing = 0;
var interval_time = 3000;
var anti_alias = 0;
var shapes_type = 3;
var shapes_amount = 3;
var generate_random_shapes_each_time = 1;
var thickness  = 4;
var max_width  = canvas.clientWidth  / 1.5;
var max_height = canvas.clientHeight / 1.5;

/*
    generate random "shapes for testing"
*/
var lines = [
    ...generate.random.lines(shapes_amount , 0 , max_width , 0, max_height )
];

var rectangles = [
    ...generate.random.rectangles(shapes_amount , 0 , max_width , 0, max_height , null , true , null , true , 3)
]; 

var triangles = [ 
    // ...generate.random.triangles(1 , 0 , max_width , 0 ,max_height , 20 , null , new RGBA(255,150,111,0.7) , 1 ),
    /*
    new triangle2D( 
        new point2D(100, 200) ,
        new point2D(300, 200) ,
        new point2D(300, 240) ,
        thickness, 0 , 
        new RGBA(0,100,80,0.5) 
    ),
    new triangle2D( 
        new point2D(300 , 200-100) ,
        new point2D(100 , 200-100) ,
        new point2D(300 , 240-100) ,
        thickness, 
        new RGBA(0,100,80,0.5) , 0
    ),
    new triangle2D( 
        new point2D(200, 300) ,
        new point2D(200, 400) ,
        new point2D(100, 300) ,
        thickness, 
        new RGBA(150,100,180,0.5) , 0
    ),
    */
   
    new triangle2D( 
        new point2D(200, 400+110) ,
        new point2D(200, 300+110) ,
        new point2D(100, 300+110) ,
        14 , 
        new RGBA(150,100,180,0.5), new RGBA(255,0,0,0.7) ,
    ),

    new triangle2D( 
        new point2D(100, 100) ,
        new point2D(300, 100) ,
        new point2D(300, 300) ,
        10 , 
        new RGBA(150,100,180,0.5) , new RGBA(255,0,0,0.7) ,
    ),
    new triangle2D( 
        new point2D(600, 300) ,
        new point2D(500, 255) ,
        new point2D(400, 444) ,
        20 , 
        new RGBA(150,100,180,0.5) , new RGBA(255,0,0,0.7) ,
        ),
    ];

var circles = [
    //...generate.random.cicrles(shapes_amount , 0 , max_width , 0 , max_height , 2 , null , null , true)
    new circle2D( 250 , 300 , 50 , new RGBA(0,255,0, 0.4) ) ,
    new circle2D( 300 , 300 , 50 , new RGBA(0,0,255, 0.5) ) ,
    new circle2D( 270 , 250 , 50 , new RGBA(255,0,0, 0.6) ) ,
];

var ellipses = [
    // ...generate.random.ellipses(shapes_amount , 0 , max_width , 0 , max_height )
    // new ellipse2D(250,300, 50,150 , 0 , new RGBA(55,100,80,0.7) , new RGBA(155,80,208,0.5) , 16) , 
    new ellipse2D(201,300, 150,50 , 0.1 , new RGBA(105,200,180,0.7) , new RGBA(255,0,180,0.5) , 16) , 
];

var planes = [
    // ...generate.random.planes( shapes_amount , 0 , max_width , 0 , max_height , thickness)
    new plane2D( 
        new point2D(100,100) ,
        new point2D(100,400) ,
        new point2D(200,100) , 
        new point2D(200,400) , 
        new RGBA(255,0,180,0.5) 
    )
];

draw.set_canvas( canvas );
draw.set_buffer( buffer );
check.set.buffer( buffer );

/*
    render/frame functions
*/
function clear_canvas(){

    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect( 0 , 0 , canvas.clientWidth , canvas.clientHeight );

}

function clear_buffer(){
    buffer.clear();
}

function new_frame(){

    if( grid ) draw.draw_grid();
    
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";

    switch( shapes_type ){

        // lines
        case 1 : {
                
            for(let line of lines){

                draw.line( line );

                if( show_debug_points ) check.visual_check.line( line );
                
            }

        } break;

        // rectangles
        case 2 : {

            for(let rect of rectangles){

                draw.rectangle( rect ); 
  
                if( show_debug_points ) check.visual_check.rectangle( rect );

                if( generate_random_shapes_each_time ){
                    
                    rectangles = generate.random.rectangles(
                        shapes_amount , 0 , max_width , 0, max_height
                    )

                }
            }

        } break;

        // triangles 
        case 3 : {

            for(let trig of triangles){

                draw.triangle(trig);

                if( show_debug_points ) check.visual_check.triangle(trig);

                if( generate_random_shapes_each_time ){

                    triangles = generate.random.triangles(
                        shapes_amount , 0 , max_width/2 , 0, max_height/2 , 0 , new RGBA(150,150,55,0.7) , 0 
                    );

                }

            }
            
        } break;

        // cicrles
        case 4 : {

            for(let circle of circles ){

                draw.circle(circle);

                if( show_debug_points ) check.visual_check.circle( circle );
                

            } 

        } break;

        // ellipses
        case 5 : {

            for(let ellipse of ellipses){
            
                draw.ellipse( ellipse );

                if( show_debug_points ) check.visual_check.ellipse( ellipse , true );

            }

        } break;

        // planes
        case 6 : {

            for(let plane of planes){

                draw.plane( plane );

                if(show_debug_points) check.visual_check.plane(plane);

                if(generate_random_shapes_each_time){

                    planes = generate.random.planes( 
                        shapes_amount , 0 , max_width , 0, max_height
                    );

                }

            }

        } break;

        
    } // end of "switch-case"
    
    draw.render_buffer();

}

function render(){

    clear_canvas();
    clear_buffer();
    new_frame();

    requestAnimationFrame( render );

}

if( anti_alias )
    ctx.imageSmoothingEnabled = true;
else 
    ctx.imageSmoothingEnabled = false;


if( render_loop ) render();
else {
    
    if( interval_testing ){

        setInterval( () => {

            clear_canvas();
            new_frame();

        } , interval_time );

    }
    else{

        clear_canvas();
        new_frame();

    }

}