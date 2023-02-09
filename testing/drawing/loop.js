import {line , line_with_colors } from "../../line.js";
import {point2D, point2D_with_color} from "../../point.js";
import { rectangle , rectangle_with_gradient } from "../../rectangle.js";
import { generate } from "../../generators.js";
import {RGBA} from "../../color.js";
import {draw} from "./code.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

/*
    rendering/drawing sitting 
*/
var render_loop = 0;
var interval_testing = 0;
var interval_time = 4000;
var anti_alias = 0;
var gradient = 0;
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

var lines_g = generate.random.lines(canvas.clientWidth , canvas.clientHeight , 6 , thickness , true);

var rectangles = [ 
    new rectangle(250,340,350,50 , new RGBA(0,255,210,1), true , 5 , new RGBA(255,150,140,0.9)) , 
    // ...generate.random.rectangles(canvas.clientWidth/2 , canvas.clientHeight/2 ,6)
]; 

/*
    testing/check functions
*/
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
   
    if(gradient){
        
        for(let ln of lines_g){
            draw.line_with_gradient( canvas , ln );
            check_line( ln );
        }

    }
    else {
        
        for(let ln of lines){
            draw.algorithms.DDA_LINE_DRAW( canvas , ln );
            check_line( ln );
        }

    }

    for(let rect of rectangles){
        draw.rectangle( canvas , rect );
        // check_rectangle( rect );
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

            lines = generate_lines(6,false);
        
            clear_frame();
            new_frame();

        }, interval_time);

    }
    else{

        clear_frame();
        new_frame();

    }

}