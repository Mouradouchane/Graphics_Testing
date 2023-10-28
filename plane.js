import { Point2D } from "./point.js";
import { RGBA } from "./color.js";

// 2D plane from 4 points
export class plane2D{

    constructor( 
        point_a = new Point2D() ,
        point_b = new Point2D() ,
        point_c = new Point2D() ,
        point_d = new Point2D() ,
        fill_color = undefined , 
        border_color = undefined ,
        border_thickness = undefined ,
    ){

        this.a = (point_a instanceof Point2D) ? point_a : null;
        this.b = (point_b instanceof Point2D) ? point_b : null;
        this.c = (point_c instanceof Point2D) ? point_c : null;
        this.d = (point_d instanceof Point2D) ? point_d : null;

        this.fill_color = (fill_color instanceof RGBA) ? fill_color : null;
        this.border_color = (border_color instanceof RGBA) ? border_color : null;
        this.thickness = (border_thickness > 0 ) ? border_thickness : null;

    }


    static sort_by_y_axis( plane_object = new plane2D() ){

        if( plane_object instanceof plane2D ){

            let points = [
                plane_object.a , 
                plane_object.b , 
                plane_object.c , 
                plane_object.d , 
            ];

            points.sort( ( a , b ) => {
                return ( a.y > b.y );
            });

            plane_object.a = points[0];
            plane_object.b = points[1];
            plane_object.c = points[2];
            plane_object.d = points[3];
            
            return true;
        }
        else return false;

    }

    static sort_by_x_axis( plane_object = new plane2D() ){

        if( plane_object instanceof plane2D ){

            let points = [
                plane_object.a , 
                plane_object.b , 
                plane_object.c , 
                plane_object.d , 
            ];

            points.sort( ( a , b ) => {
                return ( a.x > b.x );
            });

            plane_object.a = points[0];
            plane_object.b = points[1];
            plane_object.c = points[2];
            plane_object.d = points[3];
            
            return true;
        }
        else return false;

    }

    static sort_by_x_and_y_axis( plane_object = new plane2D() ){

        if( plane_object instanceof plane2D ){

            let points = [
                plane_object.a , 
                plane_object.b , 
                plane_object.c , 
                plane_object.d , 
            ];

            points.sort( ( a , b ) => {
                return ( a.x > b.x && a.y > b.y );
            });

            plane_object.a = points[0];
            plane_object.b = points[1];
            plane_object.c = points[2];
            plane_object.d = points[3];
            
            return true;
        }
        else return false;

    }
}

    /* need work */
export class plane3D{

}