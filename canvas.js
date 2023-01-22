
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


// move all MESHES and do projection 
document.addEventListener("keydown" , (e) => {
    
    pshape = move( e , shape )[0];

})

pshape = orthographic_projection(shape);

const fps = new FPS(30);
fps.start_calc_frames();

function render(){

    setTimeout(() =>{

        // =============== clear ===============
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        
        // =============== triangle ============  
        mesh.render(ctx , pshape , false , true , true);
        
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