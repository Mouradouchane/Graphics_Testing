
import {point} from "./point.js"
import {triangle} from "./triangle.js"
import {mesh} from "./mesh.js"
import {shape} from "./objects.js"

import {to_radian,rotate_x,rotate_y,rotate_z,rotate_each_time,stop_rotate} from "./rotate.js"

import {fps as FPS} from "./fps.js"

// =============== canvas ===============
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// =============== objects and meshes ===============
let pshape = new mesh();

function render_coordinates(CTX = ctx , color = "white", point , render_info = false , render_points = false){

    
    let x = ( point.x ) * canvas.width;
    let y = ( point.y ) * canvas.height;
    
    if(render_info){
        let ndc_x = point.x;
        let ndc_y = point.y;

        CTX.font = 'bold 12px serif';
        CTX.fillStyle = color;
        CTX.fillText(`x=${ndc_x}`,x+5,y);
        CTX.fillText(`y=${ndc_y}`,x+5,y+20);
        CTX.fillText(`z=${point.z}`,x+5,y+40);
        CTX.fillText(`w=${point.w}`,x+5,y+60);
    }

    if(render_points){
        CTX.fillStyle = "white";
        CTX.beginPath();
        CTX.arc(x,y,4,0,Math.PI*2);
        CTX.fill(); 
    }
    
}

function render_mesh( CTX = ctx , MESH , colors = true , just_line = false , debug = false){
    //debugger

    for(let trig of MESH.triangles){
        if(trig != null){
            let a = trig.a;
            let b = trig.b;
            let c = trig.c;

            if(!just_line){

                CTX.fillStyle = (colors) ? trig.color : "white";
                CTX.beginPath();
                CTX.moveTo((a.x ) * canvas.width , (a.y ) * canvas.height);
                CTX.lineTo((b.x ) * canvas.width , (b.y ) * canvas.height);
                CTX.lineTo((c.x ) * canvas.width , (c.y ) * canvas.height);
                CTX.lineTo((a.x ) * canvas.width , (a.y ) * canvas.height);
                CTX.fill();

            }
            else{

                ctx.lineWidth   = 1;
                CTX.strokeStyle = (colors) ? trig.color : "white";

                CTX.beginPath();
                CTX.moveTo((a.x ) * canvas.width , (a.y ) * canvas.height);
                CTX.lineTo((b.x ) * canvas.width , (b.y ) * canvas.height);
                CTX.lineTo((c.x ) * canvas.width , (c.y ) * canvas.height);
                CTX.lineTo((a.x ) * canvas.width , (a.y ) * canvas.height);

                CTX.stroke();

                render_coordinates(CTX,"red",a,false,true);
                render_coordinates(CTX,"yellow",b,false,true);
                render_coordinates(CTX,"cyan",c,false,true);
            }
            if(debug){
                render_coordinates(CTX,"red",a,true,true);
                render_coordinates(CTX,"yellow",b,true,true);
                render_coordinates(CTX,"cyan",c,true,true);
            }
        }

    }
}

let aspect_ratio = canvas.height / canvas.width;
let fov = 1 / Math.tan(to_radian(100/2));

let t = -1;
let b = 1;

let l = -1;
let r = 1;

let f = -1;
let n = 0.5;

let orth_matrix = [
    //      x               y               z                   w
    [  2 / (r - l)  ,       0       ,       0       , -( (r + l) / (r - l) )],
    [   0           , 2 / (t - b)   ,       0       , -( (t + b) / (t - b) )],
    [   0           ,       0       ,   -2 / (f - n), -( (f + n) / (f - n) )],
    [   0           ,       0       ,       0       ,           1           ] 
];

function ortho_calc( Point = new point() ){

    Point.x = Point.x * orth_matrix[0][0] + Point.w * orth_matrix[0][3];
    Point.y = Point.y * orth_matrix[1][1] + Point.w * orth_matrix[1][3];
    Point.z = Point.z * orth_matrix[2][2] + Point.w * orth_matrix[2][3];
    Point.w = Point.w;

    return Point;
    
}

function orthographic_projection( MESH = new mesh() ){
    
    //debugger

    let COPY_MESH = MESH.copy();
    //let COPY_MESH = JSON.parse(JSON.stringify(MESH));

    let points = ['a','b','c'];

    for(let trig of COPY_MESH.triangles){
        
        trig.a = ortho_calc(trig.a);
        trig.b = ortho_calc(trig.b);
        trig.c = ortho_calc(trig.c);
        
        // normalize values to NDC -1 0 1 
        for(let p = 0 ; p < 3 ; p += 1){

            // perspective divide
            if(trig[points[p]].z != 0){

                trig[points[p]].x /= -trig[points[p]].z;
                trig[points[p]].y /= -trig[points[p]].z;
              
            }
        }


        // go to canonical space between 0 - 1
        if(trig != null){
            for(let p = 0 ; p < 3 ; p += 1){
                trig[points[p]].x = (trig[points[p]].x + 1) / 2;
                trig[points[p]].y = (trig[points[p]].y + 1) / 2;
                
            }
        }

    }

    // return mesh copy with projected coordinates 
    return COPY_MESH;
}

function z_clipping( p1 , p2 , p3 ){
    //debugger
    // check if all in
    if(p1.z < n && p2.z < n && p3.z < n){
        return new triangle(p1,p2,p3);
    }
    
    // check if all out
    if(p1.z > n && p2.z > n && p3.z > n){
        return null;
    }
    
    // check who is out 
    let a = p1.z > n ? true : false; 
    let b = p2.z > n ? true : false; 
    let c = p3.z > n ? true : false; 

    // if tow point's outside & on point inside
    if( a && !b && !c)return clip_vs_tow(p1 , p2 , p3);
    if(!a &&  b && !c)return clip_vs_tow(p2 , p1 , p3);
    if(!a && !b &&  c)return clip_vs_tow(p3 , p2 , p1);

    // if one point outside & tow point inside
    if(!a &&  b &&  c)return clip_vs_one(p1 , p2 , p3);
    if( a && !b &&  c)return clip_vs_one(p2 , p1 , p3);
    if( a &&  b && !c)return clip_vs_one(p3 , p2 , p1);
}

function clip_vs_tow( inp1 , outp1 , outp2 ){
    // debugger

    let m = (inp1.y - outp1.y) / (inp1.z - outp1.z);

    let new_p1 = new point( outp1.x , -(m * inp1.z) + outp1.y , n ); 
    let new_p2 = new point( outp2.x , -(m * inp1.z) + outp2.y , n ); 

    return new triangle(inp1 , new_p1 , new_p2);
}

let speed = 1.4;
let speed_lr = 1.4;

document.addEventListener("keydown" , (e) => {

    if(e.key == "z"){

        for(let trig of shape.triangles){
            trig.a.y += speed_lr;
            trig.b.y += speed_lr;
            trig.c.y += speed_lr;
        }
        
    } 
    if(e.key == "s") {

        for(let trig of shape.triangles){
            trig.a.y -= speed_lr;
            trig.b.y -= speed_lr;
            trig.c.y -= speed_lr;
        }

    }

    if(e.key == "q"){

        for(let trig of shape.triangles){
            trig.a.x += speed_lr;
            trig.b.x += speed_lr;
            trig.c.x += speed_lr;
        }

    } 
    if(e.key == "d") {

        for(let trig of shape.triangles){
            trig.a.x -= speed_lr;
            trig.b.x -= speed_lr;
            trig.c.x -= speed_lr;
        }
    }

    if(e.key == "e"){

        for(let trig of shape.triangles){
            trig.a.z += speed;
            trig.b.z += speed;
            trig.c.z += speed;
        }

    } 
    if(e.key == "a") {

        for(let trig of shape.triangles){
            trig.a.z -= speed;
            trig.b.z -= speed;
            trig.c.z -= speed;
        }

    }

    pshape = orthographic_projection(shape);
    //for(let p in pshape) console.log(p);
});

pshape = orthographic_projection(shape);

const fps = new FPS();
fps.start_calc_frames();

function render(){

    setTimeout(() =>{
        //debugger
        // =============== clear ===============
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // =============== triangle ============  
        render_mesh(ctx , pshape , false , true , true );

        // =============== FPS =================
        if(fps.draw){
            fps.fpms += 1; // count frame

            ctx.fillStyle = "yellow"; // draw each 1 sec max fps
            ctx.font = "20px Tahoma";
            ctx.fillText(`FPS   : ${fps.sec}`,20,20);
    }   

        requestAnimationFrame(render);
    } , fps.max );

}

render();