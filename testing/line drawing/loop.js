import {line} from "../../line.js";
import { point } from "../../point.js";
import {draw} from "./code.js";
import {rgb} from "../../color.js";

var render_loop = 0;
var test_line = new line( new point(10,10) , new point(10,10) , 1); 
var line_color = new rgb(255,0,255);

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

function clear_frame(){
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.clientWidth , canvas.clientHeight);
}

function new_frame(){
    
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.clientWidth , canvas.clientHeight);

    draw.line_from_a_to_b(canvas , test_line.p1 , test_line.p2 ,test_line.width , line_color );

}

function render(){

    clear_frame();
    new_frame();

    requestAnimationFrame( render );
}

if( render_loop ) render();
else new_frame();
