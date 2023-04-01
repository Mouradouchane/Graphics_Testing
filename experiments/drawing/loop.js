import {RGBA} from "../../color.js";
import {line , line_with_colors} from "../../line.js";
import {point2D, point2D_with_color} from "../../point.js";
import {rectangle , rectangle_with_gradient} from "../../rectangle.js";
import {triangle2D} from "../../triangle.js";
import {generate} from "../../generators.js";
import {draw} from "./draw.js";
import {circle2D} from "../../circle.js";
import {ellpise2D} from "../../ellipse.js";
import {check} from "../../check.js";
import {rotate} from "../../rotate.js";
import {plane2D} from "../../plane.js";
import { frame_buffer } from "../../buffers.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

/*
    rendering/drawing "options"
*/
var render_loop = 0;
var grid = 0;
var preforme_check = 1;
var interval_testing = 0;
var interval_time = 2000;
var anti_alias = 0;
var shapes_type = 6;
var shapes_amount = 3;
var generate_random_shapes_each_time = 1;
var thickness  = 2;
var max_width  = canvas.clientWidth  - 100;
var max_height = canvas.clientHeight - 100;

/*
    generate random "shapes for testing"
*/
var lines = [
    // ...generate.random.lines(max_width , max_height , shapes_amount , thickness )
    new line( new point2D( 100 , 200 ) , new point2D( 500 , 200 ) , 2 , new RGBA(255,0,255,1) ),
    new line( new point2D( 300 , 50 )  , new point2D( 300 , 400 ) , 2 , new RGBA(255,0,255,1) ),
];

var rectangles = [
    ...generate.random.rectangles(max_width , max_height , shapes_amount )
]; 

var triangles = [ 
    ...generate.random.triangles(shapes_amount , 0 , max_width , 0 ,max_height , thickness ),
];

var circles = [
    // new circle2D( 200 , 200 , 50 , new RGBA(255,0,255) , 1 , new RGBA(255,0,255)),
    ...generate.random.cicrles(shapes_amount , 0 , max_width , 0 , max_height , thickness )
];

var ellipses = [
    new ellpise2D(300,100,80,30  , rotate.random_z() , RGBA.random_color(0)*0 , RGBA.random_color()) , 
    new ellpise2D(500,100,40,80  , rotate.random_z() , RGBA.random_color(0)*0 , RGBA.random_color()) , 
    new ellpise2D(550,400,50,120 , rotate.random_z() , RGBA.random_color(0)*0 , RGBA.random_color()) , 
    new ellpise2D(220,350,120,100, rotate.random_z() , RGBA.random_color(0)*0 , RGBA.random_color()) , 
];

var planes = [
    ...generate.random.planes( shapes_amount , 0 , max_width , 0 , max_height , thickness )
    /*
    new plane2D( 
        new point2D( 100 + (Math.random() * 200) , 200 ) , 
        new point2D( 300 + (Math.random() * 200) , 200 ) ,
        new point2D( 300 , 50 + (Math.random() * 200) ) ,
        new point2D( 300 , 250 + (Math.random() * 200) ) ,
        new RGBA(255,182,40,0.5) , RGBA.random_color() , thickness 
    )
    */
];

draw.set_canvas( canvas );
draw.set_buffer( new frame_buffer( 800 , 600 ) );
check.set.canvas( canvas );

/*
    render/frame functions
*/
function clear_frame(){

    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect( 0 , 0 , canvas.clientWidth , canvas.clientHeight );

}

function new_frame(){

    if( grid ) draw.draw_grid();
    
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";

    /*
    draw.line( lines[0] );
    draw.line( lines[1] );
    */
 
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
                        max_width , max_height , shapes_amount , thickness , true , false
                    )

                }
            }

        } break;

        // triangles 
        case 3 : {

            for(let trig of triangles){

                draw.triangle(trig);

                if( preforme_check )  check.visual_check.triangle(trig);
                if( generate_random_shapes_each_time ){

                    triangles = generate.random.triangles(
                        max_width , max_height , shapes_amount , thickness , true , false
                    );

                }

            }
            
        } break;

        // cicrles
        case 4 : {

            for(let circle of circles ){

                draw.circle(circle);

                if( preforme_check ) {
                    check.visual_check.circle( circle );
                }

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
                            max_width , max_height , shapes_amount , thickness , true , false , true , false
                    );

                }

            }

        } break;
    }
    
}

function render(){

    clear_frame();
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
          
            /*
            debugger
            */

            clear_frame();
            new_frame();

        } , interval_time );

    }
    else{

        clear_frame();
        new_frame();

    }

}