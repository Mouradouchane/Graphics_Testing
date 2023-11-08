
import { RGBA }  from "./color.js";
import { Point2D , Point3D } from "./point.js";


export class Line2D{

    constructor(
        point_a = new Point2D() , point_b = new Point2D() , 
        thickness = 1 , line_color = new RGBA()
    ){

        this.a = point_a;
        this.b = point_b;
        this.width = (thickness < 1) ? 1 : thickness;
        this.color = line_color;

    }

    static Copy( line = new Line2D() ) {

        return new Line2D( Point2D.Copy(line.a) , Point2D.Copy(line.b) , line.width , RGBA.Copy(this.color) );

    }
    
    static RandomLine( max_width = 1 , max_height = 1 , thickness = 2 ){

        return new Line2D(

            new Point2D(
                Math.floor( Math.random() * max_width  ),
                Math.floor( Math.random() * max_height )
            ),

            new Point2D(
                Math.floor( Math.random() * max_width  ),
                Math.floor( Math.random() * max_height )
            ),

            thickness,

            RGBA.RandomColor()

        );
        
    }

} // end of class Line2D


export class Line3D {

    constructor(
        point_a = new Point3D() , point_b = new Point3D() , 
        color = new RGBA() , width = 1 , 
    ){

        this.a = (point_a instanceof Point3D) ? point_a : null;
        this.b = (point_b instanceof Point3D) ? point_b : null;

        this.color = (color instanceof RGBA) ? color : null;
        this.width = width;

    }

    static Copy( line = new Line3D() ) {

        return new Line3D( line.a.Copy() , line.b.Copy() , line.color , this.width );

    }

    static RandomLine( max_width = 1 , max_height = 1 , max_deepth = 1 ,  thickness = 2 ){

        return new Line3D(

            new Point3D(
                Math.floor( Math.random() * max_width  ),
                Math.floor( Math.random() * max_height ),
                Math.floor( Math.random() * max_deepth ),
            ),

            new Point3D(
                Math.floor( Math.random() * max_width  ),
                Math.floor( Math.random() * max_height ),
                Math.floor( Math.random() * max_deepth ),
            ),

            thickness,

            RGBA.RandomColor()

        );
        
    }

} // end of class Line3D
