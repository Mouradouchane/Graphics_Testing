
import {point} from "./point.js"
import {triangle} from "./triangle.js"

export function xy_check( NDC , triangle = new triangle() ){

    // object contain all check result
    let check_obj = {

    }
    let names = ['a' , 'b' , 'c'];

    for(let p = 0 ; p < names.length ; p += 1){

        // check for x
        if( triangle[ names[p] ].x < NDC.l) console.warn("left");
        if( triangle[ names[p] ].x > NDC.r) console.warn("right");

        // check for y
        if( triangle[ names[p] ].y < NDC.t) console.warn("top");
        if( triangle[ names[p] ].y > NDC.b) console.warn("bottom");

        // check for z
        if( triangle[ names[p] ].z > NDC.n) console.warn("near");
        //if( triangle[ names[p] ].z < NDC.f) console.warn("far");
    }
}

export function xy_clipping( NDC , triangle = new triangle() ){

}