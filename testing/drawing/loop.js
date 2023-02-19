import {RGBA} from "../../color.js";
import {line , line_with_colors} from "../../line.js";
import {point2D, point2D_with_color} from "../../point.js";
import {rectangle , rectangle_with_gradient} from "../../rectangle.js";
import {triangle2D} from "../../triangle.js";
import {generate} from "../../generators.js";
import {draw} from "./code.js";
import {circle2D} from "../../circle.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

/*
    rendering/drawing "sitting"
*/
var render_loop = 0;
var interval_testing = 0;
var interval_time = 3000;
var anti_alias = 0;
var shape_type = 4;
var thickness = 1;

/*
    generate/create "shapes for testing"
*/
var lines = [ 
    ...generate.random.lines(canvas.clientWidth-20 , canvas.clientHeight-20 , 4 , thickness )
];

var rectangles = [
    ...generate.random.rectangles(canvas.clientWidth/2 , canvas.clientHeight/2 ,6)
]; 

var triangles = [ 
    ...generate.random.triangles(canvas.clientWidth-10 , canvas.clientHeight-10 , 6 , thickness , true ),
];

var circles = [
    // new circle2D( 200 , 200 , 50 , new RGBA(255,0,255) , 1 , new RGBA(255,0,255)),
    ...generate.random.cicrles(canvas.clientWidth-100 , canvas.clientHeight-100 , 6 , thickness , false , true)
];

draw.set_canvas( canvas );

/*
    testing/check functions
*/
function check_point2D( point = new point2D() , point_size = 2){

    ctx.fillStyle = "cyan";

    ctx.beginPath();
    ctx.arc(point.x, point.y, point_size , 0, Math.PI * 2);
    ctx.fill();

}

function check_line( LINE = new line() , point_size = 2){

    ctx.fillStyle = (LINE instanceof line ) ? "yellow" : "cyan";

    ctx.beginPath();
    ctx.arc(LINE.p1.x, LINE.p1.y, point_size , 0, Math.PI * 2);
    ctx.arc(LINE.p2.x, LINE.p2.y, point_size , 0, Math.PI * 2);
    ctx.fill();

}

function check_rectangle( rect = new rectangle() , point_size = 2){

    //debugger
    let x = rect.position.x;
    let y = rect.position.y;
    let w = rect.width;
    let h = rect.height;

    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.arc( x , y , point_size , 0 , Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc( x+w , y , point_size , 0 , Math.PI * 2);
    ctx.fill();
 
    ctx.beginPath();
    ctx.arc( x , y+h , point_size , 0 , Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc( x+w , y+h , point_size , 0 , Math.PI * 2);
    ctx.fill();


}

function check_triangle( triangle = new triangle2D() ){

    check_point2D( triangle.a );
    check_point2D( triangle.b );
    check_point2D( triangle.c );

}

function check_circle( circle = new circle2D() ){

    check_point2D( new point2D(circle.x , circle.y) );
    check_point2D( new point2D(circle.x , circle.y + circle.r) );

}

/*
    render/frame functions
*/
function clear_frame(){

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect( 0 , 0 , canvas.clientWidth , canvas.clientHeight );

}

function new_frame(){

    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
   
    switch( shape_type ){

        // lines
        case 1 : {
                
            for(let line of lines){
                draw.line( line );
                check_line( line );
            }

        }

        // rectangles
        case 2 : {

            for(let rect of rectangles){
                draw.rectangle( rect );
                check_rectangle( rect );
            }

        } break;

        // triangles 
        case 3 : {

            for(let trig of triangles){
                draw.triangle(trig);
                check_triangle(trig);
                
            }
            
        } break;

        // cicrles
        case 4 : {

            for(let circle of circles ){

                draw.circle(circle);
                // check_circle(circle);

                ctx.strokeStyle = RGBA.to_string( circle.border_color );
                ctx.beginPath();
                ctx.arc( circle.x + circle.r*2 +10, circle.y, circle.r , 0 , Math.PI * 2);
                ctx.stroke();


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
    ctx.imageSmoothingEnabled = true;//
else 
    ctx.imageSmoothingEnabled = false;


if( render_loop ) render();
else {
    
    if( interval_testing ){

        setInterval(() => {

            lines = generate.random.lines(canvas.clientWidth-10 , canvas.clientHeight-10 , 6 , thickness);
            triangles = generate.random.triangles(canvas.clientWidth-10 , canvas.clientHeight-10 ,3,thickness);
        
            clear_frame();
            new_frame();

        } , interval_time );

    }
    else{

        clear_frame();
        new_frame();

    }

}