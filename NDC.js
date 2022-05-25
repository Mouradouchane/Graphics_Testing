import {to_radian} from "./rotate.js";

export class NDC {

    constructor( 
        left = -1, right = 1, top = -1 , buttom = 1, znear =  1, zfar= -1 , 
        aspect_ratio = 600 / 800 , filed_of_view_in_deg = 90
        ){

        this.aspect_ratio = aspect_ratio;
        this.fov = 1 / Math.tan( to_radian(filed_of_view_in_deg) ) ;

        // NDC
        this.t = top;       //-1,
        this.b = buttom;    // 1,
        this.l = left;      //-1,
        this.r = right;     //1,
        this.f = zfar;      //-1,
        this.n = znear;     // 0.5,
        
    }
}