import {line} from "../../line.js";
import {point} from "../../point.js";
import {draw} from "./code.js";
import {rgb} from "../../color.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

var render_loop = 0;
var anti_alias = false;

var thick = 3;
var line_a = new line( new point(Math.random()*canvas.clientWidth + 10 ,50) , new point(50,200) , thick); 
var line_b = new line( new point(200,100) , new point(130,Math.random()*canvas.clientHeight + 10) , thick); 
var line_c = new line( new point(200,240) , new point(243,Math.random()*canvas.clientHeight + 10) , thick); 

function clear_frame(){
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.clientWidth , canvas.clientHeight);
}

function new_frame(){

    draw.line_from_a_to_b(canvas , line_a.p1 , line_a.p2 , line_a.width , new rgb(255,255,0));
    draw.line_from_a_to_b(canvas , line_b.p1 , line_b.p2 , line_b.width , new rgb(0,255,0) );
    draw.line_from_a_to_b(canvas , line_c.p1 , line_c.p2 , line_c.width , new rgb(0,255,255) );

    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(200,250);
    ctx.lineTo(400,400);
    ctx.stroke(); 

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
    /*
    setInterval(() => {
    line_a = new line( new point(Math.random()*canvas.clientWidth + 10 ,50) , new point(50,200) , thick); 
    line_b = new line( new point(200,100) , new point(130,Math.random()*canvas.clientHeight + 10) , thick); 
    line_c = new line( new point(200,240) , new point(243,Math.random()*canvas.clientHeight + 10) , thick); 
    }, 4000);
    */
    clear_frame()
    new_frame();

}