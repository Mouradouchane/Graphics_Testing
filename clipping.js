
import {Point2D} from "./point.js"
import {Line2D} from "./line.js"
import {Triangle2D} from "./triangle.js"
import {MATH} from "./math.js";
import {Draw} from "./draw/draw.js";
import {RGBA} from "./color.js";
// import {FrameBuffer} from "./buffers.js"


export class Clip2D {

    // "status codes" representing the region a point lies on
    // could be combined to represent all the sides : for example left + top => 10 
    static CENTER = 0;
    static LEFT   = 1;
    static RIGHT  = 2;
    static TOP    = 8;
    static BUTTOM = 4;

    // "status codes" representing what's happend to the shape
    // goona be usefull later in drawing
    static DISCARDED  = -1;// when the shape fully outside the range "got deleted"
    static NOT_CLIPED = 0; // when the shape fully inside the range
    static CLIPPED    = 1; // when a part of the shape "got clipped"

    static #ClippingFunctions = [

        null ,  // center

        (x_min , y_min , x_max , y_max , outside_point , slope) => { // left
        
            let y =  MATH.Yintercept2D( x_min , slope , MATH.Yintercept_At_X0_2D( outside_point , slope ) );
            
            return new Point2D(  
                x_min , 
                ( (y < y_min) || (y > y_max) ) ? -1 : y
            );
                
        } ,

        (x_min , y_min , x_max , y_max , outside_point , slope) => { // right

            let y =  MATH.Yintercept2D( x_max , slope , MATH.Yintercept_At_X0_2D( outside_point , slope ) );

            return new Point2D( 
                x_max, 
                ( (y < y_min) || (y > y_max) ) ? -1 : y
            );

        } ,

        null ,

        (x_min , y_min , x_max , y_max , outside_point , slope) => { // buttom
        
            let x =  MATH.Xintercept2D( y_max , slope , MATH.Yintercept_At_X0_2D( outside_point , slope ) );

            return new Point2D( 
                ( (x < x_min) || (x > x_max) ) ? -1 : x ,
                y_max
            );

        } ,

        (x_min , y_min , x_max , y_max , outside_point , slope) => { // buttom + left

            let px = Clip2D.#ClippingFunctions[Clip2D.BUTTOM](x_min , y_min , x_max , y_max , outside_point , slope);
            let py = Clip2D.#ClippingFunctions[Clip2D.LEFT  ](x_min , y_min , x_max , y_max , outside_point , slope);
        
            if( ( px.x == -1 ) && ( py.y == -1 ) ) return undefined;

            return new Point2D(
                ( px.x == -1 ) ? x_min : px.x ,
                ( py.y == -1 ) ? y_max : py.y
            );

        },

        (x_min , y_min , x_max , y_max , outside_point , slope) => { // buttom + right 

            let px = Clip2D.#ClippingFunctions[Clip2D.BUTTOM](x_min , y_min , x_max , y_max , outside_point , slope);
            let py = Clip2D.#ClippingFunctions[Clip2D.RIGHT ](x_min , y_min , x_max , y_max , outside_point , slope);
     
            if( ( px.x == -1 ) && ( py.y == -1 ) ) return undefined;

            return new Point2D(
                ( px.x == -1 ) ? x_max : px.x ,
                ( py.y == -1 ) ? y_max : py.y
            );

        },

        null , 

        (x_min , y_min , x_max , y_max , outside_point , slope) =>  { // top
            
            let x = MATH.Xintercept2D( y_min , slope , MATH.Yintercept_At_X0_2D( outside_point , slope ) );

            return new Point2D(
                ( (x < x_min) || (x > x_max) ) ? -1 : x , 
                y_min
            );

        } ,

        (x_min , y_min , x_max , y_max , outside_point , slope) =>  { // top + left

            let px = Clip2D.#ClippingFunctions[Clip2D.TOP ](x_min , y_min , x_max , y_max , outside_point , slope);
            let py = Clip2D.#ClippingFunctions[Clip2D.LEFT](x_min , y_min , x_max , y_max , outside_point , slope);
     
            if( ( px.x == -1 ) && ( py.y == -1 ) ) return undefined;

            return new Point2D(
                ( px.x == -1 ) ? x_min : px.x,
                ( py.y == -1 ) ? y_min : py.y
            );

        } , 

        (x_min , y_min , x_max , y_max , outside_point , slope) =>  { // top + right

            let px = Clip2D.#ClippingFunctions[Clip2D.TOP  ](x_min , y_min , x_max , y_max , outside_point , slope);
            let py = Clip2D.#ClippingFunctions[Clip2D.RIGHT](x_min , y_min , x_max , y_max , outside_point , slope);
     
            if( ( px.x == -1 ) && ( py.y == -1 ) ) return undefined;

            return new Point2D(
                ( px.x == -1 ) ? x_max : px.x,
                ( py.y == -1 ) ? y_min : py.y
            );

        } 

    ];

    /*
        function to check wich side a point lies on a boundaries
        "Cohen–Sutherland" conecpt 
    */
    static GetStatusOfPoint(  
        point = new Point2D() , // target point to check
        x_min , y_min , // boundary-range min values 
        x_max , y_max , // boundary-range max values
    ){

        let region = Clip2D.CENTER;

        if( point.x < x_min )       region += Clip2D.LEFT;
        else if( point.x > x_max )  region += Clip2D.RIGHT;

        if( point.y < y_min )       region += Clip2D.TOP;
        else if( point.y > y_max )  region += Clip2D.BUTTOM;

        return region;

    }

    static IsPointAtBoundry(  
        point = new Point2D() , // target point to check
        x_min , y_min , // boundary-range min values 
        x_max , y_max , // boundary-range max values
    ){
     
        if( (point.x == x_min) || (point.x == x_max) ) return true;

        if( (point.y == y_min) || (point.y == y_max) ) return true;

        return false;

    }

    /* 
        function to clip 2D Lines againts boundaries
    */
    static Line2D( 
        line = new Line2D() , 
        x_min , y_min , // boundary-range min values
        x_max , y_max   // boundary-range max values
    ){

        
        let slope = MATH.Slope2D( line.a , line.b );
        
        // get in wich side the points of the line is .  
        let pa_status = Clip2D.GetStatusOfPoint( line.a , x_min , y_min , x_max , y_max ); 
        let pb_status = Clip2D.GetStatusOfPoint( line.b , x_min , y_min , x_max , y_max );

        // both points inside the buffer-range 
        // "nothing to clip"
        if( pa_status == 0 && pb_status == 0 ) return Clip2D.NOT_CLIPED;

        // both points outside the buffer-range in same side 
        // "nothing to draw"
        if( pa_status != 0 && (pa_status == pb_status) ) return Clip2D.DISCARDED;

        // one point inside and the other one outside
        // "need clipping"
        if( pa_status == 0 || pb_status == 0 ) {

            if(pa_status == 0){
                line.b = Clip2D.#ClippingFunctions[pb_status]( x_min , y_min , x_max , y_max , line.b , slope);
            }
            else { 
                line.a = Clip2D.#ClippingFunctions[pa_status]( x_min , y_min , x_max , y_max , line.a , slope);
            }

            return Clip2D.CLIPPED;
        }
        // both points outside 
        // "clip or discard"
        else {

            let detected_outside = 0;

            line.a = Clip2D.#ClippingFunctions[pa_status](x_min , y_min , x_max , y_max , line.a , slope);

            if( line.a == undefined ) {
                return Clip2D.DISCARDED;
            }
            if(line.a.x == -1 || line.a.y == -1) detected_outside += 1;

            line.b = Clip2D.#ClippingFunctions[pb_status](x_min , y_min , x_max , y_max , line.b , slope);

            if( line.b == undefined ) {
                return Clip2D.DISCARDED;
            }

            if(line.b.x == -1 || line.b.y == -1) detected_outside += 1;

            if( detected_outside == 2 ) return Clip2D.DISCARDED;

            return Clip2D.CLIPPED;
        }

    }


    /*
        function to clip 2D triangles againts boundaries
    */
    static Triangle2D(
        triangle = new Triangle2D() , 
        sub_triangles_array = [] , // for hold the all new sub triangle  
        x_min , y_min , // boundary-range min values
        x_max , y_max   // boundary-range max values
    ){

        triangle.border_color = new RGBA(255,50,200,0.1);
        triangle.fill_color = null;
        triangle.thickness = 1;
        Draw.Triangle2D( triangle );

        debugger;

        let a_status = Clip2D.GetStatusOfPoint( triangle.a , x_min , y_min , x_max , y_max );
        let b_status = Clip2D.GetStatusOfPoint( triangle.b , x_min , y_min , x_max , y_max );
        let c_status = Clip2D.GetStatusOfPoint( triangle.c , x_min , y_min , x_max , y_max );

        // all triangle points inside boundary
        if( (a_status == 0) && (b_status == 0) && (c_status == 0) ){

            sub_triangles_array.push( triangle );

            return Clip2D.NOT_CLIPED;
        } 

        // all triangle points in the same side outside boundary
        if( ( a_status != 0) && (a_status == b_status) && (a_status == c_status) ) return Clip2D.DISCARDED;

        /*
            else : clipping cases
        */

        let clip_point;

        // try to get a valid point for clip between a & b 

        if( (a_status != 0) || (b_status != 0) ){

            clip_point = Clip2D.#ClippingFunctions[ ((a_status != 0) ? a_status : b_status) ]( 
                x_min , y_min , x_max , y_max , 
                (a_status != 0) ? triangle.a : triangle.b ,
                MATH.Slope2D(triangle.a , triangle.b)
            );

            if( 
                clip_point != undefined && Point2D.Valid(clip_point) &&
                !Point2D.Equals(clip_point , triangle.a) && !Point2D.Equals(clip_point , triangle.b) 
            ) {

                let sub_triangle_1 = Triangle2D.Copy( triangle );
                let sub_triangle_2 = Triangle2D.Copy( triangle );

                sub_triangle_1.b = Point2D.Copy( clip_point );
                sub_triangle_2.a = Point2D.Copy( clip_point );

                Clip2D.Triangle2D( sub_triangle_1 , sub_triangles_array , x_min , y_min , x_max , y_max );
                Clip2D.Triangle2D( sub_triangle_2 , sub_triangles_array , x_min , y_min , x_max , y_max );

                return Clip2D.CLIPPED;
            }

        }

        // try to get a valid point for clip between a & c 
        if( (a_status != 0) || (c_status != 0) ){

            clip_point = Clip2D.#ClippingFunctions[ (a_status != 0) ? a_status : c_status ]( 
                x_min , y_min , x_max , y_max , 
                (a_status != 0) ? triangle.a : triangle.c ,
                MATH.Slope2D(triangle.a , triangle.c)
            );

            if( 
                clip_point != undefined && Point2D.Valid(clip_point) &&
                !Point2D.Equals(clip_point , triangle.a) && !Point2D.Equals(clip_point , triangle.c) 
            ) {

                let sub_triangle_1 = Triangle2D.Copy( triangle );
                let sub_triangle_2 = Triangle2D.Copy( triangle );

                sub_triangle_1.c = Point2D.Copy( clip_point );
                sub_triangle_2.a = Point2D.Copy( clip_point );

                Clip2D.Triangle2D( sub_triangle_1 , sub_triangles_array , x_min , y_min , x_max , y_max );
                Clip2D.Triangle2D( sub_triangle_2 , sub_triangles_array , x_min , y_min , x_max , y_max );

                return Clip2D.CLIPPED;
            }

        }

        // try to get a valid point for clip between b & c 

        if( (b_status != 0) || ( c_status != 0) ){

            clip_point = Clip2D.#ClippingFunctions[ (b_status != 0) ? b_status : c_status ]( 
                x_min , y_min , x_max , y_max , 
                (b_status != 0) ? triangle.b : triangle.c ,
                MATH.Slope2D(triangle.b , triangle.c)
            );

            if( 
                clip_point != undefined && Point2D.Valid(clip_point) &&
                !Point2D.Equals(clip_point , triangle.b) && !Point2D.Equals(clip_point , triangle.c) 
            ) {

                let sub_triangle_1 = Triangle2D.Copy( triangle );
                let sub_triangle_2 = Triangle2D.Copy( triangle );

                sub_triangle_1.b = Point2D.Copy( clip_point );
                sub_triangle_2.c = Point2D.Copy( clip_point );

                Clip2D.Triangle2D( sub_triangle_1 , sub_triangles_array , x_min , y_min , x_max , y_max );
                Clip2D.Triangle2D( sub_triangle_2 , sub_triangles_array , x_min , y_min , x_max , y_max );

                return Clip2D.CLIPPED;
            } 

        }

    }


} // end of Clip2D class


export class Clip3D{

}