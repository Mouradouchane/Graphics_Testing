import {RGBA} from "../../color.js";
import {line , line_with_colors} from "../../line.js";
import {point2D, point2D_with_color} from "../../point.js";
import {rectangle , rectangle_with_gradient} from "../../rectangle.js";
import {triangle2D} from "../../triangle.js";
import {generate} from "../../generators.js";
import {draw} from "./draw.js";
import {circle2D} from "../../circle.js";
import {ellipse2D} from "../../ellipse.js";
import {check} from "../../check.js";
import {rotate} from "../../rotate.js";
import {plane2D} from "../../plane.js";
import { frame_buffer } from "../../buffers.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const buffer = new frame_buffer( 800 , 600 );

/*
    rendering/drawing "options"
*/
var render_loop = 0;
var grid = 0;
var preforme_check = 0;
var interval_testing = 0;
var interval_time = 2000;
var anti_alias = 0;
var shapes_type = 5;
var shapes_amount = 3;
var generate_random_shapes_each_time = 0;
var thickness  = 2;
var max_width  = canvas.clientWidth  ;
var max_height = canvas.clientHeight ;

/*
    generate random "shapes for testing"
*/
var lines = [
    ...generate.random.lines(shapes_amount , 0 , max_width , 0, max_height )
];

var rectangles = [
    // ...generate.random.rectangles(shapes_amount , 0 , max_width , 0, max_height , null , true , null , true , 3)
]; 

var triangles = [ 
    ...generate.random.triangles(shapes_amount , 0 , max_width , 0 ,max_height , null , null , undefined , true ),
];

var circles = [
    //...generate.random.cicrles(shapes_amount , 0 , max_width , 0 , max_height , 2 , null , null , true)
    new circle2D( 250 , 300 , 50 , new RGBA(0,255,0, 0.4)) ,
    new circle2D( 300 , 300 , 50 , new RGBA(0,0,255, 0.5)) ,
    new circle2D( 270 , 250 , 50 , new RGBA(255,0,0, 0.6)) ,
];

var ellipses = [
    /*
    ...generate.random.ellipses(shapes_amount , 0 , max_width , 0 , max_height )

    new ellpise2D(300,100,80,30  , rotate.random_z() , RGBA.random_color(0)*0 , RGBA.random_color()) , 
    new ellpise2D(500,100,40,80  , rotate.random_z() , RGBA.random_color(0)*0 , RGBA.random_color()) , 
    */
    new ellipse2D(200,300, 150,150 , 0 , RGBA.random_color(0)*0 , new RGBA(255,0,180,0.5) , 4) , 
    // new ellipse2D(500,300, 320,50 , 0.5 , RGBA.random_color(0)*0 , new RGBA(255,0,180,0.5) , 4) , 
];

var planes = [
    ...generate.random.planes( shapes_amount , 0 , max_width , 0 , max_height , thickness )
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

                if( preforme_check ) check.visual_check.line( line );
                
            }

        } break;

        // rectangles
        case 2 : {

            for(let rect of rectangles){

                draw.rectangle( rect ); 
  
                if( preforme_check ) check.visual_check.rectangle( rect );

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

                if( preforme_check ) check.visual_check.triangle(trig);

                if( generate_random_shapes_each_time ){

                    triangles = generate.random.triangles(
                        shapes_amount , 0 , max_width , 0, max_height
                    );

                }

            }
            
        } break;

        // cicrles
        case 4 : {

            for(let circle of circles ){

                draw.circle(circle);

                if( preforme_check ) check.visual_check.circle( circle );
                

            } 

        } break;

        // ellipses
        case 5 : {

            for(let ellipse of ellipses){
            
                draw.ellipse( ellipse );

                if( preforme_check ) check.visual_check.ellipse( ellipse , true );

            }

        } break;

        // planes
        case 6 : {

            for(let plane of planes){

                draw.plane( plane );

                if(preforme_check) check.visual_check.plane(plane);

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