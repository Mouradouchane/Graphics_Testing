
import { RGBA } from "./color.js";
import { Point2D } from "./point.js";
import { MATH } from "./math.js";
import { Config } from "./config.js";


export class Triangle2D{

    constructor(
        point_a = new Point2D() , point_b = new Point2D() , point_c = new Point2D() , 
        border_thickness = 1 , fill_color = undefined , border_color = undefined 
    ){

        this.a = (point_a instanceof Point2D) ? point_a : new Point2D();
        this.b = (point_b instanceof Point2D) ? point_b : new Point2D();
        this.c = (point_c instanceof Point2D) ? point_c : new Point2D();
        this.thickness = border_thickness;
        this.fill_color   = (fill_color   instanceof RGBA) ? fill_color   : undefined;
        this.border_color = (border_color instanceof RGBA) ? border_color : undefined;

    }

    static Copy( triangle = new Triangle2D() ){

        if(triangle instanceof Triangle2D){

            return new Triangle2D(
                Point2D.Copy(triangle.a),
                Point2D.Copy(triangle.b),
                Point2D.Copy(triangle.c),
                Number.parseInt(triangle.thickness),
                (triangle.fill_color   instanceof RGBA) ? RGBA.Copy(triangle.fill_color)   : undefined ,
                (triangle.border_color instanceof RGBA) ? RGBA.Copy(triangle.border_color) : undefined ,
            );
            
        }
        else return null;

    }
    
    static RandomTriangle( 
        max_width = 1 , max_height = 1 , thickness = 1 , color = false , border_color = false
    ){

        return new Triangle2D(

            new Point2D( Math.floor( Math.random() * max_width ) , Math.floor( Math.random() * max_height ) ),
            new Point2D( Math.floor( Math.random() * max_width ) , Math.floor( Math.random() * max_height ) ),
            new Point2D( Math.floor( Math.random() * max_width ) , Math.floor( Math.random() * max_height ) ),
            thickness,
            (color) ? RGBA.RandomColor() : undefined,
            (border_color) ? RGBA.RandomColor() : undefined 

        );
    
    }

    static SortByY( triangle = new Triangle2D() ){

        if( triangle.a.y > triangle.b.y || ( (triangle.a.y == triangle.b.y) && triangle.a.x > triangle.b.x ) ){
            Point2D.Swap( triangle.a , triangle.b );
        } 

        if( triangle.a.y > triangle.c.y || ( (triangle.a.y == triangle.c.y) && triangle.a.x > triangle.c.x ) ){
            Point2D.Swap( triangle.a , triangle.c );
        } 

        if( triangle.b.y > triangle.c.y || ( (triangle.b.y == triangle.c.y) && triangle.b.x > triangle.c.x) ){
            Point2D.Swap( triangle.b , triangle.c );
        } 

    }

    static SortByX( triangle = new Triangle2D() ){

        if( triangle.a.x > triangle.b.x ) Point2D.Swap( triangle.a , triangle.b );
        if( triangle.a.x > triangle.c.x ) Point2D.Swap( triangle.a , triangle.c );
        if( triangle.b.x > triangle.c.x ) Point2D.Swap( triangle.b , triangle.c );

    }
    
    static SortByClockWise( triangle  = new Triangle2D() ){

        //if( Config.Debug ) debugger;
        
        Triangle2D.SortByY( triangle );

        // we need point inside triangle to determine triangle orientation 
        let centroid = MATH.Triangle2DCentroid( triangle.a , triangle.b , triangle.c );

        let n1 = MATH.CrossProduct2D( centroid , triangle.a , triangle.b );

        if( n1 >= 0 ) return ;

        Point2D.Swap( triangle.b , triangle.c );
        return ;

    }

    // check/test if edge between 2 points should be rendered or not  
    static top_left_rule( v0 = new Point2D() , v1 = new Point2D() ){

        return ( ( v0.x < v1.x ) && (v0.y == v1.y) ) || ( v0.y > v1.y );

    }

} // end of class Triangle2D

export class Triangle2DGradient extends Triangle2D {

    constructor(
        point_a = new Point2D() , point_b = new Point2D() , point_c = new Point2D() , 
        color_a = new RGBA()    , color_b = new RGBA()    , color_c = new RGBA() 
    ){

        super( point_a , point_b , point_c );

        this.color_a = color_a;
        this.color_b = color_b;
        this.color_c = color_c;

    }

}

/*
    need refactor
*/

/*

export class triangle3D{

    constructor( a = new point2D() , b = new point2D() , c = new point2D() , color = "white"){
        
        this.x = 0;
        this.y = 0;
        this.z = 0;
        
        this.a = a;
        this.b = b;
        this.c = c;

        this.color = color;

        this.scale_factor = 1;

        this.scale_point_by = ( point = new point2D() , scale_factor = 1  ) => {
           
            point.x = point.x * scale_factor + this.x;
            point.y = point.y * scale_factor + this.y;
            point.z = point.z * scale_factor + this.z;

        }

        this.scale_triangle_by = ( scale_factor = 1 ) => {
            this.scale_factor = scale_factor;
            
            this.scale_point_by( this.a , this.scale_factor);
            this.scale_point_by( this.b , this.scale_factor);
            this.scale_point_by( this.c , this.scale_factor);
        }

        this.set_coordinates = ( x = 0,y = 0,z = 0 ) => {
            this.x = x;
            this.y = y;
            this.z = z;    
        }

        this.sort = () => {
            let swap = null;

            if(this.a.z < this.b.z){
                swap = this.a;

                this.a = this.b;
                this.b = swap;
            } 

            if(this.a.z < this.c.z){
                swap = this.a;

                this.a = this.c;
                this.c = swap;
            } 


            if(this.b.z < this.c.z){
                swap = this.b;

                this.b = this.c;
                this.c = swap;
            } 
        }
    }
}
*/