import { Point2D } from "./point.js";


// a 2D curve with 3 points 
export class CURVE_2D_3_POINTS{

    constructor( 
        point_a = new Point2D() , 
        point_b = new Point2D() , 
        point_c = new Point2D()
    ){

        this.a = (point_a instanceof Point2D) ? point_a : new Point2D(0,0) ;
        this.b = (point_b instanceof Point2D) ? point_b : new Point2D(0,0) ;
        this.c = (point_c instanceof Point2D) ? point_c : new Point2D(0,0) ;

    }

};


// a 2D curve with 4 points
export class CubicCurve2D extends CURVE_2D_3_POINTS{

    constructor( 
        point_a = new Point2D() , 
        point_b = new Point2D() , 
        point_c = new Point2D() , 
        point_d = new Point2D()
    ){

        super( point_a , point_b , point_c );
        
        this.d = (point_d instanceof Point2D) ? point_d : new Point2D(0,0) ;
        
    }

};