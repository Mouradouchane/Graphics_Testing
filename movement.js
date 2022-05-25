import {orthographic_projection} from "./ortho.js"

let speed = 1.4;
let speed_lr = 1.4;


export function move( e , ...MESHES){
    
    let MESHES_COPY = [];

    for(let mesh of MESHES){

        if(e.key == "z"){

            for(let trig of mesh.triangles){
                trig.a.y += speed_lr;
                trig.b.y += speed_lr;
                trig.c.y += speed_lr;
            }
            
        } 
        if(e.key == "s") {

            for(let trig of mesh.triangles){
                trig.a.y -= speed_lr;
                trig.b.y -= speed_lr;
                trig.c.y -= speed_lr;
            }

        }

        if(e.key == "q"){

            for(let trig of mesh.triangles){
                trig.a.x += speed_lr;
                trig.b.x += speed_lr;
                trig.c.x += speed_lr;
            }

        } 
        if(e.key == "d") {

            for(let trig of mesh.triangles){
                trig.a.x -= speed_lr;
                trig.b.x -= speed_lr;
                trig.c.x -= speed_lr;
            }
        }

        if(e.key == "e"){

            for(let trig of mesh.triangles){
                trig.a.z += speed;
                trig.b.z += speed;
                trig.c.z += speed;
            }

        } 
        if(e.key == "a") {

            for(let trig of mesh.triangles){
                trig.a.z -= speed;
                trig.b.z -= speed;
                trig.c.z -= speed;
            }

        }

        MESHES_COPY.push( orthographic_projection(mesh) );

    }

    return MESHES_COPY;
} 
    


