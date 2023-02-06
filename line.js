
import { RGBA }  from "./color.js";
import { point2D , point2D_with_color } from "./point.js";

export class line{

    constructor(point_a = new point2D() , point_b = new point2D() , thickness = 1 , color_a = new RGBA()){

        this.p1 = point_a;
        this.p2 = point_b;
        this.width = thickness;
        this.color = color_a;

    }

    
    static copy( ln = new line() ) {

        return new line( ln.p1.copy() , ln.p2.copy() , this.width );

    }
    
}

export class line_with_colors{

    constructor(point_a = new point2D_with_color() , point_b = new point2D_with_color() , thickness = 1){

        this.p1 = point_a;
        this.p2 = point_b;
        this.width = thickness;

    }

    static copy( ln = new line() ) {

        return new line_with_colors( ln.p1.copy() , ln.p2.copy() , this.width );

    }
    
}