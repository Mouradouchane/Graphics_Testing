import { point2D } from "./point.js";
import { RGBA } from "./color.js";

// 2D plane from 4 points
export class plane2D{

    constructor( 
        point_a = new point2D() ,
        point_b = new point2D() ,
        point_c = new point2D() ,
        point_d = new point2D() ,
        fill_color = undefined , 
        border_color = undefined ,
        border_thickness = undefined ,
    ){

        this.a = (point_a instanceof point2D) ? point_a : null;
        this.b = (point_b instanceof point2D) ? point_b : null;
        this.c = (point_c instanceof point2D) ? point_c : null;
        this.d = (point_d instanceof point2D) ? point_d : null;

        this.fill_color = (fill_color instanceof RGBA) ? fill_color : null;
        this.border_color = (border_color instanceof RGBA) ? border_color : null;
        this.thickness = (border_thickness > 0 ) ? border_thickness : null;

    }

}

    /* need work */
export class plane3D{

}