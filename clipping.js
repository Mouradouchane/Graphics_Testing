
import {Point2D} from "./point.js"
import {Line2D} from "./line.js"
import {Triangle2D} from "./triangle.js"
import {MATH} from "./math.js";
// import {FrameBuffer} from "./buffers.js"


export class Clip2D {

    // "status codes" representing the region a point lies on
    // could be combined to represent all the sides : for example left + top => 10 
    static #CENTER = 0;
    static #LEFT   = 1;
    static #RIGHT  = 2;
    static #TOP    = 8;
    static #BUTTOM = 4;

    // "status codes" representing what's happend to the shape
    // goona be usefull later in drawing
    static #DISCARDED  = -1;// when the shape fully outside the range "got deleted"
    static #NOT_CLIPED = 0; // when the shape fully inside the range
    static #CLIPPED    = 1; // when a part of the shape "got clipped"

    static #ClippingFunctions = [

        null ,  // center

        (x_min , y_min , x_max , y_max , outside_point , slope) => { // left
        
            return new Point2D(  
                x_min, 
                MATH.Yintercept2D( x_min , slope , MATH.Yintercept_At_X0_2D( outside_point , slope ) )
            );

        } ,

        (x_min , y_min , x_max , y_max , outside_point , slope) => { // right

            return new Point2D( 
                x_max, 
                MATH.Yintercept2D( x_max , slope , MATH.Yintercept_At_X0_2D( outside_point , slope ) )
            );

        } ,

        null ,

        (x_min , y_min , x_max , y_max , outside_point , slope) => { // buttom
        
            return new Point2D( 
                MATH.Xintercept2D( y_max , slope , MATH.Yintercept_At_X0_2D( outside_point , slope ) ),
                y_max
            );

        } ,

        (x_min , y_min , x_max , y_max , outside_point , slope) => { // buttom + left

            let px = Clip2D.#ClippingFunctions[Clip2D.#BUTTOM](x_min , y_min , x_max , y_max , outside_point , slope);
            let py = Clip2D.#ClippingFunctions[Clip2D.#LEFT  ](x_min , y_min , x_max , y_max , outside_point , slope);
        
            if( ( px.x < x_min ) && ( py.y > y_max ) ) return undefined;

            return new Point2D(
                ( px.x < x_min ) ? x_min : px.x ,
                ( py.y > y_max ) ? y_max : py.y
            );

        },

        (x_min , y_min , x_max , y_max , outside_point , slope) => { // buttom + right 

            let px = Clip2D.#ClippingFunctions[Clip2D.#BUTTOM](x_min , y_min , x_max , y_max , outside_point , slope);
            let py = Clip2D.#ClippingFunctions[Clip2D.#RIGHT ](x_min , y_min , x_max , y_max , outside_point , slope);
     
            if( ( px.x > x_max ) && ( py.y > y_max ) ) return undefined;

            return new Point2D(
                ( px.x > x_max ) ? x_max : px.x ,
                ( py.y > y_max ) ? y_max : py.y
            );

        },

        null , 

        (x_min , y_min , x_max , y_max , outside_point , slope) =>  { // top
            
            return new Point2D( 
                MATH.Xintercept2D( y_min , slope , MATH.Yintercept_At_X0_2D( outside_point , slope ) ),
                y_min
            );

        } ,

        (x_min , y_min , x_max , y_max , outside_point , slope) =>  { // top + left

            let px = Clip2D.#ClippingFunctions[Clip2D.#TOP ](x_min , y_min , x_max , y_max , outside_point , slope);
            let py = Clip2D.#ClippingFunctions[Clip2D.#LEFT](x_min , y_min , x_max , y_max , outside_point , slope);
     
            if( ( px.x < x_min ) && ( py.y < y_min ) ) return undefined;

            return new Point2D(
                ( px.x < x_min ) ? x_min : px.x,
                ( py.y < y_min ) ? y_min : py.y
            );

        } , 

        (x_min , y_min , x_max , y_max , outside_point , slope) =>  { // top + right

            let px = Clip2D.#ClippingFunctions[Clip2D.#TOP  ](x_min , y_min , x_max , y_max , outside_point , slope);
            let py = Clip2D.#ClippingFunctions[Clip2D.#RIGHT](x_min , y_min , x_max , y_max , outside_point , slope);
     
            if( ( px.x > x_max ) && ( py.y < y_min ) ) return undefined;

            return new Point2D(
                ( px.x > x_max ) ? x_max : px.x,
                ( py.y < y_min ) ? y_min : py.y
            );

        } 

    ];

    /*
        function to check wich side a point lies on , in a buffer range 
        "Cohen–Sutherland" conecpt 
    */
    static GetStatusOfPoint(  
        point = new Point2D() , // target point to check
        x_min , y_min , // buffer-range min values 
        x_max , y_max   // buffer-range max values
    ){

        let region = Clip2D.#CENTER;

        if( point.x < x_min )       region += Clip2D.#LEFT;
        else if( point.x > x_max )  region += Clip2D.#RIGHT;

        if( point.y < y_min )       region += Clip2D.#TOP;
        else if( point.y > y_max )  region += Clip2D.#BUTTOM;

        return region;

    }

    /* 
        function clip a Line2D againts buffer-range
    */
    static Line2D( 
        line = new Line2D() , 
        x_min , y_min , // buffer-range min values
        x_max , y_max   // buffer-range max values
    ){

        let slope = MATH.Slope2D( line.a , line.b );
        
        // get in wich side the points of the line is .  
        let pa_status = Clip2D.GetStatusOfPoint( line.a , x_min , y_min , x_max , y_max ); 
        let pb_status = Clip2D.GetStatusOfPoint( line.b , x_min , y_min , x_max , y_max );

        // both points inside the buffer-range 
        // "nothing to clip"
        if( pa_status == 0 && pb_status == 0 ) return Clip2D.#NOT_CLIPED;

        // both points outside the buffer-range in same side 
        // "nothing to draw"
        if( pa_status != 0 && (pa_status == pb_status) ) return Clip2D.#DISCARDED;

        // one point inside and the other one outside
        // "need clipping"
        if( pa_status == 0 || pb_status == 0 ) {

            if(pa_status == 0){
                line.b = Clip2D.#ClippingFunctions[pb_status]( x_min , y_min , x_max , y_max , line.b , slope);
            }
            else { 
                line.a = Clip2D.#ClippingFunctions[pa_status]( x_min , y_min , x_max , y_max , line.a , slope);
            }

            return Clip2D.#CLIPPED;
        }
        // both points outside 
        // "clip or discard"
        else {

            line.a = Clip2D.#ClippingFunctions[pa_status](x_min , y_min , x_max , y_max , line.a , slope);

            if( line.a == undefined ) {
                return Clip2D.#DISCARDED;
            }

            line.b = Clip2D.#ClippingFunctions[pb_status](x_min , y_min , x_max , y_max , line.b , slope);

            if( line.b == undefined ) {
                return Clip2D.#DISCARDED;
            }

            return Clip2D.#CLIPPED;
        }

    }

}


export class Clip3D{

}