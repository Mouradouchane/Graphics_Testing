
import {RGBA} from "../color.js";
import {Point2D} from "../point.js";
import {Line2D}  from "../line.js";
import {rectangle as RECT , rectangle_with_gradient as RECT_WITH_GRADIENT} from "../rectangle.js";
import {Triangle2D} from "../triangle.js";
import {circle2D} from "../circle.js";
import {Ellipse2D} from "../ellipse.js";
import {Rotate} from "../rotate.js";
import {shear} from "../shear.js";
import {plane2D} from "../plane.js";
import {FrameBuffer} from "../buffers.js";

export class Draw {     // CLASS LIKE NAMESPACE LOL :)

    /*
        ==============================================================
                    PRIVATE FUNCTIONS/STUFF FOR DRAW API 
        ==============================================================
    */

    static #LOG = {

        ERROR : {
            BUFFER : {
                MISSING :() => console.error(
                    "no buffer defined yet to draw in , define buffer using set_buffer function !"
                ), 
                INVALID : () => console.error(
                    "invalid buffer parameter !"
                ),
            },
            CANVAS : {
                MISSING : () => console.error(
                    "no canvas defined yet to draw in , define canvas using set_canvas function !"
                ),
                INVALID : () => console.error(
                    "invalid canvas parameter !"
                ),
            },
            CTX : {
                MISSING : () => console.error(
                    "no context defined yet to draw in , define canvas using SET_CANVAS !"
                ),
                INVALID : () => console.error(
                    "invalid context object !"
                ),
            },
            OBJECT : {
                INVALID : () => console.error(
                    "invalid object to render !"
                ),
            }
        },

        WARN :{
            CANVAS : {
                OUT_OF_RANGE : () => console.warn("the given X or Y coordiantes is out of canvas range !") ,
            },
            BUFFER : {
                OUT_OF_RANGE : () => console.warn("the given X or Y coordiantes is out of buffer range !") ,
            },

        },

        HINT : {

        }

    }

    // for needed stuff for "drawing,options,..." 
    static #RESOURCES = {

        Buffer : undefined, // frame_buffer

        // draw_to_canvas_direct : false,
        Canvas : undefined,
        Ctx : undefined,

        AntiAlising : false,

        CopyObjectForDrawing : false,
        DrawDirectToCanvas : true ,

        GridSize : 1,
        GridDistance : 10,
        GridColor : new RGBA( 255,255,255, 0.1 ),

    }

    static #CHECK_CANVAS(){
        return ( Draw.#RESOURCES.Canvas != undefined && Draw.#RESOURCES.Ctx != undefined );
    }

    static #CHECK_BUFFER(){
        return ( Draw.#RESOURCES.Buffer instanceof FrameBuffer ) ? true : false;
    }

    static #SetPixle( x , y , pixle_color = null ) {

        x = Number.parseInt(x);
        y = Number.parseInt(y);
        
        if( !(Draw.#RESOURCES.DrawDirectToCanvas) ){

            // if blend color's needed , no z-axis 
            if(pixle_color.alpha < 1) {
                pixle_color = RGBA.Blend( pixle_color , Draw.#RESOURCES.Buffer.get_pixle(x , y) );
            }
            
            Draw.#RESOURCES.Buffer.set_pixle( x , y , pixle_color );
            
        } 
        else {

            Draw.#RESOURCES.Ctx.fillStyle = RGBA.ToString( pixle_color );
            Draw.#RESOURCES.Ctx.fillRect( x , y , 1 , 1 );

        }
        
    }

    // we need this for our color blending 
    static #SetSample( x , y , sample_color ){
    }
    static #GetSample( x , y ) {
    }
    static #GetPixle( x , y ) {
    }

    static #CalcDistance( x1 = 1 , x2 = 1 , y1 = 1 , y2 = 1 ){

        return ( Math.sqrt( ((x2 - x1)**2) + ((y2 - y1)**2 ) ) );

    }

    // =========================================================================
    //                         LINE DRAW PRIVATE FUNCTIONS
    // =========================================================================

    // standard line draw 
    static #LineWithGradient(
        point_a = new Point2D() , point_b = new Point2D() , width = 1 ,
        color_a = new RGBA()  , color_b = new RGBA()
    ){

        width = Math.abs(width);
        let width_mod = Math.floor(width) % 2;
        width = Math.floor( width / 2 );

        // calc line delta
        let delta_x = (point_b.x - point_a.x); 
        let delta_y = (point_b.y - point_a.y); 
    
        // calc "slop" of the line and "Y intercept"
        let slope = ( delta_x == 0 ) ? 0 : delta_y / delta_x ; // M
        let Y_intercept = point_a.y - ( slope * point_a.x );   // B

        let x_or_y = Math.abs(delta_x) >= Math.abs(delta_y); 

        let g_delta     = Math.abs( x_or_y ? delta_x : delta_y );
        let delta_red   = (color_b.red   - color_a.red)   / g_delta;
        let delta_green = (color_b.green - color_a.green) / g_delta;
        let delta_blue  = (color_b.blue  - color_a.blue)  / g_delta;
        let delta_alpha = (color_b.alpha - color_a.alpha) / g_delta;
        let color = new RGBA(color_a.red , color_a.green , color_a.blue , color_a.alpha);

        // sort point for proper drawing 
        if( x_or_y && point_a.x > point_b.x || !x_or_y && point_a.y > point_b.y) {
            [point_a.x , point_b.x] = [point_b.x , point_a.x];
            [point_a.y , point_b.y] = [point_b.y , point_a.y];
        }
      
        let new_p = (Math.abs(slope) == 0) ? point_a[(!x_or_y) ? "x" : "y"] : 0;
        
        for( let position = point_a[(x_or_y) ? "x" : "y"]; position <= point_b[(x_or_y) ? "x" : "y"] ; position += 1 ){

            // calc new position if slope not 0
            if(slope != 0){
                new_p = (x_or_y) ? (position * slope) + Y_intercept : (position - Y_intercept) / slope;
            }

            // calc line thickness range 
            let start = Math.abs(new_p - width - width_mod);
            let end   = Math.abs(new_p + width);
            
            // fill the thickness of the line 
            if(x_or_y){

                do{
                    this.#SetPixle( position , start , color );
                    start += 1;
                }
                while(start < end);

            }
            else {

                do{
                    this.#SetPixle( start , position , color );
                    start += 1;
                }
                while(start < end);

            }
            
            // update gradient color
            color.red   += delta_red;
            color.green += delta_green;
            color.blue  += delta_blue;
            color.alpha += delta_alpha;

        }
            
    } 

    // standard line draw 
    static #LineNoGradient( 
        point_a = new Point2D() , point_b = new Point2D() , 
        width = 1 , color = new RGBA()
    ) {

        width = Math.abs(width);
        let width_mod = Math.floor(width) % 2;
        width = Math.floor( width / 2 );

        // calc line delta
        let delta_x = (point_b.x - point_a.x); 
        let delta_y = (point_b.y - point_a.y); 
    
        // calc "slop" of the line and "Y intercept"
        let slope = ( delta_x == 0 ) ? 0 : delta_y / delta_x ; // M
        let Y_intercept = point_a.y - ( slope * point_a.x );   // B

        let x_or_y = Math.abs(delta_x) >= Math.abs(delta_y); 
 
        // sort point for proper drawing 
        if( x_or_y && point_a.x > point_b.x || !x_or_y && point_a.y > point_b.y ) {
            [point_a.x , point_b.x] = [point_b.x , point_a.x];
            [point_a.y , point_b.y] = [point_b.y , point_a.y];
        }
      
        let new_p = (Math.abs(slope) == 0) ? point_a[(!x_or_y) ? "x" : "y"] : 0;
    
        for( let position = point_a[(x_or_y) ? "x" : "y"]; position <= point_b[(x_or_y) ? "x" : "y"] ; position += 1 ){

            // calc new position if slope not 0
            if(slope != 0){
                new_p = (x_or_y) ? (position * slope) + Y_intercept : (position - Y_intercept) / slope;
            }

            // calc line thickness range 
            let start = Math.abs(new_p - width - width_mod);
            let end   = Math.abs(new_p + width);
            
            // fill the thickness of the line 
            if(x_or_y){

                do{
                    this.#SetPixle( position , start , color );
                    start += 1;
                }
                while(start < end);

            }
            else {

                do{
                    this.#SetPixle( start , position , color );
                    start += 1;
                }
                while(start < end);

            }

        }
            

    }

    static #DDA_LineDrawAlgorithm(
        line_object = new Line2D()
    ){

        // sort points 
        if( 
            line_object.a.x > line_object.b.x || line_object.a.y > line_object.b.y
        ){
            [line_object.a.x , line_object.b.x] = [line_object.b.x , line_object.a.x];
            [line_object.a.y , line_object.b.y] = [line_object.b.y , line_object.a.y];
        }
        
        // calc delta of X & Y
        let delta_x = line_object.b.x - line_object.a.x;
        let delta_y = line_object.b.y - line_object.a.y;

        // steps will be the bigger delta 
        let x_or_y  = ( Math.abs(delta_x) > Math.abs(delta_y) );
        let steps   = ( Math.abs(delta_x) > Math.abs(delta_y) ) ? Math.abs(delta_x) : Math.abs(delta_y);
        
        // calc increment values for X & Y
        let inc_X = delta_x / steps;
        let inc_Y = delta_y / steps;

        // from "point 1" and start drawing to "point 2"
        //debugger;

        let x =  line_object.a.x;
        let y =  line_object.a.y;

        let isodd = (line_object.width % 2) == 0;
        let half_width = Math.floor(line_object.width / 2);

        for(let i = 1; i <= steps ; i += 1){

            let sT = ( ( x_or_y ? y : x ) - half_width );
            let eT = ( ( x_or_y ? y : x ) + half_width - (isodd ? 1 : 0));

            if(x_or_y){

                do{
                    this.#SetPixle(Math.round(x) , Math.round(sT) , line_object.color);
                    sT += 1;
                }
                while( sT <= eT );

            }
            else {

                do{
                    this.#SetPixle(Math.round(sT) , Math.round(y) , line_object.color);
                    sT += 1;
                }
                while( sT <= eT );

            }

            // calc next position
            x += inc_X;
            y += inc_Y;
        }
 
    }

    
    // fast and direct function for filling shapes line by line horizontaly  
    static #DrawHorizontalLine( x1 = 1 , x2 = 1 , y = 1 , color = undefined ){
        
        if( x1 > x2 ) [x1 , x2] = [x2 , x1];

        for( let x = x1 ; x <= x2 ; x += 1 ){

            Draw.#SetPixle( x , y , color );

        }

    }
    
    // fast and direct function for filling shapes line by line verticaly  
    static #DrawVerticalLine( x = 1 , y1 = 1 , y2 = 1 , color = undefined ){

        if( y1 > y2 ) [y1 , y2] = [y2 , y1];

        for( let y = y1 ; y <= y2 ; y += 1 ){

            Draw.#SetPixle( x , y , color );

        }

    }
    

    // =========================================================================
    //                      RECTANGLE DRAW PRIVATE FUNCTIONS
    // =========================================================================

    static #FillRectangle(
        X = 1 , Y = 1 , W = 1 , H = 1 , color = new RGBA()
    ){
        X = Number.parseInt( X );
        Y = Number.parseInt( Y );
        W = Number.parseInt( W );
        H = Number.parseInt( H );

        let w = X + W;
        let h = Y + H;

        for(let x = X ; x <= w ; x += 1){
            
            for(let y = Y ; y <= h ; y += 1){
                
                Draw.#SetPixle( x , y , color );
                
            }
            
        }

    }

    static #DawRectangleBorder(
        X = 1 , Y = 1 , W = 1 , H = 1 , B = 1 , color = new RGBA()
    ){

        X = Number.parseInt( X );
        Y = Number.parseInt( Y );
        W = Number.parseInt( W );
        H = Number.parseInt( H );
        B = Number.parseInt( B ) - 1;

        let ranges = [
            { x : (X - B - 1) , y : (Y - B - 1) , w : (X + W + B + 1) , h : Y - 1           }, // top
            { x : (X - B - 1) , y : (Y + H + 1) , w : (X + W + B + 1) , h : (Y + H + B + 1) }, // buttom
            { x : (X - B - 1) , y :  Y          , w :  X - 1          , h : (Y + H)         }, // left 
            { x : (X + W + 1) , y :  Y          , w : (X + W + B + 1) , h : (Y + H)         }, // right
        ];
        
        for(let range of ranges){
            
            for(let x = range.x ; x <= range.w ; x += 1){
                
                for(let y = range.y ; y <= range.h; y += 1) {
                    Draw.#SetPixle( x , y , color );
                }
                
            }
            
        }
        

    }


    // =========================================================================
    //                      TRIANGLE DRAW PRIVATE FUNCTIONS
    // =========================================================================

    // NOTE !!! triangle points need to be sorted by "Y-axis"
    static #FillTriangle( triangle = new Triangle2D() ){
        
        // calc needed values for the process 

        // A-B
        let D_AB_X = (triangle.a.x - triangle.b.x);
            // D_AB_X = (D_AB_X == 0) ? 1 : D_AB_X;
        let D_AB_Y = (triangle.a.y - triangle.b.y);
        let slope_AB = (D_AB_X == 0) ? D_AB_Y : ( D_AB_Y / D_AB_X );
            // slope_AB = (slope_AB == 0) ? 1 : slope_AB;
        let intercept_AB = triangle.a.y - (slope_AB * triangle.a.x);

        // A-C
        let D_AC_X = (triangle.a.x - triangle.c.x);
            // D_AC_X = (D_AC_X == 0) ? 1 : D_AC_X;
        let D_AC_Y = (triangle.a.y - triangle.c.y);
        let slope_AC = (D_AC_X == 0) ? D_AC_Y : ( D_AC_Y / D_AC_X ); 
            // slope_AC = (slope_AC == 0) ? 1 : slope_AC;
        let intercept_AC = triangle.a.y - (slope_AC * triangle.a.x);

        let x_start = Math.round(triangle.a.x);
        let x_end   = Math.round(triangle.b.x);
        let y       = Math.round(triangle.a.y);
        
        // fill from A to B
        if( slope_AB != 0 ){

            for( ; y <= triangle.b.y; y++ ){
    
                // find X's
                x_start = (slope_AC == 0) ? y : Math.round((y - intercept_AC) / slope_AC);
                x_end   = (slope_AB == 0) ? y : Math.round((y - intercept_AB) / slope_AB);
                
                // fill range
                Draw.#DrawHorizontalLine( x_start , x_end , y , triangle.fill_color );
    
            }

        }
        else {
            Draw.#DrawHorizontalLine( x_start , x_end , y , triangle.fill_color );
            y += 1;
        }
        
        // B-C
        let D_BC_X = (triangle.b.x - triangle.c.x);
            // D_BC_X = (D_BC_X == 0) ? 1 : D_BC_X;
        let D_BC_Y = (triangle.b.y - triangle.c.y);
        let slope_BC = (D_BC_X == 0) ? D_BC_Y : ( D_BC_Y / D_BC_X );
            // slope_BC = (slope_BC == 0) ? 1 : slope_BC;
        let intercept_BC = triangle.b.y - (slope_BC * triangle.b.x);
        
        // fill from B to C
        for( ; y <= triangle.c.y ; y += 1 ){

            x_start = (slope_AC == 0) ? y : Math.round((y - intercept_AC) / slope_AC);
            x_end   = (slope_BC == 0) ? y : Math.round((y - intercept_BC) / slope_BC);

            Draw.#DrawHorizontalLine( x_start , x_end , y , triangle.fill_color );

        }

    }


    /*
        A : point A on the line
        B : point B on the line
        C : center point of triangle 
        P1 : target point 1 to check agains
        P2 : target point 2 to check agains

        note : return gonna be "1 or 2" , 1 mean P1 is valid otherwise P2
    */ 

    static #GetOutSidePoint( A , B , CENTROID , P1 , P2 ){
    
        // formula : Math.sign( (Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax) );
        // calc in which side of the line those points + centroid lies !

        let c_rslt  = Math.sign( (B.x - A.x) * (CENTROID.y - A.y) - (B.y - A.y) * (CENTROID.x - A.x) );

        let p1_rslt = Math.sign( (B.x - A.x) * (P1.y - A.y) - (B.y - A.y) * (P1.x - A.x) );

        let p2_rslt = Math.sign( (B.x - A.x) * (P2.y - A.y) - (B.y - A.y) * (P2.x - A.x) );

        // return the correct point that lies in the opposite direction 
        return ((p1_rslt > c_rslt) && (p1_rslt > p2_rslt)) ? 1 : 2;

    }

    // calc the Y or B intercept point using slope intercept form
    // y = (m*x) + b   ===========>   b = y - ( m * x )
    static #CalcYIntercept( target_point = new Point2D() , slope = 0){
        
        return target_point.y - ( target_point.x * slope );

    }

    // compute the intersection points 
    static #CalcInterSectionPoint2D( point_1 , point_2 , a , b ){
        // debugger
        // x : ( (d - c) / ((a - b) | 1) )
        // y :( a * ( (d - c) / ((a - b) | 1) ) ) + c

        // calc intercept point of point 1 & 2
        let c = Draw.#CalcYIntercept( point_1 , a );
        let d = Draw.#CalcYIntercept( point_2 , b );

        let x1 = point_1.x , x2 = point_2.x;
        let y1 = point_1.y , y2 = point_2.y;

        let X = (y2 - y1 + a * x1 - b * x2) / (a - b);
        let Y = (X * a) + c; 

        // the intersection point
        return new Point2D(
            X , Y
        );

    }

    /*
        function to calculate the area of triangle using herons formula 
    */
    static #CalcAreaOf2DTriangle( a = Point2D() , b = Point2D() , c = Point2D() ){

		// calc lengths between the points using : √((x2 – x1)² + (y2 – y1)²)
	    let A = Math.sqrt( Math.abs(((b.x - a.x)**2) + ((b.y - a.y)**2)) );
	    let B = Math.sqrt( Math.abs(((c.x - b.x)**2) + ((c.y - b.y)**2)) );
	    let C = Math.sqrt( Math.abs(((c.x - a.x)**2) + ((c.y - a.y)**2)) );

		let p = (A+B+C) / 2;

		return  Math.sqrt(p * (p - A) * (p - B) * (p - C));

    }

    /*
        draw a line from a point and slope , this function usualy used for debug
    */
    static #DrawLineFromPoint( point , M , distance  , color ){
            
        point = Point2D.Copy(point);

        let b = point.y - ( point.x * M );
        let end_point = new Point2D( point.x + distance , ((point.x+distance) * M) + b );

        Draw.#LineNoGradient( point , end_point , 1 , color );
    }

    static #GenerateOutsideTriangle( triangle = new Triangle2D() , round_values = false ){

        let outside_triangle = new Triangle2D();

        // center of triangle
        let C = {
            x : ((triangle.a.x + triangle.b.x + triangle.c.x) / 3) ,
            y : ((triangle.a.y + triangle.b.y + triangle.c.y) / 3)
        };

        let slopes = {
            ab : ( triangle.a.y - triangle.b.y ) / ( (triangle.a.x - triangle.b.x) | 1 ) ,
            ac : ( triangle.a.y - triangle.c.y ) / ( (triangle.a.x - triangle.c.x) | 1 ) ,
            bc : ( triangle.b.y - triangle.c.y ) / ( (triangle.b.x - triangle.c.x) | 1 ) , 
        };

        // normals in triangle 
        let normals = {

            // n1 for => (-dy ,  dx)
            // n2 for => ( dy , -dx)

            ab : {
                n1: new Point2D( -(triangle.b.y - triangle.a.y) ,  (triangle.b.x - triangle.a.x) ) ,
                n2: new Point2D(  (triangle.b.y - triangle.a.y) , -(triangle.b.x - triangle.a.x) ) ,
            } ,

            ac : {
                n1: new Point2D( -(triangle.c.y - triangle.a.y) ,  (triangle.c.x - triangle.a.x) ) ,
                n2: new Point2D(  (triangle.c.y - triangle.a.y) , -(triangle.c.x - triangle.a.x) ) ,
            } , 

            bc : {
                n1: new Point2D( -(triangle.c.y - triangle.b.y) ,  (triangle.c.x - triangle.b.x) ) ,
                n2: new Point2D(  (triangle.c.y - triangle.b.y) , -(triangle.c.x - triangle.b.x) ) ,
            }

        }
        
        // 2 - calc length of normals 
        let normals_lengths = {
            ab : ( Draw.#CalcDistance(triangle.b.x , triangle.a.x , triangle.b.y , triangle.a.y) | 1),

            ac : ( Draw.#CalcDistance(triangle.c.x , triangle.a.x , triangle.c.y , triangle.a.y) | 1),

            bc : ( Draw.#CalcDistance(triangle.c.x , triangle.b.x , triangle.c.y , triangle.b.y) | 1),
        }
        
        // 3 - normalaize those "length" 
        // + 
        // 4 - scale by thickness value 
        normals.ab.n1.x = (normals.ab.n1.x / normals_lengths.ab) * triangle.thickness;
        normals.ab.n1.y = (normals.ab.n1.y / normals_lengths.ab) * triangle.thickness;

        normals.ac.n1.x = (normals.ac.n1.x / normals_lengths.ac) * triangle.thickness;
        normals.ac.n1.y = (normals.ac.n1.y / normals_lengths.ac) * triangle.thickness;

        normals.bc.n1.x = (normals.bc.n1.x / normals_lengths.bc) * triangle.thickness;
        normals.bc.n1.y = (normals.bc.n1.y / normals_lengths.bc) * triangle.thickness;

        normals.ab.n2.x = (normals.ab.n2.x / normals_lengths.ab) * triangle.thickness;
        normals.ab.n2.y = (normals.ab.n2.y / normals_lengths.ab) * triangle.thickness;

        normals.ac.n2.x = (normals.ac.n2.x / normals_lengths.ac) * triangle.thickness;
        normals.ac.n2.y = (normals.ac.n2.y / normals_lengths.ac) * triangle.thickness;

        normals.bc.n2.x = (normals.bc.n2.x / normals_lengths.bc) * triangle.thickness;
        normals.bc.n2.y = (normals.bc.n2.y / normals_lengths.bc) * triangle.thickness;

        let scaled_points = {

            ab : new Point2D( 
                triangle.a.x + normals.ab.n1.x , 
                triangle.a.y + normals.ab.n1.y 
            ),
    
            ac : new Point2D( 
                triangle.c.x + normals.ac.n1.x , 
                triangle.c.y + normals.ac.n1.y 
            ),

            bc : new Point2D(
                triangle.b.x + normals.bc.n1.x , 
                triangle.b.y + normals.bc.n1.y 
            ),

            // ===================================================== 

            nab : new Point2D( 
                triangle.a.x + normals.ab.n2.x , 
                triangle.a.y + normals.ab.n2.y 
            ),

            nac : new Point2D( 
                triangle.c.x + normals.ac.n2.x , 
                triangle.c.y + normals.ac.n2.y 
            ),

            nbc : new Point2D(
                triangle.b.x + normals.bc.n2.x , 
                triangle.b.y + normals.bc.n2.y 
            ),
        }


        /*
            the filter process for getting outside points 
        */
        let ab_check = Draw.#GetOutSidePoint(triangle.a , triangle.b , C , scaled_points.ab , scaled_points.nab);
        let ac_check = Draw.#GetOutSidePoint(triangle.a , triangle.c , C , scaled_points.ac , scaled_points.nac);
        let bc_check = Draw.#GetOutSidePoint(triangle.b , triangle.c , C , scaled_points.bc , scaled_points.nbc);
        
        // object to hold the right points that lies outside the triangles
        // we will use those points to compute the missing intersection points
        let new_points = {
            A : (ab_check == 1) ? scaled_points.ab : scaled_points.nab,
            B : (bc_check == 1) ? scaled_points.bc : scaled_points.nbc,
            C : (ac_check == 1) ? scaled_points.ac : scaled_points.nac,
        } 

        new_points.A.slope = slopes.ab;
        new_points.B.slope = slopes.bc;
        new_points.C.slope = slopes.ac;
        
        
        outside_triangle.a = (new_points.A.y < new_points.B.y) ? Draw.#CalcInterSectionPoint2D( new_points.A , new_points.B , new_points.A.slope , new_points.B.slope ) : Draw.#CalcInterSectionPoint2D( new_points.B , new_points.A , new_points.B.slope , new_points.A.slope );
        outside_triangle.b = (new_points.A.y < new_points.C.y) ? Draw.#CalcInterSectionPoint2D( new_points.A , new_points.C , new_points.A.slope , new_points.C.slope ) : Draw.#CalcInterSectionPoint2D( new_points.C , new_points.A , new_points.C.slope , new_points.A.slope );
        outside_triangle.c = (new_points.B.y < new_points.C.y) ? Draw.#CalcInterSectionPoint2D( new_points.B , new_points.C , new_points.B.slope , new_points.C.slope ) : Draw.#CalcInterSectionPoint2D( new_points.C , new_points.B , new_points.C.slope , new_points.B.slope );
        
        if(round_values){

            Point2D.Round( outside_triangle.a );
            Point2D.Round( outside_triangle.b );
            Point2D.Round( outside_triangle.c );
            
        }

        Triangle2D.SortByY(outside_triangle);
  
        return outside_triangle;
    }

    /* 
        draw a thick border around 2D triangle
    */
    static #DrawTriangleBorder( triangle = new Triangle2D() ) {

        Point2D.Round( triangle.a );
        Point2D.Round( triangle.b );
        Point2D.Round( triangle.c );

        triangle.thickness = Math.abs( triangle.thickness ) + 1;

        // calculate the outside triangle that represent triangle border
        let border_triangle = Draw.#GenerateOutsideTriangle( triangle , true );

        let slopes = {
            // dy / dx
            ab : ( triangle.a.y - triangle.b.y ) / ( (triangle.a.x - triangle.b.x) | 1 ) ,
            ac : ( triangle.a.y - triangle.c.y ) / ( (triangle.a.x - triangle.c.x) | 1 ) ,
            bc : ( triangle.b.y - triangle.c.y ) / ( (triangle.b.x - triangle.c.x) | 1 ) , 
        };
        
        // intercepts of both triangles inside and outside 
        // we need them for edges calculations
        let intercepts = {
            // b = y - mx

            inside : {
                ab : Math.round(triangle.a.y - (slopes.ab * triangle.a.x)), 
                ac : Math.round(triangle.a.y - (slopes.ac * triangle.a.x)),
                bc : Math.round(triangle.b.y - (slopes.bc * triangle.b.x)),
            },
            
            outside : {
                ab : Math.round(border_triangle.a.y - (slopes.ab * border_triangle.a.x)),
                ac : Math.round(border_triangle.a.y - (slopes.ac * border_triangle.a.x)),
                bc : Math.round(border_triangle.b.y - (slopes.bc * border_triangle.b.x)),
            }

        }

        let x_start = Math.round(border_triangle.a.x);
        let x_end   = Math.round(border_triangle.a.x);
        let y       = Math.round(border_triangle.a.y);

        let in_x_start = 0;
        let in_x_end = 0;

        // ab - ac
        if( slopes.ab != 0 && slopes.ac != 0 ){

            for( ; y < border_triangle.b.y ; y += 1){

                x_start = Math.round( (y - intercepts.outside.ab) / slopes.ab );
                x_end   = Math.round( (y - intercepts.outside.ac) / slopes.ac );

                if( y <= triangle.c.y && y >= triangle.a.y ){
                    
                    if( y < triangle.b.y ){
                        in_x_start = Math.round( (y - intercepts.inside.ab) / slopes.ab ) ;
                        in_x_end   = Math.round( (y - intercepts.inside.ac) / slopes.ac ) ;
                    }
                    else{
                        in_x_start = Math.round( (y - intercepts.inside.bc) / ( (slopes.bc == 0) ? 1 : slopes.bc) ) ;
                        in_x_end   = Math.round( (y - intercepts.inside.ac) / slopes.ac ) ;
                    }

                    Draw.#DrawHorizontalLine( x_start , in_x_start , y , triangle.border_color );
                    Draw.#DrawHorizontalLine( in_x_end , x_end , y , triangle.border_color );

                }
                else {
                    Draw.#DrawHorizontalLine( x_start , x_end , y , triangle.border_color );
                }
                
            }

        }

        // bc - ac
        if( slopes.bc != 0 && slopes.ac != 0 ){

            for( ; y <= border_triangle.c.y ; y += 1){

                x_start = Math.round( (y - intercepts.outside.bc) / slopes.bc );
                x_end   = Math.round( (y - intercepts.outside.ac) / slopes.ac );
            
                if( y >= triangle.a.y && y <= triangle.c.y ){

                    if( y < triangle.b.y ){
                        in_x_start = Math.round( (y - intercepts.inside.ab) / ((slopes.ab == 0) ? 1 : slopes.ab) ) ;
                        in_x_end   = Math.round( (y - intercepts.inside.ac) / slopes.ac );
                    }
                    else{
                        in_x_start = Math.round( (y - intercepts.inside.bc) / slopes.bc );
                        in_x_end   = Math.round( (y - intercepts.inside.ac) / slopes.ac );
                    }

                    Draw.#DrawHorizontalLine( x_start , in_x_start , y , triangle.border_color );
                    Draw.#DrawHorizontalLine( in_x_end , x_end , y , triangle.border_color );

                }
                else{
                    Draw.#DrawHorizontalLine( x_start , x_end , y , triangle.border_color );
                }
                
            }

        }

    
    } 
    // end of #DRAW_TRIANGLE_BORDER

    
    /*
        function to fill triangle with a gradient of 3 colors using barycentric-coordinate 
    */
    static #FillTriangleWithGradient( 
        triangle = new Triangle2D() 
    ){
        
        Point2D.Round( triangle.a );
        Point2D.Round( triangle.b );
        Point2D.Round( triangle.c );

        let slopes = {
            // dy / dx
            ab : ( triangle.a.y - triangle.b.y ) / ( (triangle.a.x - triangle.b.x) | 1 ) ,
            ac : ( triangle.a.y - triangle.c.y ) / ( (triangle.a.x - triangle.c.x) | 1 ) ,
            bc : ( triangle.b.y - triangle.c.y ) / ( (triangle.b.x - triangle.c.x) | 1 ) , 
        };
        

        let intercepts = {
            // b = y - mx

            inside : {
                ab : Math.round(triangle.a.y - (slopes.ab * triangle.a.x)), 
                ac : Math.round(triangle.a.y - (slopes.ac * triangle.a.x)),
                bc : Math.round(triangle.b.y - (slopes.bc * triangle.b.x)),
            },

        }

        // we need area of triangle to compute alpha and beta 
        let triangle_area = Draw.#CalcAreaOf2DTriangle( triangle.a , triangle.b , triangle.c );
        let alpha = 0 , beta = 0 , gamma = 0;

        let x_start = Math.round(triangle.a.x);
        let x_end   = Math.round(triangle.a.x);
        let y       = Math.round(triangle.a.y);

        let p = new Point2D(x_start , y);

        let c_a = triangle.color_a;
        let c_b = triangle.color_b;
        let c_c = triangle.color_c;
        let color = null;

        // ab - ac
        if( slopes.ab != 0 && slopes.ac != 0 ){

            for( ; y < triangle.b.y ; y += 1){

                debugger

                x_start = Math.round( (y - intercepts.inside.ab) / slopes.ab );
                x_end   = Math.round( (y - intercepts.inside.ac) / slopes.ac );
                
                if(x_start > x_end){
                    [x_start , x_end] = [x_end , x_start];
                }

                // computer gradient
                for( let x = x_start ; x <= x_end ; x += 1 ){

                    p.x = x; 
                    p.y = y;

                    alpha = Math.abs(Draw.#CalcAreaOf2DTriangle( triangle.b , p , triangle.c ) / triangle_area);
                    beta  = Math.abs(Draw.#CalcAreaOf2DTriangle( triangle.a , p , triangle.c ) / triangle_area);
                    gamma = Math.abs(1 - alpha - beta);

                    c_a = RGBA.ChangeByFactor( triangle.color_a , alpha );
                    c_b = RGBA.ChangeByFactor( triangle.color_b , beta  );
                    c_c = RGBA.ChangeByFactor( triangle.color_c , gamma );

                    // blend colors 
                    color = RGBA.Blend( RGBA.Blend( c_a , c_b ) , c_c );

                    Draw.#SetPixle( x , y , color );
                }

            }

        }

        // bc - ac
        if( slopes.bc != 0 && slopes.ac != 0 ){

            for( ; y <= triangle.c.y ; y += 1){

                x_start = Math.round( (y - intercepts.inside.bc) / slopes.bc );
                x_end   = Math.round( (y - intercepts.inside.ac) / slopes.ac );
             
                if(x_start > x_end){
                    [x_start , x_end] = [x_end , x_start];
                }

                // computer gradient
                for( let x = x_start ; x <= x_end ; x += 1 ){
                    p.x = x; 
                    p.y = y;

                    alpha = Math.abs(Draw.#CalcAreaOf2DTriangle( triangle.b , p , triangle.c ) / triangle_area);
                    beta  = Math.abs(Draw.#CalcAreaOf2DTriangle( triangle.a , p , triangle.c ) / triangle_area);
                    gamma = Math.abs(1 - alpha - beta);

                    c_a = RGBA.ChangeByFactor( triangle.color_a , alpha );
                    c_b = RGBA.ChangeByFactor( triangle.color_b , beta  );
                    c_c = RGBA.ChangeByFactor( triangle.color_c , gamma );
                    
                    // blend colors 
                    color = RGBA.Blend( RGBA.Blend( c_a , c_b ) , c_c );

                    Draw.#SetPixle( x , y , color );
                }
            }

        }


    }
    // end of #FILL_TRIANGLE_WITH_GRADIENT


    /*
        this function for drawing "non thick border" around triangle 
        using line_draw algorithm as a fast trick
    */
    static #DrawFastTriangleBorder( triangle = new Triangle2D() ){

        triangle.border_color.alpha = 1;
        Draw.#LineNoGradient( triangle.a , triangle.b , 2 , triangle.border_color );
        Draw.#LineNoGradient( triangle.a , triangle.c , 2 , triangle.border_color );
        Draw.#LineNoGradient( triangle.b , triangle.c , 2 , triangle.border_color );

    }


    // =========================================================================
    //                       CIRCLE DRAW PRIVATE FUNCTIONS
    // =========================================================================


    static #DrawCircleUsingQuads(
        X = 1 , Y = 1 , x_org = 1 , y_org = 1 , color_ = "white"
    ){

        Draw.#SetPixle( (X+x_org)  , (Y+y_org)  , color_ );
        Draw.#SetPixle( (X+x_org)  , (-Y+y_org) , color_ );
        Draw.#SetPixle( (-X+x_org) , (Y+y_org)  , color_ );
        Draw.#SetPixle( (-X+x_org) , (-Y+y_org) , color_ );
        
        Draw.#SetPixle( (Y+x_org)  , (X+y_org)  , color_ );
        Draw.#SetPixle( (Y+x_org)  , (-X+y_org) , color_ );
        Draw.#SetPixle( (-Y+x_org) , (X+y_org)  , color_ );
        Draw.#SetPixle( (-Y+x_org) , (-X+y_org) , color_ );

    }

    static #FillCircleUsingQuads(
        x_org = 1 , y_org = 1 , radius = 1 , color_ = "white"
    ){

        let rsqr = radius*radius;
        
        for( let y = -radius ; y <= radius ; y++ ){

            let ysqr = y*y;

            for( let x = -radius ; x <= radius ; x++ ){

                if( x*x + ysqr <= rsqr ){

                    Draw.#DrawHorizontalLine( x_org + x , x_org - x , y_org + y , color_ );

                    break;
                } 
                
            }

        }

    }

    //   mid point algorithm with :
    // - no support to border thickness
    // - no support to fill    
    static #DrawCircleUsingMidPoint(
        x_org = 1 , y_org = 1 , r = 1 , border_color = undefined
    ){
          
        let d = 1 - r;  // decision parameter

        let X = 0;
        let Y = r;
        
        do{

            if( d < 0) {
                X += 1;
                d = d + (2*X) + 3;
            }
            else{
                X += 1 , Y -= 1;
                d = d + 2*(X-Y) + 5;
            } 
            
            // draw or fill in all the QUAD's
            if( border_color ) 
                Draw.#DrawCircleUsingQuads( X , Y , x_org , y_org , border_color );
            
        }
        while( Y > X );

    }

    // draw circle using soultion of mix bettween "mid-point" and "scan-line" 
    static #DrawCircle(
        x_org = 1 , y_org = 1 , r = 1 , thickness = 1 , fill_color = undefined , border_color = undefined
    ){

        // in case "draw cicle border" wanted
        if( border_color ){

            // define needed variables for drawing border with thickness
            let R_sqr = r * r;

            let t  = r + thickness;
            let T_sqr = t * t;

            // thoese to detecte border start and end range to fill it 
            let find_start = true;
            let start = 0;
            let end = 0;

            // just to fill first part of the border
            for( let y = -t ; y < -r ; y++ ){

                let ysqr = y*y;

                for( let x = -t ; x <= 0 ; x++ ){
                    if( (x * x) + ysqr <= T_sqr ){
                        Draw.#DrawHorizontalLine( x_org + x , x_org - x , y_org + y , border_color);
                        Draw.#DrawHorizontalLine( x_org + x , x_org - x , y_org - y , border_color);
                        break;
                    }
                }

            }

            // here fill border process using "scan-line"
            // ty t... "t stans for thickness"
            for( 
                let y = -r , ty = -r   ;  ty <= r  ;   y++ , ty++ 
            ){
                
                let y_sqr = y*y;
                let ty_sqr = ty*ty;
                
                for(
                    let x = -t , tx = -t   ;  tx <= t  ;   x++ , tx++
                ){

                    // try to find "border start"  
                    if( find_start ) {

                        if ( ( tx * tx ) + ty_sqr <= T_sqr ){
                            start = tx;
                            find_start = false;
                        } 

                    }

                    // then try to find border end 
                    if( ( x * x ) + y_sqr <= R_sqr ){
                        end = x;

                        break;
                    } 

                }

                // after getting start/end 
                // fill in it in left and right side of circle

                Draw.#DrawHorizontalLine( 
                    x_org + start , x_org + end -1, y_org + ty , border_color
                );
                
                Draw.#DrawHorizontalLine( 
                    x_org - start , x_org - end +1, y_org + ty , border_color
                );
                
                // reset for next step
                find_start = true;
                start = 0;
                end = 0;

            }
        
        }

        // in case "fill circle" wanted
        if( fill_color ) Draw.#FillCircleUsingQuads( x_org , y_org , r , fill_color );

    }
    

    // =========================================================================
    //                       ELLPISE DRAW PRIVATE FUNCTIONS
    // =========================================================================

    // draw ellipse border with no rotation support
    static #DrawEllipseUsingScanLine(
        x_org = 1 , y_org = 1 , A = 1 , B = 1 , f1 = 0 , f2 = 0 , 
        border_thickness = 1 , border_color = undefined 
    ){

        x_org = Math.round( x_org );
        y_org = Math.round( y_org );

        A = Math.round( A );
        B = Math.round( B );

        let A_sqr = A*A; // A²
        let B_sqr = B*B; // B²
        
        // for border thickness
        let Aout = Math.round( A + Math.abs(border_thickness) );
        let Bout = Math.round( B + Math.abs(border_thickness) );

        let Aout_sqr = Aout*Aout;
        let Bout_sqr = Bout*Bout;

        let m = null; // slope

        let x_start = Aout;
        let x_start_sqr = null; // x²

        let y_start = 1;
        let y_start_sqr = null; // y²

        let x_end = Aout;

        // draw first part of the ellipse 
        for( ; y_start <= Bout ; y_start++ ){
            
            y_start_sqr = y_start*y_start;
            
            x_start++;
            for( ; x_start > 1 ; x_start-- ){
                
                x_start_sqr = x_start*x_start;

                if( ( x_start_sqr / Aout_sqr ) + ( y_start_sqr / Bout_sqr ) <= 1 ){
                    
                    x_end = x_start;

                    while( 
                        ( x_end*x_end / A_sqr ) + ( y_start_sqr / B_sqr ) > 1 && x_end > 1
                    ) x_end-- ;
            
                    // needed values to draw ellipse using reflection 
                    let reflected_values = [
                        {  X :  x_start   ,   Y :  y_start   ,   Xo :  x_end } ,
                        {  X : -x_start   ,   Y :  y_start   ,   Xo : -x_end } ,
                        {  X :  x_start   ,   Y : -y_start   ,   Xo :  x_end } ,
                        {  X : -x_start   ,   Y : -y_start   ,   Xo : -x_end } ,
                    ];

                    // draw all other ellipse parts using reflection
                    for( let reflecte of reflected_values ){

                        Draw.#DrawHorizontalLine(
                            x_org + reflecte.Xo , x_org + reflecte.X , y_org + reflecte.Y , border_color
                        );

                    }
                    
                    m = ( x_start * Bout_sqr ) / ( ( y_start * Aout_sqr ) | 1 );
                    break;
                }

            }

            if( m <= 1 ) break;

        }

        Draw.#DrawHorizontalLine(
            x_org + A - 1, x_org + Aout - 1 , y_org , border_color
        );
        Draw.#DrawHorizontalLine(
            x_org - A + 1, x_org - Aout + 1, y_org , border_color
        );

        // draw secend part of the ellipse 
        y_start++;
        
        for( ; y_start <= Bout ; y_start++ ){
            
            y_start_sqr = y_start*y_start;
            
            x_start++;
            for( ; x_start > 1 ; x_start-- ){

                if( ( ( x_start*x_start ) / Aout_sqr ) + ( y_start_sqr / Bout_sqr ) <= 1 ){
                    
                    x_end = x_start;
                    
                    while( 
                        (x_end*x_end / A_sqr) + ( y_start_sqr / B_sqr ) > 1 && x_end > 1
                    ) x_end--;

                    // needed values to draw ellipse using reflection 
                    let reflected_values = [
                        {  X :  x_start   ,   Y :  y_start   ,   Xo :  x_end  } ,
                        {  X : -x_start   ,   Y :  y_start   ,   Xo : -x_end  } ,
                        {  X :  x_start   ,   Y : -y_start   ,   Xo :  x_end  } ,
                        {  X : -x_start   ,   Y : -y_start   ,   Xo : -x_end  } ,
                    ];
                    
                    // draw ellipse using reflection values
                    for( let reflecte of reflected_values ){

                        Draw.#DrawHorizontalLine(
                            x_org + reflecte.Xo , x_org + reflecte.X , y_org + reflecte.Y , border_color
                        );

                    }

                    break;
                }

            }

        }
 
        Draw.#DrawVerticalLine(x_org + x_start - 1 , y_org + B , y_org + B+ border_thickness - 1 , border_color)
        Draw.#DrawVerticalLine(x_org + x_start - 1 , y_org - B , y_org - B - border_thickness + 1 , border_color)
    
    }

    // note : no rotation support
    static #FillEllipseWithNoRotation(
        x_org = 1 , y_org = 1 , A = 1 , B = 1 , fill_color = undefined 
    ){
        let safety_factor = 4;
        
        let A_sqr = A*A; // A²
        let B_sqr = B*B; // B²

        let x = 1;
        let x_sqr = null; // x²

        let y = -B;
        let y_sqr = null; // y²

        if( A >= B ){

            // fill ellipse process
            Draw.#DrawVerticalLine( x_org , y_org - y - 1 , y_org + y + 1 , fill_color );

            for(  ; x < A ; x++ ){

                x_sqr = x*x;

                y -= safety_factor;

                for(  ; y < 0 ; y++ ){

                    if( ( x_sqr / A_sqr ) + ( (y*y) / B_sqr ) <= 1 ){

                        Draw.#DrawVerticalLine( x_org - x , y_org - y , y_org + y , fill_color );
                        Draw.#DrawVerticalLine( x_org + x , y_org - y , y_org + y , fill_color );

                        break;
                    }

                }

            }

        }
        else {

            // fill ellipse process
            Draw.#DrawHorizontalLine( x_org - A +1, x_org + A-1 , y_org , fill_color );
            
            for( ; y < 0 ; y++ ){

                y_sqr = y*y;
                
                x -= safety_factor;
                for( ; x <= 0 ; x++ ){

                    if( ( (x*x) / A_sqr ) + ( y_sqr / B_sqr ) <= 1 ){

                        Draw.#DrawHorizontalLine( x_org - x , x_org + x , y_org + y , fill_color );
                        Draw.#DrawHorizontalLine( x_org - x , x_org + x , y_org - y , fill_color );

                        break;
                    }

                }

            }

        }

    }

    static #DrawEllipseWithRotation(
        x_org = 1 , y_org = 1 , A = 1 , B = 1 , angle = 0, f1 = new Point2D() , f2 = new Point2D() , 
        border = 1 , border_color = undefined 
    ){k
 
        x_org = Math.round( x_org );
        y_org = Math.round( y_org );

        A = Math.round( A );
        B = Math.round( B );

        let gap_value = 16;
        let gap = ((A >= B) ? A : B) / gap_value; 

        let A_sqr = A*A; // A²
        let B_sqr = B*B; // B²

        // let m = null; // slope

        f1  = Rotate.Z( f1.x , f1.y , angle );
        f2  = Rotate.Z( f2.x , f2.y , angle );
        
        let x = 0;
        let x_sqr = null; // x²

        let y = B;
        let y_sqr = null; // y²

        let ref = [
            {  X :  x   ,   Y :  y  } ,
            {  X : -x   ,   Y :  y  } ,
            {  X :  x   ,   Y : -y  } ,
            {  X : -x   ,   Y : -y  } ,
        ];

        let old_ref = [
            {  X_out :  x   ,   Y_out :  y  } ,
            {  X_out : -x   ,   Y_out :  y  } ,
            {  X_out :  x   ,   Y_out : -y  } ,
            {  X_out : -x   ,   Y_out : -y  } 
        ]

        for( ; x <= A ; x += gap ){

            // debugger
            // if( m >= 1 ) break;

            x_sqr = x * x;
            
            for( ; y >= 0 ; y-- ){
                
                y_sqr = y * y;
     
                if( (x_sqr / A_sqr) + (y_sqr / B_sqr) <= 1 ){
                    
                    // debugger
                    // rotating x and y 

                    ref = [
                        {  X :  x   ,   Y :  y  } ,
                        {  X : -x   ,   Y :  y  } ,
                        {  X :  x   ,   Y : -y  } ,
                        {  X : -x   ,   Y : -y  } ,
                    ];

                    for( let i = 0 ; i < 4 ; i++ ) {                    

                        [ref[i].X , ref[i].Y] = Rotate.Z( ref[i].X , ref[i].Y , angle );

                        if( Draw.#CalcDistance())
                        Draw.#LineNoGradient(
                            new Point2D( x_org + ref[i].X , y_org + ref[i].Y ) ,
                            new Point2D( x_org + old_ref[i].X , y_org + old_ref[i].Y ) ,
                            1 , border_color 
                        );
                        
                    }

                    old_ref = ref;

                    // m = ( x * B_sqr ) / ( ( y * A_sqr ) | 1 );
                    break;
                }

            }

        }

    }


    /*
        ==============================================================
                PUBLIC FUCNTIONS AS INTERFACE FOR DRAW CLASS
        ==============================================================
    */

    static SetGridSetting( size = 1 , distance = 10 , color = new RGBA(255,255,255,0.5) ){

        Draw.#RESOURCES.GridSize = (typeof(size) == "number") ? size : 1;
        Draw.#RESOURCES.GridDistance = (typeof(distance) == "number") ? distance : 4;
        Draw.#RESOURCES.GridColor = (color instanceof RGBA ) ? color : new RGBA(255,255,255,1);

    }

    static DrawGrid(){

        for( let x = 0 ; x <= Draw.#RESOURCES.Canvas.width ; x += Draw.#RESOURCES.GridDistance ){

            Draw.#DrawVerticalLine( 
                x , 0 , Draw.#RESOURCES.Canvas.height , Draw.#RESOURCES.GridColor 
            );

        }

        for( let y = 0 ; y <= Draw.#RESOURCES.Canvas.height ; y += Draw.#RESOURCES.GridDistance ){
        
            Draw.#DrawHorizontalLine( 
                0 , Draw.#RESOURCES.Canvas.width , y , Draw.#RESOURCES.GridColor
            );
            
        }

    }

    static SetCanvas( canvas_object = undefined ){

        if( canvas_object && canvas_object.tagName == "CANVAS" ){

            Draw.#RESOURCES.Canvas = canvas_object;
            Draw.#RESOURCES.Ctx = Draw.#RESOURCES.Canvas.getContext("2d");

            return true;
        }
        else Draw.#LOG.ERROR.CANVAS.INVALID();

        return false;
    }

    static SetBuffer( buffer_object = new FrameBuffer() ){

        if( buffer_object instanceof FrameBuffer ){

            Draw.#RESOURCES.Buffer = buffer_object;
            return true;

        }
        else Draw.#LOG.ERROR.BUFFER.INVALID();

        return false;
    }

    static RenderBuffer(){

        let f1 = Draw.#CHECK_CANVAS();
        let f2 = Draw.#CHECK_BUFFER();

        if( !(Draw.#RESOURCES.DrawDirectToCanvas) ){

        if( f1 && f2 ){

            for( let y = 0 ; y <= Draw.#RESOURCES.Buffer.height() ; y++ ){

                for( let x = 0 ; x <= Draw.#RESOURCES.Buffer.width() ; x++ ){

                    Draw.#RESOURCES.Ctx.fillStyle = RGBA.ToString(Draw.#RESOURCES.Buffer.get_pixle(x,y));
                    Draw.#RESOURCES.Ctx.fillRect( x , y , 1 , 1);

                }
                
            }

            //draw.#RESOURCES.ctx.putImageData( img , img.width , img.height );

        }
        else{
            if(!f1) Draw.#LOG.ERROR.CANVAS.MISSING();
            if(!f2) Draw.#LOG.ERROR.BUFFER.MISSING();
        }

        }

    }

    static Line2D( 
        line_object = new Line2D()
    ) { 

        let f1 = Draw.#CHECK_BUFFER();
        let f2 = (line_object instanceof Line2D);

        if( f1 && f2 ){

            this.#LineNoGradient(
                line_object.a , line_object.b , 
                line_object.width , line_object.color , line_object.anti_alias
            );

        } 
        else {
            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }
    
    // need refactor !!!!
    static Line2DWithGradient( 
        line_object = new Line2D() , point_a_color = new RGBA() , point_b_color = new RGBA() 
    ) {

        let f1 = Draw.#CHECK_BUFFER();
        let f2 = (line_object instanceof Line2D);

        if( f1 && f2 ){

            this.#LineWithGradient(
                line_object.a , line_object.b , line_object.width , 
                point_a_color , point_b_color
            );
    
        } 
        else {
            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static Rectangle2D( rectangle_object = new RECT() ){

        let f1 = Draw.#CHECK_BUFFER();
        let f2 = (rectangle_object instanceof RECT);

        // debugger
        if( f1 && f2 ){

            if( rectangle_object.fill_color ){

                // fill rectangle 
                Draw.#FillRectangle(
                    rectangle_object.position.x , 
                    rectangle_object.position.y , 
                    rectangle_object.width , 
                    rectangle_object.height , 
                    rectangle_object.fill_color
                );

            }
            
            // if rectangle want border around
            if( rectangle_object.border > 0){

                // draw border process in "FILL_RECT_BORDER"
                Draw.#DawRectangleBorder( 
                    rectangle_object.position.x,
                    rectangle_object.position.y,
                    rectangle_object.width,
                    rectangle_object.height,
                    rectangle_object.border,
                    rectangle_object.border_color
                ); 

            }

        }
        else {
            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static Triangle2D( triangle_object = new Triangle2D() , draw_thick_border = false ){

        // check canvas and triangle
        let f1 = Draw.#CHECK_BUFFER();
        let f2 = (triangle_object instanceof Triangle2D);
        
        if( f1 && f2 ){

            // make copy for drawing usage 
            let copy = Triangle2D.Copy(triangle_object);

            // sort points depend on Y-axis
            Triangle2D.SortByY(copy);
            
            if( copy.fill_color instanceof RGBA ){

                // fill triangle  
                Draw.#FillTriangle( copy );
                
            }

            if( copy.border_color instanceof RGBA ){
                
                
                if(draw_thick_border) Draw.#DrawTriangleBorder( copy );
                else Draw.#DrawFastTriangleBorder( copy );

            }

        }
        else{
            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static Triangle2DWithGradient( triangle_object = new Triangle2D() ){
        
        // check canvas and triangle
        let f1 = Draw.#CHECK_BUFFER();
        let f2 = (triangle_object instanceof Triangle2D);
        
        if( f1 && f2 ){

            // make copy for drawing usage 
            // let copy = triangle2D.copy(triangle_object);

            // sort points depend on Y-axis
            Triangle2D.SortByY(triangle_object);
            
            Draw.#FillTriangleWithGradient( triangle_object );

        }
        else{
            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static Circle2D( circle_object = new circle2D() ){

        // check canvas and circle
        let f1 = Draw.#CHECK_BUFFER();
        let f2 = (circle_object instanceof circle2D);

        if( f1 && f2 ){
            
            let copy = circle2D.copy( circle_object );

            if( copy.border_color instanceof RGBA || copy.fill_color instanceof RGBA ){

                Draw.#DrawCircle( Math.round(copy.x) , Math.round(copy.y) , Math.round(copy.r) , Math.round(copy.border) , copy.fill_color , copy.border_color);

            }
        
        }
        else{
            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static Ellipse2D( ellipse_object = new Ellipse2D() ){

        // check canvas and circle
        let f1 = Draw.#CHECK_BUFFER();
        let f2 = (ellipse_object instanceof Ellipse2D);
        
        if( f1 && f2 ){
        
            if( ellipse_object.fill_color instanceof RGBA ){

                // if ellipse fill require no rotation
                if( ellipse_object.angle == 0 ){

                    Draw.#FillEllipseWithNoRotation( 
                        ellipse_object.x , 
                        ellipse_object.y , 
                        ellipse_object.width , 
                        ellipse_object.height ,
                        ellipse_object.fill_color 
                    );

                }
                else { // if ellipse fill require rotation

                    Draw.#FILL_ELLIPSE_WITH_ROTATION( 
                        ellipse_object.x , 
                        ellipse_object.y , 
                        ellipse_object.width , 
                        ellipse_object.height ,
                        ellipse_object.angle,
                        ellipse_object.GetFoci1(),
                        ellipse_object.GetFoci2(),
                        ellipse_object.fill_color
                    );

                }

            }

            // if ellipse require draw border
            if( ellipse_object.border_color instanceof RGBA ){

                // ellipse with rotation
                if( ellipse_object.angle == 0 ){

                    Draw.#DrawEllipseUsingScanLine(
                        ellipse_object.x , 
                        ellipse_object.y , 
                        ellipse_object.width , 
                        ellipse_object.height ,
                        ellipse_object.GetFoci1(),
                        ellipse_object.GetFoci2(),
                        ellipse_object.border , 
                        ellipse_object.border_color
                    );

                }
                // ellipse with no rotation
                else {

                    Draw.#DrawEllipseWithRotation(
                        ellipse_object.x , 
                        ellipse_object.y , 
                        ellipse_object.width , 
                        ellipse_object.height ,
                        ellipse_object.angle ,
                        ellipse_object.GetFoci1(),
                        ellipse_object.GetFoci2(),
                        ellipse_object.border , 
                        ellipse_object.border_color
                    );

                }

            }

        }
        else{

            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();

        }

    } 
 

} // end of class Draw
