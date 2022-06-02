
import { point } from "../point.js";
import { line } from "../line.js";
//import { triangle } from "../triangle.js"

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let ln = new line(
    new point(10,-100,0,0),
    new point(-200,10,0,0),
);

function check_xy(p = new point() , xmin = 0 , xmax = canvas.clientWidth , ymin = 0 , ymax = canvas.clientHeight){

    let outcode = 0;
    
    if( p.x < xmin ) outcode += 1;
    if( p.x > xmax ) outcode += 2;

    if( p.y < ymin ) outcode += 8;
    if( p.y > ymax ) outcode += 4;

    return outcode;
}

function calc_x_intercept( p1 , p2 , xintercept = 0 ){

    // slope = (y1 - y0) / (x1 - x0)
    // y = y0 + slope * (xm - x0), where xm is xmin or xmax
    
    let slope = (p2.y - p1.y) / (p2.x - p1.x);

    let x = xintercept;
    let y = p1.y + slope * (xintercept - p1.x);

    p2.x = x;
    p2.y = y;

    return new line(p1 , p2);
}

function calc_y_intercept( p1 , p2 , yintercept = 0 ){

    //   slope = (y1 - y0) / (x1 - x0)
    //   x = x0 + (1 / slope) * (ym - y0), where ym is ymin or ymax
    
    let slope = (p2.y - p1.y) / (p2.x - p1.x);

    let x = p1.x + (1 / slope) * (yintercept - p1.y);
    let y = yintercept;

    p2.x = x;
    p2.y = y;

    return new line(p1 , p2);
}

function line_clipping_xy( p1 , p2 ){
    
    debugger
    
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

        // swap if p2 inside and p1 outside
        if(c1 != 0 && c2 == 0){

            //[p1,p2] = [p2,p1];
            ln = new line( p2 , p1 );
            [c1,c2] = [c2,c1];
        }

        // left clipping
        if(c2 == 1){ 
            ln = calc_x_intercept(ln.p1 , ln.p2 , 0);
        }

        // right clipping 
        if(c2 == 2) {      
            ln = calc_x_intercept(ln.p1 , ln.p2 , canvas.clientWidth);
        }

        // top clipping
        if(c2 == 8){
            ln = calc_y_intercept(ln.p1 , ln.p2 , 0);
        }

        // bottom clipping
        if(c2 == 4){
            ln = calc_y_intercept(ln.p1 , ln.p2 , canvas.clientHeight);
        }

        // top & left clipping
        if(c1 == 8 && c2 == 1 || c1 == 1 &&  c2 == 8){
            ln = calc_x_intercept(ln.p1 , ln.p2 , 0);
            ln = calc_y_intercept(ln.p2 , ln.p1 , 0);
        }

        // top & left clipping
        if(c1 == 8 && c2 == 2 || c1 == 2 &&  c2 == 8){
            ln = calc_x_intercept(ln.p1 , ln.p2 , canvas.clientWidth);
            ln = calc_y_intercept(ln.p2 , ln.p1 , 0);
        }


        if(ln.p1.x < 0 && ln.p1.y == 0) ln.p1 = null;
        if(ln.p2.x < 0 && ln.p2.y == 0) ln.p2 = null;
        
        if(ln.p1.x < 0 && ln.p1.y == 0) ln.p1 = null;
        if(ln.p2.x < 0 && ln.p2.y == 0) ln.p2 = null;

        return ln;
    }

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
        
        render_line(ctx , ln , true);

        requestAnimationFrame(render);
    } , fps);
}

render()