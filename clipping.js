
import {Point2D} from "./point.js"
import {Line2D} from "./line.js"
import {Triangle2D} from "./triangle.js"
import {MATH} from "./math.js";
import {Draw} from "./draw.js";
import {RGBA} from "./color.js";
import {Circle2D} from "./circle.js"
import {Config} from "./config.js";

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

        if(Config.Debug) debugger;

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
        else { // both points outside  ==> "clip or discard"

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

            return ( detected_outside == 2 ) ? Clip2D.DISCARDED : Clip2D.CLIPPED ;
        }

    }


    static #ClipTo3Triangles(
        target_point = new Point2D() ,
        triangle = new Triangle2D() ,
        sub_triangles_array ,
        x_min , y_min , // boundary-range min values
        x_max , y_max , // boundary-range max values
    ){

        // clip to 3 triangle 
        let triangle1 = Triangle2D.Copy(triangle);
        let triangle2 = Triangle2D.Copy(triangle);
        let triangle3 = Triangle2D.Copy(triangle);

        triangle1.a = Point2D.Copy(target_point);
        triangle2.b = Point2D.Copy(target_point);
        triangle3.c = Point2D.Copy(target_point);

        // try to clip those new triangles

        if(Config.Debug){
            triangle1.fill_color = RGBA.RandomColor(1);
            triangle2.fill_color = RGBA.RandomColor(1);
            triangle3.fill_color = RGBA.RandomColor(1);

            Draw.Triangle2D( triangle1 , true , false );
            Draw.Triangle2D( triangle2 , true , false );
            Draw.Triangle2D( triangle3 , true , false );
        }

        Clip2D.Triangle2D(
            triangle1 , sub_triangles_array , x_min , y_min , x_max , y_max
        );
        
        Clip2D.Triangle2D(
            triangle2 , sub_triangles_array , x_min , y_min , x_max , y_max
        );
        
        Clip2D.Triangle2D(
            triangle3 , sub_triangles_array , x_min , y_min , x_max , y_max
        );

        return Clip2D.CLIPPED;

    }

    static IsPointAtRange( p1 , p2 , pt ) {

        return (
            ( (p1.x < p2.x) ? (p1.x <= pt.x && p2.x >= pt.x) : (p2.x <= pt.x && p1.x >= pt.x) ) 
            && 
            ( (p1.y < p2.y) ? (p1.y <= pt.y && p2.y >= pt.y) : (p2.y <= pt.y && p1.y >= pt.y) )
        );

    }
    
    static IsValidPoint( p1 , p2 , target_point ){

        return (

            (target_point != undefined)  && 
            (target_point.x != -1 && target_point.y != -1)  && 
            !( Point2D.Equals(target_point , p1) ) &&
            !( Point2D.Equals(target_point , p2) ) && 
            Clip2D.IsPointAtRange( p1 , p2 , target_point ) 
            
        );

    }

    /*
        function to clip 2D triangles againts boundaries
    */
    static Triangle2D(
        triangle = new Triangle2D() , 
        sub_triangles_array = [] , // for hold the all new sub triangle  
        x_min , y_min , // boundary-range min values
        x_max , y_max , // boundary-range max values
    ){

        Triangle2D.SortByClockWise( triangle );

        if(Config.Debug){
            triangle.border_color = new RGBA(255,255,255,1);
            triangle.fill_color = RGBA.RandomColor(1);
            
            Draw.Triangle2D( triangle , true , false );
        }

        // 1 - get status code
        let a_status = Clip2D.GetStatusOfPoint( triangle.a , x_min , y_min , x_max , y_max );
        let b_status = Clip2D.GetStatusOfPoint( triangle.b , x_min , y_min , x_max , y_max );
        let c_status = Clip2D.GetStatusOfPoint( triangle.c , x_min , y_min , x_max , y_max );
        
        if(Config.Debug) debugger;

        // 2 - check if all the points inside boundary
        if( (a_status == 0) && (b_status == 0) && (c_status == 0) ){
            
            sub_triangles_array.push( triangle );

            return Clip2D.NOT_CLIPED;
        } 


        /*
            3 - check if triangle contain one of the boundary edges inside
            note that's useful for easy clipping to 3 triangles
        */

        let edge_point = new Point2D(x_min , y_min);

        if( 
            MATH.IsPointInsideTriangle( edge_point , triangle.a , triangle.b , triangle.c , true )
        ){

            return Clip2D.#ClipTo3Triangles(
                edge_point , triangle , sub_triangles_array ,
                x_min , y_min , x_max , y_max 
            );
        }

        edge_point = new Point2D(x_max , y_min);

        if( 
            MATH.IsPointInsideTriangle( edge_point , triangle.a , triangle.b , triangle.c , true )
        ){
            return Clip2D.#ClipTo3Triangles(
                edge_point , triangle , sub_triangles_array ,
                x_min , y_min , x_max , y_max 
            );
        }

        edge_point = new Point2D(x_min , y_max);

        if( 
            MATH.IsPointInsideTriangle( edge_point , triangle.a , triangle.b , triangle.c , true )
        ){
            return Clip2D.#ClipTo3Triangles(
                edge_point , triangle , sub_triangles_array ,
                x_min , y_min , x_max , y_max 
            );
        }

        edge_point = new Point2D(x_max , y_max);

        if( 
            MATH.IsPointInsideTriangle( edge_point , triangle.a , triangle.b , triangle.c ,true )
        ){
            return Clip2D.#ClipTo3Triangles(
                edge_point , triangle , sub_triangles_array ,
                x_min , y_min , x_max , y_max , false
            );
        }


        /*
            4 - try to find a valid clipping point to clip with int o 2 triangles
        */

        let clip_point;
        
        let triangle1 = null;
        let triangle2 = null;

        if( a_status != 0 ){
            
            // try "a -> b"

            clip_point = Clip2D.#ClippingFunctions[ a_status ](
                x_min , y_min , x_max , y_max , triangle.a , MATH.Slope2D(triangle.a , triangle.b)
            );

            if( Clip2D.IsValidPoint( triangle.a , triangle.b , clip_point ) ) {

                // clip to 2 triangles 
 
                triangle1 = Triangle2D.Copy( triangle );
                triangle2 = Triangle2D.Copy( triangle );

                triangle1.b = Point2D.Copy( clip_point );
                triangle2.a = Point2D.Copy( clip_point );
                
                if(Config.Debug){
                    debugger;
                    triangle1.border_color = new RGBA(150,100,55,1);
                    triangle2.border_color = new RGBA(100,100,100,1);
                    triangle1.fill_color = new RGBA(150,100,0,0.2);
                    triangle2.fill_color = new RGBA(100,100,10,0.2);
                    Draw.Triangle2D( triangle1 , true , false );
                    Draw.Triangle2D( triangle2 , true , false );
                }

                Clip2D.Triangle2D(
                    triangle1 , sub_triangles_array , x_min , y_min , x_max , y_max 
                ); 

                Clip2D.Triangle2D( 
                    triangle2 , sub_triangles_array , x_min , y_min , x_max , y_max 
                );

                return Clip2D.CLIPPED;

        
            }
        
            // try "a -> c"

            clip_point = Clip2D.#ClippingFunctions[ a_status ](
                x_min , y_min , x_max , y_max , triangle.a , MATH.Slope2D(triangle.a , triangle.c)
            );

            if( Clip2D.IsValidPoint( triangle.a , triangle.c , clip_point ) ) {

                // clip to 2 triangles 
 
                triangle1 = Triangle2D.Copy( triangle );
                triangle2 = Triangle2D.Copy( triangle );

                triangle1.c = Point2D.Copy( clip_point );
                triangle2.a = Point2D.Copy( clip_point );

                if(Config.Debug){
                   
                    triangle1.border_color = new RGBA(150,100,55,1);
                    triangle2.border_color = new RGBA(100,100,100,1);
                    triangle1.fill_color = new RGBA(150,100,0,0.2);
                    triangle2.fill_color = new RGBA(100,10,10,0.2);
                    debugger;                    
                    Draw.Triangle2D( triangle1 , true , false );
                    Draw.Triangle2D( triangle2 , true , false );
                }

                Clip2D.Triangle2D(
                    triangle1 , sub_triangles_array , x_min , y_min , x_max , y_max , false
                ); 

                Clip2D.Triangle2D( 
                    triangle2 , sub_triangles_array , x_min , y_min , x_max , y_max , false
                );

                return Clip2D.CLIPPED;

        
            }

        }    

        if( b_status != 0 ){

            // try "b -> a"

            clip_point = Clip2D.#ClippingFunctions[ b_status ](
                x_min , y_min , x_max , y_max , triangle.b , MATH.Slope2D(triangle.a , triangle.b)
            );
            
            if( Clip2D.IsValidPoint( triangle.b , triangle.a , clip_point ) ) {

                // clip to 2 triangles 
 
                triangle1 = Triangle2D.Copy( triangle );
                triangle2 = Triangle2D.Copy( triangle );

                triangle1.b = Point2D.Copy( clip_point );
                triangle2.a = Point2D.Copy( clip_point );

                if(Config.Debug){
                   
                    triangle1.border_color = new RGBA(150,100,55,1);
                    triangle2.border_color = new RGBA(100,100,100,1);
                    triangle1.fill_color = new RGBA(150,100,0,0.2);
                    triangle2.fill_color = new RGBA(100,10,10,0.2);
                    debugger;                    
                    Draw.Triangle2D( triangle1 , true , false );
                    Draw.Triangle2D( triangle2 , true , false );
                }

                Clip2D.Triangle2D(
                    triangle1 , sub_triangles_array , x_min , y_min , x_max , y_max 
                ); 

                Clip2D.Triangle2D( 
                    triangle2 , sub_triangles_array , x_min , y_min , x_max , y_max 
                );

                return Clip2D.CLIPPED;

        
            }

            // try "b -> c"

            clip_point = Clip2D.#ClippingFunctions[ b_status ](
                x_min , y_min , x_max , y_max , triangle.b , MATH.Slope2D(triangle.b , triangle.c)
            );
            
            if( Clip2D.IsValidPoint( triangle.b , triangle.c  , clip_point ) ) {

                // clip to 2 triangles 
 
                triangle1 = Triangle2D.Copy( triangle );
                triangle2 = Triangle2D.Copy( triangle );

                triangle1.c = Point2D.Copy( clip_point );
                triangle2.b = Point2D.Copy( clip_point );

                if(Config.Debug){
                   
                    triangle1.border_color = new RGBA(150,100,55,1);
                    triangle2.border_color = new RGBA(100,100,100,1);
                    triangle1.fill_color = new RGBA(150,100,0,0.2);
                    triangle2.fill_color = new RGBA(100,10,10,0.2);
                    debugger;                    
                    Draw.Triangle2D( triangle1 , true , false );
                    Draw.Triangle2D( triangle2 , true , false );
                }

                Clip2D.Triangle2D(
                    triangle1 , sub_triangles_array , x_min , y_min , x_max , y_max , false
                ); 

                Clip2D.Triangle2D( 
                    triangle2 , sub_triangles_array , x_min , y_min , x_max , y_max , false
                );

                return Clip2D.CLIPPED;

        
            }

        }

        if( c_status != 0 ){

            // try "c -> a"

            clip_point = Clip2D.#ClippingFunctions[ c_status ](
                x_min , y_min , x_max , y_max , triangle.c , MATH.Slope2D(triangle.a , triangle.c)
            );
            
            if( Clip2D.IsValidPoint( triangle.c , triangle.a , clip_point ) ) {

                // clip to 2 triangles 
 
                triangle1 = Triangle2D.Copy( triangle );
                triangle2 = Triangle2D.Copy( triangle );

                triangle1.c = Point2D.Copy( clip_point );
                triangle2.a = Point2D.Copy( clip_point );

                if(Config.Debug){
                   
                    triangle1.border_color = new RGBA(150,100,55,1);
                    triangle2.border_color = new RGBA(100,100,100,1);
                    triangle1.fill_color = new RGBA(150,100,0,0.2);
                    triangle2.fill_color = new RGBA(100,10,10,0.2);
                    debugger;                    
                    Draw.Triangle2D( triangle1 , true , false );
                    Draw.Triangle2D( triangle2 , true , false );
                }

                Clip2D.Triangle2D(
                    triangle1 , sub_triangles_array , x_min , y_min , x_max , y_max 
                ); 

                Clip2D.Triangle2D( 
                    triangle2 , sub_triangles_array , x_min , y_min , x_max , y_max 
                );

                return Clip2D.CLIPPED;

        
            }

            // try "c -> b"

            clip_point = Clip2D.#ClippingFunctions[ c_status ](
                x_min , y_min , x_max , y_max , triangle.c , MATH.Slope2D(triangle.b , triangle.c)
            );

            if( Clip2D.IsValidPoint( triangle.c , triangle.b , clip_point ) ) {

                // clip to 2 triangles 

                triangle1 = Triangle2D.Copy( triangle );
                triangle2 = Triangle2D.Copy( triangle );

                triangle1.c = Point2D.Copy( clip_point );
                triangle2.b = Point2D.Copy( clip_point );

                if(Config.Debug){
                   
                    triangle1.border_color = new RGBA(150,100,55,1);
                    triangle2.border_color = new RGBA(100,100,100,1);
                    triangle1.fill_color = new RGBA(150,100,0,0.2);
                    triangle2.fill_color = new RGBA(100,10,10,0.2);
                    debugger;                    
                    Draw.Triangle2D( triangle1 , true , false );
                    Draw.Triangle2D( triangle2 , true , false );
                }

                Clip2D.Triangle2D(
                    triangle1 , sub_triangles_array , x_min , y_min , x_max , y_max , false
                ); 

                Clip2D.Triangle2D( 
                    triangle2 , sub_triangles_array , x_min , y_min , x_max , y_max , false
                );

                return Clip2D.CLIPPED;
    
            }

        }

        if(Config.Debug){
            debugger;
            triangle.fill_color = new RGBA(255,0,0,1);
            Draw.Triangle2D( triangle , true , false );
        }

        return Clip2D.DISCARDED;

    }


} // end of Clip2D class


export class Clip3D{

}