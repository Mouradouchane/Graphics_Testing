import {line , line_with_colors } from "../../line.js";
import {point2D, point2D_with_color} from "../../point.js";
import {draw} from "./code.js";
import {RGBA} from "../../color.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

var render_loop = 0;
var interval_testing = 0;
var anti_alias = 0;
var gradient = 1;
var thickness = 2;


var line_a = new line( new point2D(600,500) , new point2D(10,10) , thickness , RGBA.random_color()); 
var line_b = new line( new point2D(20,300)  , new point2D(2,300) , thickness , RGBA.random_color()); 
var line_c = new line( new point2D(200,200) , new point2D(400,200) , thickness , RGBA.random_color()); 

var line_ag = new line_with_colors( 
    new point2D_with_color(100,190,RGBA.random_color() ) , 
    new point2D_with_color(500,244,RGBA.random_color()) ,
    thickness
); 
var line_bg = new line_with_colors( 
    new point2D_with_color(120,450,RGBA.random_color()) , 
    new point2D_with_color(407,370,RGBA.random_color()) ,
    thickness 
); 
var line_cg = new line_with_colors( 
    new point2D_with_color(310,111,RGBA.random_color()) , 
    new point2D_with_color(58,220,RGBA.random_color()) ,
    thickness 
); 

function check_line( LINE = new line() ){

    ctx.fillStyle = (LINE instanceof line ) ? "yellow" : "cyan";
    ctx.beginPath();

    ctx.arc(LINE.p1.x, LINE.p1.y, 2 , 0, Math.PI * 2);
    ctx.arc(LINE.p2.x, LINE.p2.y, 2 , 0, Math.PI * 2);
    
    ctx.fill();
}

function clear_frame(){
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect( 0 , 0 , canvas.clientWidth , canvas.clientHeight );
}

function new_frame(){

    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
   
    if(gradient){
        
        draw.line_with_gradient( canvas , line_ag );
        draw.line_with_gradient( canvas , line_bg );
        draw.line_with_gradient( canvas , line_cg );
 
        check_line( line_ag );
        check_line( line_bg );
        check_line( line_cg );
    }
    else {

        draw.line( canvas , line_b );
        draw.line( canvas , line_c );
        draw.line( canvas , line_a );

        check_line( line_a );
        check_line( line_b );
        check_line( line_c );
    }
    

}

function render(){

    clear_frame();
    new_frame();

    requestAnimationFrame( render );

}

if( anti_alias ){
    ctx.imageSmoothingEnabled = true;
}
else 
    ctx.imageSmoothingEnabled = false;

if( render_loop ) render();
else {
    
    if( interval_testing ){
    setInterval(() => {

    line_a = new line( 
        new point2D(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight ) , 
        new point2D(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight )
    , thickness); 
    line_b = new line( 
        new point2D(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight ) , 
        new point2D(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight )
    , thickness); 
    line_c = new line( 
        new point2D(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight ) , 
        new point2D(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight )
    , thickness); 
    
    clear_frame();
    new_frame();

    }, 1000);

    }
    else{

        clear_frame();
        new_frame();

    }

}