
import {point} from "./point.js"
import {triangle} from "./triangle.js"
import {mesh} from "./mesh.js"
import {shape} from "./objects.js"

import {to_radian,rotate_x,rotate_y,rotate_z,rotate_each_time,stop_rotate} from "./rotate.js"

import {fps as FPS} from "./fps.js"
import {NDC} from "./NDC.js"
import {orthographic_projection,orth_matrix,ortho_calc} from "./ortho.js"
import {move} from "./movement.js"

// =============== canvas ===============
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const ndc = new NDC(-1 , 1 , -1 , 1 , 1 , -1 , canvas.height / canvas.width , 90);
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

move(shape);

document.addEventListener("keydown" , (e) => {
    
    pshape = move( e , shape )[0];

})

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