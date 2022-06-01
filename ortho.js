
import {NDC} from "./NDC.js"
import {xy_check,xy_clipping} from "./clipping.js"

const ndc = new NDC(-1 , 1 , -1 , 1 , 1 , -1 , canvas.height / canvas.width , 90);

export let orth_matrix = [
    //      x               y               z                   w
    [  2 / (ndc.r - ndc.l)  ,       0       ,       0       , -( (ndc.r + ndc.l) / (ndc.r - ndc.l) )],
    [   0           , 2 / (ndc.t - ndc.b)   ,       0       , -( (ndc.t + ndc.b) / (ndc.t - ndc.b) )],
    [   0           ,       0       ,   -2 / (ndc.f - ndc.n), -( (ndc.f + ndc.n) / (ndc.f - ndc.n) )],
    [   0           ,       0       ,       0       ,           1           ] 
];

export function ortho_calc( Point = new point() ){

    Point.x = Point.x * orth_matrix[0][0] + Point.w * orth_matrix[0][3];
    Point.y = Point.y * orth_matrix[1][1] + Point.w * orth_matrix[1][3];
    Point.z = Point.z * orth_matrix[2][2] + Point.w * orth_matrix[2][3];
    Point.w = Point.w;

    return Point;
    
}

export function orthographic_projection( MESH = new mesh() ){
    
    //debugger

    let COPY_MESH = MESH.copy();

    let points = ['a','b','c'];

    for(let trig of COPY_MESH.triangles){
        
        trig.a = ortho_calc(trig.a);
        trig.b = ortho_calc(trig.b);
        trig.c = ortho_calc(trig.c);
        
        
        // normalize values to -1 0 1  "NDC VALUES" 
        for(let p = 0 ; p < 3 ; p += 1){
            
            // perspective divide
            if(trig[points[p]].z != 0){
                
                trig[points[p]].x /= -trig[points[p]].z;
                trig[points[p]].y /= -trig[points[p]].z;
                
            }
        }
        
        // clipping process
        // check in 2D first
        let check = xy_check( ndc , trig );
        // then try to clip if needed
        let triges = xy_clipping(ndc , trig , check);

        debugger
        if(triges == null) continue;
        
        // if return array of triangles that mean original tirangle get clipped
        if( Array.isArray(triges) ){

            // loop over all new traingles
            for(let new_trig of triges){
                // go to canonical space between 0 - 1
                for(let p = 0 ; p < 3 ; p += 1){
                    new_trig[points[p]].x = (new_trig[points[p]].x + 1) / 2;
                    new_trig[points[p]].y = (new_trig[points[p]].y + 1) / 2;
                }
                // then push it to mesh
                COPY_MESH.triangles.push(new_trig);

            } 
            continue;
        }

        // if nothing happend to triangle 
        // go to canonical space between 0 - 1
        for(let p = 0 ; p < 3 ; p += 1){

            triges[points[p]].x = (triges[points[p]].x + 1) / 2;
            triges[points[p]].y = (triges[points[p]].y + 1) / 2;
            
        }
        

    }

    // return mesh copy with projected coordinates 
    return COPY_MESH;
}

