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

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

/*
    rendering/drawing "sitting"
*/
var render_loop = 0;
var testing = 1;
var interval_testing = 0;
var interval_time = 1000;
var anti_alias = 0;
var shape_type = 5;
var thickness  = 2;
var max_width  = canvas.clientWidth-20;
var max_height = canvas.clientHeight-20;

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
    new ellpise2D(200,200,120,40, Math.PI/2 ,new RGBA(255,255,0,0.5),new RGBA(255,0,255,0.7)) , 
    new ellpise2D(400,300,40,120,0,new RGBA(255,255,0,0.5),new RGBA(25,255,255,0.7)) , 
    new ellpise2D(550,400,60,120,4,new RGBA(255,255,0,0.5),new RGBA(25,255,255,0.7)) , 
    new ellpise2D(220,500,200,40,0,new RGBA(255,255,0,0.5),new RGBA(20,100,255,0.7)) , 
];

draw.set_canvas( canvas );
check.set.canvas( canvas );

/*
    render/frame functions
*/
function clear_frame(){

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect( 0 , 0 , canvas.clientWidth , canvas.clientHeight );

}

function new_frame(){

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

                if( testing ) check.visual_check.ellipse( ellipse );
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