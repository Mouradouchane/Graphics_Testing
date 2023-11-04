
import { point } from "../../point.js";
import { line } from "../../line.js";
//import { triangle } from "../triangle.js"

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let LN = new line(
    new point(100,100,0,0),
    new point(-25,800,0,0),
);

function check_xy(p = new point() , xmin = 0 , xmax = canvas.clientWidth , ymin = 0 , ymax = canvas.clientHeight){

    let outcode = 0;

    /*
        mid    = 0
        top    = 8
        buttom = 4
        left   = 1
        right  = 2
    */
    
    if( p.x < xmin ) outcode += 1;
    if( p.x > xmax ) outcode += 2;

    if( p.y < ymin ) outcode += 8;
    if( p.y > ymax ) outcode += 4;

    return outcode;
}

function calc_x_intercept( p1 , p2 , xintercept = 0 ){
    debugger
    //  slope = (y1 - y0) / (x1 - x0)
    //  y = y0 + slope * (xm - x0), where xm is xmin or xmax
    
    let slope = (p2.y - p1.y) / (p2.x - p1.x);

    let x = xintercept;
    let y = p1.y + slope * (xintercept - p1.x);

    p2.x = x;
    p2.y = y;

    return new line(p1 , p2);
}

function calc_y_intercept( p1 , p2 , yintercept = 0 ){
    debugger
    //  slope = (y1 - y0) / (x1 - x0)
    // x = x0 + (1 / slope) * (ym - y0), where ym is ymin or ymax
    
    let slope = (p2.y - p1.y) / (p2.x - p1.x);

    let x = p1.x + (1 / slope) * (yintercept - p1.y);
    let y = yintercept;

    p2.x = x;
    p2.y = y;

    return new line(p1 , p2);
}

function calc_xy_intercept(p1 , p2 , xintercept = 0, yintercept = 0){
    debugger
    let slope = (p2.y - p1.y) / (p2.x - p1.x);

    let x =  p1.x + (1 / slope) * (yintercept - p1.y) ;
    let y =  p1.y + slope * (xintercept - p1.x) ;

    p2.x = (x < 0) ? 0 : (x > canvas.clientWidth) ? canvas.clientWidth : x;
    p2.y = (y < 0) ? 0 : (y > canvas.clientHeight) ? canvas.clientHeight : y;

    return new line(p1 , p2);
}

function line_clipping_xy( p1 , p2 ){
    
    let ln = new line(p1,p2);

    let c1 = check_xy(p1);
    let c2 = check_xy(p2);

    if(c1 == 0 && c2 == 0 ){
        console.log( "2 inside ; 0 outside");
        return ln; // all inside
    } 

    if(c1 != 0 && c1 == c2){
        console.log( "0 inside ; 2 outside");
        return null; // all outside in same side
    } 
    else{
        
        debugger

        // swap if p2 inside and p1 outside
        if(c1 != 0 && c2 == 0){

            //[p1,p2] = [p2,p1];
            ln = new line( p2 , p1 );
            [c1,c2] = [c2,c1];
        }

        // left clipping
        if(c2 == 1){ 
            ln = left_clip( ln );
        }

        // right clipping
        if(c2 == 2) {    
            ln = right_clip( ln );  
        }

        // bottom clipping
        if(c2 == 4){
            ln = buttom_clip( ln );
        }

        // left + buttom clipping
        if(c2 == 5){
            ln = buttom_left_clip( ln );
        }

        // buttom + right clipping
        if(c2 == 6){
            ln = buttom_right_clip( ln );
        }

        // top clipping
        if(c2 == 8){
            ln = top_clip( ln );
        }

        // left + top clipping
        if(c2 == 9){
            ln = top_left_clip( ln );
        }

        // top + right clipping
        if(c2 == 10){
            ln = top_right_clip( ln );
        }


        return ln;
    }

}

function top_clip( ln ){
    return calc_y_intercept(ln.p1 , ln.p2 , 0);
}
function left_clip( ln ){
    return calc_x_intercept(ln.p1 , ln.p2 , 0);
}
function right_clip( ln ){
    return calc_x_intercept(ln.p1 , ln.p2 , canvas.clientWidth);
}
function buttom_clip( ln ){
    return calc_y_intercept(ln.p1 , ln.p2 , canvas.clientHeight);
}

function top_left_clip( ln ){
    return calc_xy_intercept(ln.p1 , ln.p2 , 0 , 0);
}
function buttom_left_clip( ln ){
    return calc_xy_intercept(ln.p1 , ln.p2 , 0 , canvas.clientHeight);
}
function top_right_clip( ln ){
    return calc_xy_intercept(ln.p1 , ln.p2 , canvas.clientWidth , 0);
}
function buttom_right_clip( ln ){
    return calc_xy_intercept(ln.p1 , ln.p2 , canvas.clientWidth , canvas.clientHeight);
}


function render_line( CTX = ctx , LINE = new line() , points = true ){
    
    // get copy
    let copy_LINE = line.copy( LINE );

    // clip this copy if needed
    debugger
    copy_LINE = line_clipping_xy( copy_LINE.p1 , copy_LINE.p2 );

    if(copy_LINE != null){
    
        let a = copy_LINE.p1;
        let b = copy_LINE.p2;

        CTX.lineWidth   = 1.5;
        CTX.strokeStyle = "white";

        CTX.beginPath();
        CTX.moveTo( a.x , a.y );
        CTX.lineTo( b.x , b.y );
        //CTX.lineTo( a.x , a.y );
        
        CTX.stroke();

        if(points){
            render_coordinates( CTX , a , true );
            render_coordinates( CTX , b , true );
        }
        
    }
    
}
          
    
function render_coordinates(CTX = ctx , point , info = false){
    
    let x = point.x;
    let y = point.y;
    
    if(info){
        
        CTX.font = 'bold 14px tahoma';
        CTX.fillStyle = "red";
        CTX.fillText(`X = ${x}`,x+10,y);
        CTX.fillStyle = "cyan";
        CTX.fillText(`Y = ${y}`,x+10,y+22);

    }

    CTX.fillStyle = "yellow";
    CTX.beginPath();
    CTX.arc(x,y,3.5,0,Math.PI*2);
    CTX.fill(); 

}

let fps = 1000 / 2;
function render(){
    setTimeout( () => {

        ctx.fillStyle = "black"
        ctx.clearRect(0,0,canvas.clientWidth , canvas.clientHeight);
        ctx.fillRect(0,0,canvas.clientWidth , canvas.clientHeight);
        
        render_line(ctx , LN , true);

        requestAnimationFrame(render);
    } , fps);
}

render()