import {RGBA} from "../../color.js";
import {line , line_with_colors} from "../../line.js";
import {point2D, point2D_with_color} from "../../point.js";
import {rectangle , rectangle_with_gradient} from "../../rectangle.js";
import {triangle2D} from "../../triangle.js";
import {generate} from "../../generators.js";
import {draw} from "./code.js";
import {circle2D} from "../../circle.js";
import {ellpise2D} from "../../ellipse.js";
import {check} from "../../check.js";
import {rotate} from "../../rotate.js";
import {plane2D} from "../../plane.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

/*
    rendering/drawing "sitting"
*/
var render_loop = 0;
var grid = 1;
var testing = 0;
var interval_testing = 0;
var interval_time = 1000;
var anti_alias = 0;
var shape_type = 6;
var thickness  = 2;
var max_width  = canvas.clientWidth-200;
var max_height = canvas.clientHeight-200;

/*
    generate random "shapes for testing"
*/
var lines = [ 
    ...generate.random.lines(max_width , max_height , 4 , thickness )
];

var rectangles = [
    ...generate.random.rectangles(max_width , max_height , 6 )
]; 

var triangles = [ 
    ...generate.random.triangles(max_width , max_height , 6 , thickness , true , false),
];

var circles = [
    // new circle2D( 200 , 200 , 50 , new RGBA(255,0,255) , 1 , new RGBA(255,0,255)),
    ...generate.random.cicrles(max_width , max_height , 6 , thickness , true , false)
];

var ellipses = [
    new ellpise2D(300,100,80,30,  rotate.random_z()  , RGBA.random_color(0)*0 , RGBA.random_color()) , 
    new ellpise2D(500,100,40,80, rotate.random_z() , RGBA.random_color(0)*0 , RGBA.random_color()) , 
    new ellpise2D(550,400,50,120, rotate.random_z() , RGBA.random_color(0)*0 , RGBA.random_color()) , 
    new ellpise2D(220,350,120,100, rotate.random_z()  , RGBA.random_color(0)*0 , RGBA.random_color()) , 
];

var planes = [
    new plane2D( 
        new point2D(251,80) , new point2D(400,180) , 
        new point2D(451,400) , new point2D(101,250) ,
        RGBA.random_color(1) , RGBA.random_color() , thickness 
    )
];

draw.set_canvas( canvas );
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
   
    switch( shape_type ){

        // lines
        case 1 : {
                
            for(let line of lines){
                draw.line( line );
                if( testing ) check.visual_check.line( line );
            }

        } break;

        // rectangles
        case 2 : {

            for(let rect of rectangles){
                draw.rectangle( rect );
                if( testing ) check.visual_check.rectangle( rect );
            }

        } break;

        // triangles 
        case 3 : {

            for(let trig of triangles){
                draw.triangle(trig);
                if( testing )  check.visual_check.triangle(trig);
            }
            
        } break;

        // cicrles
        case 4 : {

            for(let circle of circles ){

                draw.circle(circle);

                if( testing ) {
                    check.visual_check.circle( circle );
                }

            } 

        } break;

        // ellipses
        case 5 : {

            for(let ellipse of ellipses){
            
                draw.ellipse( ellipse );
                if( testing ) check.visual_check.ellipse( ellipse , true );

            }

        } break;

        // planes
        case 6 : {

            for(let plane of planes){

                draw.plane( plane );
                if(testing) check.visual_check.plane(plane);

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

            clear_frame();
            new_frame();

        } , interval_time );

    }
    else{

        clear_frame();
        new_frame();

    }

}