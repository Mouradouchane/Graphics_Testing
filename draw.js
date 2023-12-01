
import {RGBA} from "./color.js";
import {Point2D} from "./point.js";
import {Line2D}  from "./line.js";
import {MATH} from "./math.js";
import {Rectangle2D} from "./rectangle.js";
import {Triangle2D} from "./triangle.js";
import {Circle2D} from "./circle.js";
import {Ellipse2D} from "./ellipse.js";
import {Curve2D , LongCurve2D} from "./curve.js";
import {Rotate} from "./rotate.js";
import {FrameBuffer} from "./buffers.js";

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
    static #Resource = {

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

    static #CheckForCanvas(){
        return ( Draw.#Resource.Canvas != undefined && Draw.#Resource.Ctx != undefined );
    }

    static #CheckForBuffer(){
        return ( Draw.#Resource.Buffer instanceof FrameBuffer ) ? true : false;
    }

    static #SetPixle( x , y , pixle_color = null ) {

        x = Number.parseInt(x);
        y = Number.parseInt(y);
        
        if( !(Draw.#Resource.DrawDirectToCanvas) ){

            // if blend color's needed , no z-axis 
            if(pixle_color.alpha < 1) {
                pixle_color = RGBA.Blend( pixle_color , Draw.#Resource.Buffer.get_pixle(x , y) );
            }
            
            Draw.#Resource.Buffer.set_pixle( x , y , pixle_color );
            
        } 
        else {

            Draw.#Resource.Ctx.fillStyle = RGBA.ToString( pixle_color );
            Draw.#Resource.Ctx.fillRect( x , y , 1 , 1 );

        }
        
    }

    /* need work */
    static #GetPixle( x , y ){

    }
    
    // needed for sampling :)

    /* need work */
    static #SetSample( x , y , sample_color ){
    }
    /* need work */
    static #GetSample( x , y ) {
    }

    // =========================================================================
    //                         LINE DRAW PRIVATE FUNCTIONS
    // =========================================================================

    // standard line draw 
    static #DrawLineWithGradient(
        point_1 = new Point2D() , point_2 = new Point2D() , width = 1 ,
        color_1 = new RGBA()  , color_2 = new RGBA()
    ){
        
        point_a = Point2D.Copy(point_1);
        point_b = Point2D.Copy(point_2);

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
        let delta_red   = (color_2.red   - color_1.red)   / g_delta;
        let delta_green = (color_2.green - color_1.green) / g_delta;
        let delta_blue  = (color_2.blue  - color_1.blue)  / g_delta;
        let delta_alpha = (color_2.alpha - color_1.alpha) / g_delta;
        let color = new RGBA(color_1.red , color_1.green , color_1.blue , color_1.alpha);

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
    static #DrawLineNoGradient( 
        point_1 = new Point2D() , point_2 = new Point2D() , 
        width = 1 , color = new RGBA()
    ) {

        let point_a = Point2D.Copy(point_1);
        let point_b = Point2D.Copy(point_2);

        width = Math.abs(width);
        let width_mod = Math.floor(width) % 2;
        width = Math.floor( width / 2 );

        // calc line delta
        let delta_x = (point_b.x - point_a.x); 
        let delta_y = (point_b.y - point_a.y); 
    
        // calc "slop" of the line and "Y intercept"
        let slope = ( delta_x == 0 ) ? 1000 : delta_y / delta_x ; // M
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

    static #DDALineDrawAlgorithm(
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

    /*
        draw a line from a point and slope , this function usualy used for debug
    */
    static #DrawLineFromPoint( point , M , distance  , thickness , color ){
            
        let end_point = MATH.Point2DAtLine( point , M , distance );

        Draw.#DrawLineNoGradient( point , end_point , thickness , color );
    }

    // generate a 3 points outside triangle by certain distance
    static #GenerateOutsideTriangle( triangle = new Triangle2D() , round_values = false ){

        let outside_triangle = new Triangle2D();

        // center of triangle
        let centroid = MATH.Triangle2DCentroid( triangle.a , triangle.b , triangle.c );
  
        let slopes = {
            ab : MATH.Slope2D( triangle.a , triangle.b ),
            ac : MATH.Slope2D( triangle.a , triangle.c ),
            bc : MATH.Slope2D( triangle.b , triangle.c ),
        };

        // normals in triangle 
        let normals = {
            ab : MATH.Normals2D( triangle.a , triangle.b ) ,
            ac : MATH.Normals2D( triangle.a , triangle.c ) , 
            bc : MATH.Normals2D( triangle.b , triangle.c ) ,
        }
        
        // 2 - calc length of normals 
        /*
        let normals_lengths = {
            ab : ( MATH.Distance( triangle.b , triangle.a ) || 1),
            ac : ( MATH.Distance( triangle.c , triangle.a ) || 1),
            bc : ( MATH.Distance( triangle.c , triangle.b ) || 1),
        }
        */
        
        // 3 - normalaize those "length" 
        // + 
        // 4 - scale by thickness value 
        normals.ab.n1 = MATH.Vector2DNormalaizeAndScale( normals.ab.n1 , triangle.thickness);
        normals.ab.n2 = MATH.Vector2DNormalaizeAndScale( normals.ab.n2 , triangle.thickness);
   
        normals.ac.n1 = MATH.Vector2DNormalaizeAndScale( normals.ac.n1 , triangle.thickness);
        normals.ac.n2 = MATH.Vector2DNormalaizeAndScale( normals.ac.n2 , triangle.thickness);

        normals.bc.n1 = MATH.Vector2DNormalaizeAndScale( normals.bc.n1 , triangle.thickness);
        normals.bc.n2 = MATH.Vector2DNormalaizeAndScale( normals.bc.n2 , triangle.thickness);

        let scaled_points = {

            ab  : MATH.Add2DPoints( triangle.a , normals.ab.n1 ) ,
            nab : MATH.Add2DPoints( triangle.a , normals.ab.n2 ) ,
    
            ac  : MATH.Add2DPoints( triangle.c , normals.ac.n1 ),
            nac : MATH.Add2DPoints( triangle.c , normals.ac.n2 ),
               
            bc  : MATH.Add2DPoints( triangle.b , normals.bc.n1 ),
            nbc : MATH.Add2DPoints( triangle.b , normals.bc.n2 ),
            
        }


        /*
            the filter process for getting outside points 
        */
        let ab_check = Draw.#GetOutSidePoint(triangle.a , triangle.b , centroid , scaled_points.ab , scaled_points.nab);
        let ac_check = Draw.#GetOutSidePoint(triangle.a , triangle.c , centroid , scaled_points.ac , scaled_points.nac);
        let bc_check = Draw.#GetOutSidePoint(triangle.b , triangle.c , centroid , scaled_points.bc , scaled_points.nbc);
        
        // object to hold the right points that lies outside the triangles
        // we will use those points to compute the missing intersection points to comple the outside triangle
        let new_points = {
            A : (ab_check == 1) ? scaled_points.ab : scaled_points.nab,
            B : (bc_check == 1) ? scaled_points.bc : scaled_points.nbc,
            C : (ac_check == 1) ? scaled_points.ac : scaled_points.nac,
        } 

        new_points.A.slope = slopes.ab;
        new_points.B.slope = slopes.bc;
        new_points.C.slope = slopes.ac;
        
        outside_triangle.a = (new_points.A.y < new_points.B.y) ? MATH.TowPointsInterceptAt_2D( new_points.A , new_points.B , new_points.A.slope , new_points.B.slope ) : MATH.TowPointsInterceptAt_2D( new_points.B , new_points.A , new_points.B.slope , new_points.A.slope );
        outside_triangle.b = (new_points.A.y < new_points.C.y) ? MATH.TowPointsInterceptAt_2D( new_points.A , new_points.C , new_points.A.slope , new_points.C.slope ) : MATH.TowPointsInterceptAt_2D( new_points.C , new_points.A , new_points.C.slope , new_points.A.slope );
        outside_triangle.c = (new_points.B.y < new_points.C.y) ? MATH.TowPointsInterceptAt_2D( new_points.B , new_points.C , new_points.B.slope , new_points.C.slope ) : MATH.TowPointsInterceptAt_2D( new_points.C , new_points.B , new_points.C.slope , new_points.B.slope );
        
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

        triangle.thickness = (triangle.thickness >= 2 ) ? Math.abs( triangle.thickness ) : 2 ;
 
        // calculate the outside triangle that represent triangle border
        let border_triangle = Draw.#GenerateOutsideTriangle( Triangle2D.Copy(triangle) , true );

        // slopes of triangle lines
        let slopes = {
            ab : MATH.Slope2D( triangle.a , triangle.b ),
            ac : MATH.Slope2D( triangle.a , triangle.c ),
            bc : MATH.Slope2D( triangle.b , triangle.c ),
        };
        
        // intercepts of both triangles inside and outside 
        // we need those intercepts for border rasterzation
        let intercepts = {
            // b = y - (slope * x)

            inside : {
                ab : Math.round( MATH.Yintercept_At_X0_2D(triangle.a , slopes.ab) ), 
                ac : Math.round( MATH.Yintercept_At_X0_2D(triangle.a , slopes.ac) ),
                bc : Math.round( MATH.Yintercept_At_X0_2D(triangle.b , slopes.bc) ),
            },
            
            outside : {
                ab : Math.round( MATH.Yintercept_At_X0_2D(border_triangle.a , slopes.ab) ), 
                ac : Math.round( MATH.Yintercept_At_X0_2D(border_triangle.a , slopes.ac) ),
                bc : Math.round( MATH.Yintercept_At_X0_2D(border_triangle.b , slopes.bc) ),
            }

        }

        let x_start = Math.round(border_triangle.a.x);
        let x_end   = Math.round(border_triangle.a.x);
        let y       = Math.round(border_triangle.a.y);

        let in_x_start = 0;
        let in_x_end = 0;

        // debugger
        // ab - ac
        if( slopes.ab != 0 && slopes.ac != 0 ){

            for( ; y < border_triangle.b.y ; y += 1){
               
                x_start = Math.round(MATH.Xintercept2D(y , slopes.ab , intercepts.outside.ab));
                x_end   = Math.round(MATH.Xintercept2D(y , slopes.ac , intercepts.outside.ac));

                if( y < triangle.c.y && y > triangle.a.y ){
                    
                    if( y < triangle.b.y ){
                       
                        in_x_start = Math.round(MATH.Xintercept2D(y , slopes.ab , intercepts.inside.ab));
                        in_x_end   = Math.round(MATH.Xintercept2D(y , slopes.ac , intercepts.inside.ac));
                    }
                    else{
                        in_x_start = Math.round(MATH.Xintercept2D(y , slopes.bc , intercepts.inside.bc));
                        in_x_end   = Math.round(MATH.Xintercept2D(y , slopes.ac , intercepts.inside.ac));
                    }

                    Draw.#DrawHorizontalLine( x_start , in_x_start , y , triangle.border_color );
                    Draw.#DrawHorizontalLine( in_x_end , x_end , y , triangle.border_color );

                }
                else {
                    Draw.#DrawHorizontalLine( x_start , x_end , y , triangle.border_color );
                }
                
            }

        }

        // debugger
        // bc - ac
        if( slopes.bc != 0 && slopes.ac != 0 ){

            for( ; y <= border_triangle.c.y ; y += 1){

                x_start = Math.round(MATH.Xintercept2D(y , slopes.bc , intercepts.outside.bc));
                x_end   = Math.round(MATH.Xintercept2D(y , slopes.ac , intercepts.outside.ac));

                if( y > triangle.a.y && y < triangle.c.y ){

                    if( y < triangle.b.y ){
                        in_x_start = Math.round(MATH.Xintercept2D(y , slopes.ab , intercepts.inside.ab));                        
                        in_x_end   = Math.round(MATH.Xintercept2D(y , slopes.ac , intercepts.inside.ac));
                    }
                    else{
                        in_x_start = Math.round(MATH.Xintercept2D(y , slopes.bc , intercepts.inside.bc));                        
                        in_x_end   = Math.round(MATH.Xintercept2D(y , slopes.ac , intercepts.inside.ac));
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

        // dy / dx
        let slopes = {
            ab : MATH.Slope2D( triangle.a  , triangle.b ) ,
            ac : MATH.Slope2D( triangle.a  , triangle.c ) ,
            bc : MATH.Slope2D( triangle.b  , triangle.b ) , 
        };
        

        let intercepts = {
            // b = y - mx

            inside : {
                ab : Math.round( MATH.Yintercept_At_X0_2D(triangle.a , slopes.ab) ) ,
                ac : Math.round( MATH.Yintercept_At_X0_2D(triangle.a , slopes.ac) ) ,
                bc : Math.round( MATH.Yintercept_At_X0_2D(triangle.b , slopes.bc) ) ,
            },

        }

        // we need area of triangle to compute alpha and beta 
        let triangle_area = (MATH.AreaOfTriangle2D( triangle.a , triangle.b , triangle.c ) || 1);
        
        // represent the areas of each sub triangle 
        let alpha = 0 , beta = 0 , gamma = 0;

        let x_start = Math.round(triangle.a.x);
        let x_end   = Math.round(triangle.a.x);
        let y       = Math.round(triangle.a.y);

        let p = new Point2D(x_start , y);

        // 3 colors each time for blending
        let c_a = triangle.color_a;
        let c_b = triangle.color_b;
        let c_c = triangle.color_c;

        let color = null;

        // ab - ac
        if( slopes.ab != 0 && slopes.ac != 0 ){

            for( ; y < triangle.b.y ; y += 1){

                x_start = Math.round( MATH.Xintercept2D(y , slopes.ab , intercepts.inside.ab) );
                x_end   = Math.round( MATH.Xintercept2D(y , slopes.ac , intercepts.inside.ac) );
                
                if(x_start > x_end){
                    [x_start , x_end] = [x_end , x_start];
                }

                // computer gradient
                for( let x = x_start ; x <= x_end ; x += 1 ){

                    p.x = x; 
                    p.y = y;

                    alpha = MATH.AreaOfTriangle2D( triangle.b , p , triangle.c ) / triangle_area;
                    beta  = MATH.AreaOfTriangle2D( triangle.a , p , triangle.c ) / triangle_area;
                    gamma = 1 - alpha - beta;

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

                x_start = Math.round( MATH.Xintercept2D(y , slopes.bc , intercepts.inside.bc) );
                x_end   = Math.round( MATH.Xintercept2D(y , slopes.ac , intercepts.inside.ac) );
             
                if(x_start > x_end){
                    [x_start , x_end] = [x_end , x_start];
                }

                // computer gradient
                for( let x = x_start ; x <= x_end ; x += 1 ){

                    p.x = x; 
                    p.y = y;

                    alpha = MATH.AreaOfTriangle2D( triangle.b , p , triangle.c ) / triangle_area;
                    beta  = MATH.AreaOfTriangle2D( triangle.a , p , triangle.c ) / triangle_area;
                    gamma = 1 - alpha - beta;

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
        Draw.#DrawLineNoGradient( triangle.a , triangle.b , 1 , triangle.border_color );
        Draw.#DrawLineNoGradient( triangle.a , triangle.c , 1 , triangle.border_color );
        Draw.#DrawLineNoGradient( triangle.b , triangle.c , 1 , triangle.border_color );

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

                        // todo : fix this bug 
                        // if( Draw.#CalcDistance())

                        Draw.#DrawLineNoGradient(
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


    // =========================================================================
    //                       CURVES DRAW PRIVATE FUNCTIONS
    // =========================================================================

    static #DrawCubicBuzierCurve( curve = new Curve2D() ){

        let old_point = Point2D.Copy(curve.a);
        let new_point = Point2D.Copy(curve.a);

        let k1 , k2 , k3 , k4 ;

        for( let t = curve.accuracy ; t <= 1 ; t += curve.accuracy ){
    
            k1 = (1-t) * (1-t) * (1-t);
            k2 = 3 * Math.pow((1-t),2) * t;
            k3 = 3 * (1-t) * Math.pow(t,2);
            k4 = Math.pow(t,3);

		    new_point.x = Math.round( (curve.a.x * k1) + (curve.b.x * k2) + (curve.c.x * k3) + (curve.d.x * k4) );			
			new_point.y = Math.round( (curve.a.y * k1) + (curve.b.y * k2) + (curve.c.y * k3) + (curve.d.y * k4) );			

            Draw.#DrawLineNoGradient( 
                Point2D.Copy(old_point) , Point2D.Copy(new_point) , curve.thickness , curve.color 
            );

            old_point = Point2D.Copy(new_point);

        }

    }

    static #DrawLongCubicCurve( long_curves = new LongCurve2D() ){

        if( long_curves instanceof LongCurve2D ){

            for( let curve of long_curves.curves ){

                curve.accuracy  = long_curves.accuracy;
                curve.thickness = long_curves.thickness;
                curve.color     = long_curves.color;

                Draw.#DrawCubicBuzierCurve( Curve2D.Copy(curve) );

            }

        }

    }

    /*
        ==============================================================
                PUBLIC FUCNTIONS AS INTERFACE FOR DRAW CLASS
        ==============================================================
    */

    static SetGridSetting( size = 1 , distance = 10 , color = new RGBA(255,255,255,0.5) ){

        Draw.#Resource.GridSize = (typeof(size) == "number") ? size : 1;
        Draw.#Resource.GridDistance = (typeof(distance) == "number") ? distance : 4;
        Draw.#Resource.GridColor = (color instanceof RGBA ) ? color : new RGBA(255,255,255,1);

    }

    static DrawGrid(){

        for( let x = 0 ; x <= Draw.#Resource.Canvas.width ; x += Draw.#Resource.GridDistance ){

            Draw.#DrawVerticalLine( 
                x , 0 , Draw.#Resource.Canvas.height , Draw.#Resource.GridColor 
            );

        }

        for( let y = 0 ; y <= Draw.#Resource.Canvas.height ; y += Draw.#Resource.GridDistance ){
        
            Draw.#DrawHorizontalLine( 
                0 , Draw.#Resource.Canvas.width , y , Draw.#Resource.GridColor
            );
            
        }

    }

    static SetCanvas( canvas_object = undefined ){

        if( canvas_object && canvas_object.tagName == "CANVAS" ){

            Draw.#Resource.Canvas = canvas_object;
            Draw.#Resource.Ctx = Draw.#Resource.Canvas.getContext("2d");

            return true;
        }
        else Draw.#LOG.ERROR.CANVAS.INVALID();

        return false;
    }

    static SetBuffer( buffer_object = new FrameBuffer() ){

        if( buffer_object instanceof FrameBuffer ){

            Draw.#Resource.Buffer = buffer_object;
            return true;

        }
        else Draw.#LOG.ERROR.BUFFER.INVALID();

        return false;
    }

    static RenderBuffer(){

        let f1 = Draw.#CheckForCanvas();
        let f2 = Draw.#CheckForBuffer();

        if( !(Draw.#Resource.DrawDirectToCanvas) ){

        if( f1 && f2 ){

            for( let y = 0 ; y <= Draw.#Resource.Buffer.height() ; y++ ){

                for( let x = 0 ; x <= Draw.#Resource.Buffer.width() ; x++ ){

                    Draw.#Resource.Ctx.fillStyle = RGBA.ToString(Draw.#Resource.Buffer.get_pixle(x,y));
                    Draw.#Resource.Ctx.fillRect( x , y , 1 , 1);

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

        let f1 = Draw.#CheckForBuffer();
        let f2 = (line_object instanceof Line2D);

        if( f1 && f2 ){

            this.#DrawLineNoGradient(
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

        let f1 = Draw.#CheckForBuffer();
        let f2 = (line_object instanceof Line2D);

        if( f1 && f2 ){

            this.#DrawLineWithGradient(
                line_object.a , line_object.b , line_object.width , 
                point_a_color , point_b_color
            );
    
        } 
        else {
            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static Rectangle2D( rectangle_object = new Rectangle2D() ){

        let f1 = Draw.#CheckForBuffer();
        let f2 = (rectangle_object instanceof Rectangle2D);

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
        let f1 = Draw.#CheckForBuffer();
        let f2 = (triangle_object instanceof Triangle2D);
        
        if( f1 && f2 ){

            // make copy for drawing usage 
            let triangle_copy = Triangle2D.Copy(triangle_object);

            // sort points depend on Y-axis
            Triangle2D.SortByY(triangle_copy);
            
            if( triangle_copy.fill_color instanceof RGBA ){

                // fill triangle  
                Draw.#FillTriangle( triangle_copy );
                
            }

            if( triangle_copy.border_color instanceof RGBA && triangle_copy.thickness > 0 ){
                
                if(draw_thick_border) Draw.#DrawTriangleBorder( triangle_copy );
                else Draw.#DrawFastTriangleBorder( triangle_copy );

            }

        }
        else{
            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static Triangle2DWithGradient( triangle_object = new Triangle2D() ){
        
        // check canvas and triangle
        let f1 = Draw.#CheckForBuffer();
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

    static Circle2D( circle_object = new Circle2D() ){

        // check canvas and circle
        let f1 = Draw.#CheckForBuffer();
        let f2 = (circle_object instanceof Circle2D);

        if( f1 && f2 ){
            
            let copy = Circle2D.Copy( circle_object );

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
        let f1 = Draw.#CheckForBuffer();
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

                    Draw.#DrawEllipseWithRotation( 
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
 
    static Curve2D( curve_object = new Curve2D() ){

        // check canvas and circle
        let f1 = Draw.#CheckForBuffer();
        let f2 = (curve_object instanceof Curve2D );
        
        if( f1 && f2 ){

            if( 
                (curve_object.thickness > 0) && 
                (curve_object.color instanceof RGBA) && 
                (curve_object.accuracy > 0)
            ){

                Draw.#DrawCubicBuzierCurve( Curve2D.Copy(curve_object) );

            }

        }
        else{

            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();
 
        }

    }

    static LongCurve2D( curve_object = new LongCurve2D() ){
        
        // check canvas and circle
        let f1 = Draw.#CheckForBuffer();
        let f2 = ( curve_object instanceof LongCurve2D );
        
        if( f1 && f2 ){

            if( 
                (curve_object.thickness > 0) && 
                (curve_object.color instanceof RGBA) && 
                (curve_object.accuracy > 0 && curve_object.accuracy <= 1)
            ){

                Draw.#DrawLongCubicCurve( curve_object );

            }

        }
        else{

            if(!f1) Draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) Draw.#LOG.ERROR.OBJECT.INVALID();
 
        }

    }

} // end of class Draw
