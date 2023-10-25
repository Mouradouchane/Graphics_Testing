import { RGBA } from "./color.js";
import { point2D } from "./point.js";

export class triangle2D{

    constructor(
        point_a = new point2D() , point_b = new point2D() , point_c = new point2D() , 
        thickness = 1 , fill_color = undefined , border_color = undefined 
    ){

        this.a = (point_a instanceof point2D) ? point_a : new point2D();
        this.b = (point_b instanceof point2D) ? point_b : new point2D();
        this.c = (point_c instanceof point2D) ? point_c : new point2D();
        this.thickness = thickness;
        this.fill_color = (fill_color instanceof RGBA) ? fill_color : undefined;
        this.border_color = (border_color instanceof RGBA) ? border_color : undefined;

    }

    static copy( triangle2D_obj = new triangle2D() ){

        if(triangle2D_obj instanceof triangle2D){

            return new triangle2D(
                point2D.copy(triangle2D_obj.a),
                point2D.copy(triangle2D_obj.b),
                point2D.copy(triangle2D_obj.c),
                Number.parseInt(triangle2D_obj.thickness),
                (triangle2D_obj.fill_color   instanceof RGBA) ? RGBA.copy(triangle2D_obj.fill_color) : undefined ,
                (triangle2D_obj.border_color instanceof RGBA) ? RGBA.copy(triangle2D_obj.border_color) : undefined ,
            );
            
        }
        else return null;

    }
    
    static random_triangle( 
        max_width = 1 , max_height = 1 , thickness = 1, color = false , border_color = false
    ){

        return new triangle2D(

            new point2D( Math.floor( Math.random() * max_width ) , Math.floor( Math.random() * max_height ) ),
            new point2D( Math.floor( Math.random() * max_width ) , Math.floor( Math.random() * max_height ) ),
            new point2D( Math.floor( Math.random() * max_width ) , Math.floor( Math.random() * max_height ) ),
            thickness,
            (color) ? RGBA.random_color() : undefined,
            (border_color) ? RGBA.random_color() : undefined 

        );
    
    }

    static sort_by_y_axis( trig = new triangle2D() ){

        if( trig.a.y > trig.b.y || ((trig.a.y == trig.b.y) && trig.a.x > trig.b.x) ) point2D.swap( trig.a , trig.b );
        if( trig.a.y > trig.c.y || ((trig.a.y == trig.c.y) && trig.a.x > trig.c.x) ) point2D.swap( trig.a , trig.c );
        if( trig.b.y > trig.c.y || ((trig.b.y == trig.c.y) && trig.b.x > trig.c.x) ) point2D.swap( trig.b , trig.c );

    }

    static sort_by_x_axis( trig = new triangle2D() ){

        if( trig.a.x > trig.b.x ) point2D.swap( trig.a , trig.b );
        if( trig.a.x > trig.c.x ) point2D.swap( trig.a , trig.c );
        if( trig.b.x > trig.c.x ) point2D.swap( trig.b , trig.c );

    }
    
}

export class triangle2D_gradient extends triangle2D{

    constructor(
        point_a = new point2D() , point_b = new point2D() , point_c = new point2D() , 
        color_a = new RGBA() ,  color_b = new RGBA() ,  color_c = new RGBA() 
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