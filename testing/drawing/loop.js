import {RGBA} from "../../color.js";
import {line , line_with_colors} from "../../line.js";
import {point2D, point2D_with_color} from "../../point.js";
import {rectangle , rectangle_with_gradient} from "../../rectangle.js";
import {triangle2D} from "../../triangle.js";
import {generate} from "../../generators.js";
import {draw} from "./code.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

/*
    rendering/drawing sitting 
*/
var render_loop = 0;
var interval_testing = 0;
var interval_time = 3000;
var anti_alias = 0;
var shape_type = 3;
var thickness = 1;

/*
    shapes for testing
*/
var lines = [ 
    new line(new point2D(200,200), new point2D(200,400) , thickness , RGBA.random_color()) ,
    new line(new point2D(420,570), new point2D(620,20)  , thickness , RGBA.random_color()) ,
    new line(new point2D(10,10)  , new point2D(100,100) , thickness , RGBA.random_color()) ,
    new line(new point2D(220,210), new point2D(230,400) , thickness , RGBA.random_color()) ,
    new line(new point2D(120,120), new point2D(320,120) , thickness , RGBA.random_color()) ,
    new line(new point2D(200,420), new point2D(400,410) , thickness , RGBA.random_color()) ,
];

var lines_g = generate.random.lines(canvas.clientWidth-10 , canvas.clientHeight-10 , 6 , thickness , true);

var rectangles = [ 
    new rectangle(250,340,350,50 , new RGBA(0,255,210,0.8), true ) , 
    // ...generate.random.rectangles(canvas.clientWidth/2 , canvas.clientHeight/2 ,6)
]; 

var triangles = [ 
    ...generate.random.triangles(canvas.clientWidth-10 , canvas.clientHeight-10 , 6 , thickness , true ),
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

        // line 
        case 1 : {
                
            for(let line of lines){
                draw.line( line );
                check_line( line );
            }

        }

        // rectangle
        case 2 : {

            for(let rect of rectangles){
                draw.rectangle( rect );
                check_rectangle( rect );
            }

        } break;

        // triangle 
        case 3 : {

            for(let trig of triangles){
                draw.triangle(trig);
                check_triangle(trig);
                
            }
            
        }

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