import { point2D } from "./point";


// a 2D curve with 3 points 
export class CURVE_2D_3_POINTS{

    constructor( 
        point_a = new point2D() , 
        point_b = new point2D() , 
        point_c = new point2D()
    ){

        this.a = (point_a instanceof point2D) ? point_a : new point2D(0,0) ;
        this.b = (point_b instanceof point2D) ? point_b : new point2D(0,0) ;
        this.c = (point_c instanceof point2D) ? point_c : new point2D(0,0) ;

    }

};


// a 2D curve with 4 points
export class CURVE_2D_4_POINTS{

    constructor( 
        point_a = new point2D() , 
        point_b = new point2D() , 
        point_c = new point2D() , 
        point_d = new point2D()
    ){

        this.a = (point_a instanceof point2D) ? point_a : new point2D(0,0) ;
        this.b = (point_b instanceof point2D) ? point_b : new point2D(0,0) ;
        this.c = (point_c instanceof point2D) ? point_c : new point2D(0,0) ;
        this.d = (point_d instanceof point2D) ? point_d : new point2D(0,0) ;
        
    }

};