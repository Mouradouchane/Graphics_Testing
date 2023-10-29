import { RGBA } from "./color.js";
import { Point2D } from "./point.js";


// a 2D cubic curve 
export class Curve2D {

    constructor( 

        // curve points a,b,c,d
        point_a = new Point2D() , 
        point_b = new Point2D() , 
        point_c = new Point2D() , 
        point_d = new Point2D() ,

        // how many points to generate over that curve
        accuracy = 1/16 , 

        color = new RGBA() ,
        thickness = 1
    ){

        this.a = (point_a instanceof Point2D) ? point_a : new Point2D(0,0) ;
        this.b = (point_b instanceof Point2D) ? point_b : new Point2D(0,0) ;
        this.c = (point_c instanceof Point2D) ? point_c : new Point2D(0,0) ;
        this.d = (point_d instanceof Point2D) ? point_d : new Point2D(0,0) ;

        this.color = (color instanceof RGBA) ? color : null;
        this.thickness = (thickness < 0) ? 0 : thickness;
        this.accuracy = accuracy;

    }

    static Copy( curve = new Curve2D() ){

        if( curve instanceof Curve2D ){
            
            return new Curve2D(
                Point2D.Copy( curve.a ),
                Point2D.Copy( curve.b ),
                Point2D.Copy( curve.c ),
                Point2D.Copy( curve.d ),
                curve.accuracy , curve.color , curve.thickness 
            );

        }
        else return null;

    }


};