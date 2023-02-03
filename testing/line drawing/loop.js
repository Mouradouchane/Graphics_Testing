import {line} from "../../line.js";
import {point} from "../../point.js";
import {draw} from "./code.js";
import {RGBA} from "../../color.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

var render_loop = 0;
var interval_testing = 0;
var anti_alias = 0;

var thickness = 2;
var line_a = new line( new point(790,590) , new point(405,180) , thickness); 
var line_b = new line( new point(100,100) , new point(100,300) , thickness); // horizontal line
var line_c = new line( new point(200,200) , new point(400,200) , thickness); // vertical line

function clear_frame(){
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.clientWidth , canvas.clientHeight);
}

function new_frame(){

    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(200,250);
    ctx.lineTo(400,400);
    ctx.stroke(); 
    
    draw.line(canvas , line_b.p1 , line_b.p2 , line_b.width , new RGBA(255,0,0,1));
    draw.line(canvas , line_c.p1 , line_c.p2 , line_c.width , new RGBA(0,255,0,1));
    draw.line(canvas , line_a.p1 , line_a.p2 , line_a.width , new RGBA(0,255,255,1));
    
    /*
    let c1 = new RGBA(50,150,50,0.7);
    let c2 = new RGBA(144,144,105,0.8);

    ctx.fillStyle = RGBA.to_string(c1);
    ctx.fillRect( 10 , 10 , 100 , 100);

    ctx.fillStyle = RGBA.to_string(c2);
    ctx.fillRect( 10+50 , 10, 100 , 100);

    
    ctx.fillStyle = RGBA.to_string( RGBA.blend(c2,c1) );
    ctx.fillRect( 10+100 , 10+100 , 100 , 100);
    
    console.log( RGBA.to_string(c1) );
    console.log( RGBA.to_string(c2) );
    console.log( RGBA.to_string( RGBA.blend(c2,c1) ) );
    */
}

function render(){

    clear_frame();
    new_frame();

    requestAnimationFrame( render );

}

if( anti_alias ){
    ctx.imageSmoothingEnabled = true;
}
else ctx.imageSmoothingEnabled = false;

if( render_loop ) render();
else {
    
    if( interval_testing ){
    setInterval(() => {

    line_a = new line( 
        new point(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight ) , 
        new point(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight )
    , thickness); 
    line_b = new line( 
        new point(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight ) , 
        new point(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight )
    , thickness); 
    line_c = new line( 
        new point(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight ) , 
        new point(Math.random()*canvas.clientWidth , Math.random()*canvas.clientHeight )
    , thickness); 
    
    clear_frame();
    new_frame();

    }, 2000);

    }
    else{

        clear_frame();
        new_frame();

    }

}