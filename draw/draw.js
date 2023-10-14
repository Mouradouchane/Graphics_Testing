
import {point2D} from "../point.js"
import {line , line_with_colors} from "../line.js"
import {rectangle as RECT , rectangle_with_gradient as RECT_WITH_GRADIENT} from "../rectangle.js";
import {RGBA} from "../color.js";
import {triangle2D} from "../triangle.js";
import {circle2D} from "../circle.js";
import {ellipse2D} from "../ellipse.js";
import {rotate} from "../rotate.js";
import {shear} from "../shear.js";
import {plane2D} from "../plane.js";
import {frame_buffer} from "../buffers.js";

export class draw {     // CLASS LIKE NAMESPACE :)

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

        buffer : undefined, // frame_vuffer

        // draw_to_canvas_direct : false,
        canvas : undefined,
        ctx : undefined,

        anti_alising : false,

        copy_object_for_drawing : false,
        draw_direct_to_canvas : true ,

        grid_size : 1,
        grid_distance : 10,
        grid_color : new RGBA( 255,255,255, 0.1 ),

    }

    static #CHECK_CANVAS(){
        return ( draw.#RESOURCES.canvas != undefined && draw.#RESOURCES.ctx != undefined );
    }

    static #CHECK_BUFFER(){
        return ( draw.#RESOURCES.buffer instanceof frame_buffer ) ? true : false;
    }

    static #set_pixle( x , y , pixle_color = null ) {

        x = Number.parseInt(x);
        y = Number.parseInt(y);
        
        if( !(draw.#RESOURCES.draw_direct_to_canvas) ){

            // if blend color's needed , no z-axis 
            if(pixle_color.alpha < 1) {
                pixle_color = RGBA.blend( pixle_color , draw.#RESOURCES.buffer.get_pixle(x , y) );
            }
            
            draw.#RESOURCES.buffer.set_pixle( x , y , pixle_color );
            
        } 
        else {

            draw.#RESOURCES.ctx.fillStyle = RGBA.to_string( pixle_color );
            draw.#RESOURCES.ctx.fillRect( x , y , 1 , 1 );

        }
        
    }

    // we need this for our color blending 
    static #set_sample( x , y , sample_color ){
    }
    static #canvas_get_pixle( x , y ) {
    }
    static #buffer_get_pixle( x , y ) {
    }
    static #buffer_get_sample( x , y ) {
    }

    static #CALC_DISTANCE( x1 = 1 , x2 = 1 , y1 = 1 , y2 = 1 ){

        return ( Math.sqrt( ((x2 - x1)**2) + ((y2 - y1)**2 ) ) );

    }

    // =========================================================================
    //                         LINE DRAW PRIVATE FUNCTIONS
    // =========================================================================

    // standard line draw 
    static #CUSTOM_LINE_WITH_GRADIENT(
        point_a = new point2D() , point_b = new point2D() , width = 1 ,
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
                    this.#set_pixle( position , start , color );
                    start += 1;
                }
                while(start < end);

            }
            else {

                do{
                    this.#set_pixle( start , position , color );
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
    static #CUSTOM_LINE_NO_GRADIENT( 
        point_a = new point2D() , point_b = new point2D() , 
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
        
        // debugger;

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
                    this.#set_pixle( position , start , color );
                    start += 1;
                }
                while(start < end);

            }
            else {

                do{
                    this.#set_pixle( start , position , color );
                    start += 1;
                }
                while(start < end);

            }

        }
            

    }

    static #DDA_LINE_DRAW_ALGORITHM(
        line_object = new line()
    ){

        // sort points 
        if( 
            line_object.p1.x > line_object.p2.x || line_object.p1.y > line_object.p2.y
        ){
            [line_object.p1.x , line_object.p2.x] = [line_object.p2.x , line_object.p1.x];
            [line_object.p1.y , line_object.p2.y] = [line_object.p2.y , line_object.p1.y];
        }
        
        // calc delta of X & Y
        let delta_x = line_object.p2.x - line_object.p1.x;
        let delta_y = line_object.p2.y - line_object.p1.y;

        // steps will be the bigger delta 
        let x_or_y  = ( Math.abs(delta_x) > Math.abs(delta_y) );
        let steps   = ( Math.abs(delta_x) > Math.abs(delta_y) ) ? Math.abs(delta_x) : Math.abs(delta_y);
        
        // calc increment values for X & Y
        let inc_X = delta_x / steps;
        let inc_Y = delta_y / steps;

        // from "point 1" and start drawing to "point 2"
        //debugger;

        let x =  line_object.p1.x;
        let y =  line_object.p1.y;

        let isodd = (line_object.width % 2) == 0;
        let half_width = Math.floor(line_object.width / 2);

        for(let i = 1; i <= steps ; i += 1){

            let sT = ( ( x_or_y ? y : x ) - half_width );
            let eT = ( ( x_or_y ? y : x ) + half_width - (isodd ? 1 : 0));

            if(x_or_y){

                do{
                    this.#set_pixle(Math.round(x) , Math.round(sT) , line_object.color);
                    sT += 1;
                }
                while( sT <= eT );

            }
            else {

                do{
                    this.#set_pixle(Math.round(sT) , Math.round(y) , line_object.color);
                    sT += 1;
                }
                while( sT <= eT );

            }

            // calc next position
            x += inc_X;
            y += inc_Y;
        }
 
    }

    // ****** need work ******
    static #GUPTA_SPROULL_LINE_DRAW_ALGORITHM(){

    }

    // ****** need work ******
    static #BRESENHAM_LINE_DRAW_ALGORITHM(){
        
    }

    // fast and direct function for filling shapes line by line horizontaly  
    static #DRAW_HORIZONTAL_LINE( x1 = 1 , x2 = 1 , y = 1 , color = undefined ){
        
        if( x1 > x2 ) [x1 , x2] = [x2 , x1];

        for( let x = x1 ; x <= x2 ; x += 1 ){

            draw.#set_pixle( x , y , color );

        }

    }
    
    // fast and direct function for filling shapes line by line verticaly  
    static #DRAW_VERTICAL_LINE( x = 1 , y1 = 1 , y2 = 1 , color = undefined ){

        if( y1 > y2 ) [y1 , y2] = [y2 , y1];

        for( let y = y1 ; y <= y2 ; y += 1 ){

            draw.#set_pixle( x , y , color );

        }

    }
    

    // =========================================================================
    //                      RECTANGLE DRAW PRIVATE FUNCTIONS
    // =========================================================================

    static #FILL_RECT(
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
                
                draw.#set_pixle( x , y , color );
                
            }
            
        }

    }

    static #DRAW_RECT_BORDER(
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
                    draw.#set_pixle( x , y , color );
                }
                
            }
            
        }
        

    }


    // =========================================================================
    //                      TRIANGLE DRAW PRIVATE FUNCTIONS
    // =========================================================================

    // NOTE !!! triangle points need to be sorted by "Y-axis"
    static #FILL_TRIANGLE( copy = new triangle2D() ){

        // calc needed values

        // A-B
        let D_AB_X = (copy.a.x - copy.b.x);
            // D_AB_X = (D_AB_X == 0) ? 1 : D_AB_X;
        let D_AB_Y = (copy.a.y - copy.b.y);
        let slope_AB = (D_AB_X == 0) ? D_AB_Y : ( D_AB_Y / D_AB_X );
            // slope_AB = (slope_AB == 0) ? 1 : slope_AB;
        let intercept_AB = copy.a.y - (slope_AB * copy.a.x);

        // A-C
        let D_AC_X = (copy.a.x - copy.c.x);
            // D_AC_X = (D_AC_X == 0) ? 1 : D_AC_X;
        let D_AC_Y = (copy.a.y - copy.c.y);
        let slope_AC = (D_AC_X == 0) ? D_AC_Y : ( D_AC_Y / D_AC_X ); 
            // slope_AC = (slope_AC == 0) ? 1 : slope_AC;
        let intercept_AC = copy.a.y - (slope_AC * copy.a.x);

        let x_start = copy.a.x;
        let x_end = copy.b.x;
        let y = copy.a.y;

        // fill from A to B
        if( slope_AB != 0 ){

            for( ; y <= copy.b.y; y++ ){
    
                // find X's
                x_start = (slope_AC == 0) ? y : Math.ceil((y - intercept_AC) / slope_AC);
                x_end   = (slope_AB == 0) ? y : Math.ceil((y - intercept_AB) / slope_AB);
                
                // fill range
                draw.#DRAW_HORIZONTAL_LINE( x_start , x_end , y , copy.fill_color );
    
            }

        }
        else {
            draw.#DRAW_HORIZONTAL_LINE( x_start , x_end , y , copy.fill_color );
            y += 1;
        }
        
        // B-C
        let D_BC_X = (copy.b.x - copy.c.x);
            // D_BC_X = (D_BC_X == 0) ? 1 : D_BC_X;
        let D_BC_Y = (copy.b.y - copy.c.y);
        let slope_BC = (D_BC_X == 0) ? D_BC_Y : ( D_BC_Y / D_BC_X );
            // slope_BC = (slope_BC == 0) ? 1 : slope_BC;
        let intercept_BC = copy.b.y - (slope_BC * copy.b.x);
        
        // fill from B to C
        for( ; y <= copy.c.y ; y += 1 ){

            x_start = (slope_AC == 0) ? y : Math.ceil((y - intercept_AC) / slope_AC);
            x_end   = (slope_BC == 0) ? y : Math.ceil((y - intercept_BC) / slope_BC);

            draw.#DRAW_HORIZONTAL_LINE( x_start , x_end , y , copy.fill_color );

        }

    }

    // ****** todo : rewrite this ****** 
    static #DRAW_TRIANGLE(
        triangle = new triangle2D()
    ) {

        debugger; 

        // 0 - calc center of triangle 
        let triangle_center =  {
            x : Math.round((triangle.a.x + triangle.b.x + triangle.c.x) / 3) ,
            y : Math.round((triangle.a.y + triangle.b.y + triangle.c.y) / 3) ,
        }

        // 1 - move points to origin(0,0) using C
        /*
        */
        triangle.a.x -= triangle_center.x;
        triangle.a.y -= triangle_center.y;

        triangle.b.x -= triangle_center.x;
        triangle.b.y -= triangle_center.y;
        
        triangle.c.x -= triangle_center.x;
        triangle.c.y -= triangle_center.y;

        // 2 - calc length of the points  ::  ||v|| = sqrt( x² + y² )
        let a_length = Math.sqrt( (triangle.a.x*triangle.a.x) + ( triangle.a.y*triangle.a.y) ); 
        let b_length = Math.sqrt( (triangle.b.x*triangle.b.x) + ( triangle.b.y*triangle.b.y) ); 
        let c_length = Math.sqrt( (triangle.c.x*triangle.c.x) + ( triangle.c.y*triangle.c.y) ); 

        // 3 - normalize moved points  ::  v = [ v.x / ||v|| , v.y / ||v|| ]
        triangle.a.x /= a_length;
        triangle.a.y /= a_length;

        triangle.b.x /= b_length;
        triangle.b.y /= b_length;

        triangle.c.x /= c_length;
        triangle.c.y /= c_length;
        
        // 4 - scale up to normalized to the required size
        // 5 - move those new points back to correct position C(x,y)
        triangle.a.x = ( triangle.a.x * (a_length + (triangle.thickness | 1)) ) + triangle_center.x;
        triangle.a.y = ( triangle.a.y * (a_length + (triangle.thickness | 1)) ) + triangle_center.y;

        triangle.b.x = ( triangle.b.x * (b_length + (triangle.thickness | 1)) ) + triangle_center.x;
        triangle.b.y = ( triangle.b.y * (b_length + (triangle.thickness | 1)) ) + triangle_center.y;

        triangle.c.x = ( triangle.c.x * (c_length + (triangle.thickness | 1)) ) + triangle_center.x;
        triangle.c.y = ( triangle.c.y * (c_length + (triangle.thickness | 1)) ) + triangle_center.y;

        let new_triangle_center =  {
            x : Math.round((triangle.a.x + triangle.b.x + triangle.c.x) / 3) ,
            y : Math.round((triangle.a.y + triangle.b.y + triangle.c.y) / 3) ,
        }


        // 6 - fill the area / todo : fill only the width area
        draw.#FILL_TRIANGLE(triangle);
        
        // for debug only
        draw.circle( new circle2D(triangle_center.x , triangle_center.y , 2 , new RGBA(255,255,0,1)));
        draw.circle( new circle2D(
            (triangle.a.x + triangle.b.x + triangle.c.x) / 3, 
            (triangle.a.y + triangle.b.y + triangle.c.y) / 3
        , 2 , new RGBA(0,0,0,1)));
        draw.circle( new circle2D(triangle.a.x , triangle.a.y , 2 , new RGBA(255,255,0,1)));
        draw.circle( new circle2D(triangle.b.x , triangle.b.y , 2 , new RGBA(255,255,0,1)));
        draw.circle( new circle2D(triangle.c.x , triangle.c.y , 2 , new RGBA(255,255,0,1)));

    }

    // =========================================================================
    //                       CIRCLE DRAW PRIVATE FUNCTIONS
    // =========================================================================

    static #CIRCLE_DRAW_ALL_QUADS(
        X = 1 , Y = 1 , x_org = 1 , y_org = 1 , color_ = "white"
    ){

        draw.#set_pixle( (X+x_org)  , (Y+y_org)  , color_ );
        draw.#set_pixle( (X+x_org)  , (-Y+y_org) , color_ );
        draw.#set_pixle( (-X+x_org) , (Y+y_org)  , color_ );
        draw.#set_pixle( (-X+x_org) , (-Y+y_org) , color_ );
        
        draw.#set_pixle( (Y+x_org)  , (X+y_org)  , color_ );
        draw.#set_pixle( (Y+x_org)  , (-X+y_org) , color_ );
        draw.#set_pixle( (-Y+x_org) , (X+y_org)  , color_ );
        draw.#set_pixle( (-Y+x_org) , (-X+y_org) , color_ );

    }

    static #CIRCLE_FILL_ALL_QUADS(
        x_org = 1 , y_org = 1 , radius = 1 , color_ = "white"
    ){

        let rsqr = radius*radius;
        
        for( let y = -radius ; y <= radius ; y++ ){

            let ysqr = y*y;

            for( let x = -radius ; x <= radius ; x++ ){

                if( x*x + ysqr <= rsqr ){

                    draw.#DRAW_HORIZONTAL_LINE( x_org + x , x_org - x , y_org + y , color_ );

                    break;
                } 
                
            }

        }

    }

    //   mid point algorithm with :
    // - no support to border thickness
    // - no support to fill    
    static #MID_POINT_CIRCLE_DRAW(
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
                draw.#CIRCLE_DRAW_ALL_QUADS( X , Y , x_org , y_org , border_color );
            
        }
        while( Y > X );

    }

    // draw circle using soultion of mix bettween "mid-point" and "scan-line" 
    static #DRAW_CIRCLE(
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
                        draw.#DRAW_HORIZONTAL_LINE( x_org + x , x_org - x , y_org + y , border_color);
                        draw.#DRAW_HORIZONTAL_LINE( x_org + x , x_org - x , y_org - y , border_color);
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

                draw.#DRAW_HORIZONTAL_LINE( 
                    x_org + start , x_org + end -1, y_org + ty , border_color
                );
                
                draw.#DRAW_HORIZONTAL_LINE( 
                    x_org - start , x_org - end +1, y_org + ty , border_color
                );
                
                // reset for next step
                find_start = true;
                start = 0;
                end = 0;

            }
        
        }

        // in case "fill circle" wanted
        if( fill_color ) draw.#CIRCLE_FILL_ALL_QUADS( x_org , y_org , r , fill_color );

    }
    

    // =========================================================================
    //                       ELLPISE DRAW PRIVATE FUNCTIONS
    // =========================================================================

    // draw ellipse border with no rotation support
    static #DRAW_ELLIPSE_SCANLINE(
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

                        draw.#DRAW_HORIZONTAL_LINE(
                            x_org + reflecte.Xo , x_org + reflecte.X , y_org + reflecte.Y , border_color
                        );

                    }
                    
                    m = ( x_start * Bout_sqr ) / ( ( y_start * Aout_sqr ) | 1 );
                    break;
                }

            }

            if( m <= 1 ) break;

        }

        draw.#DRAW_HORIZONTAL_LINE(
            x_org + A - 1, x_org + Aout - 1 , y_org , border_color
        );
        draw.#DRAW_HORIZONTAL_LINE(
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

                        draw.#DRAW_HORIZONTAL_LINE(
                            x_org + reflecte.Xo , x_org + reflecte.X , y_org + reflecte.Y , border_color
                        );

                    }

                    break;
                }

            }

        }
 
        draw.#DRAW_VERTICAL_LINE(x_org + x_start - 1 , y_org + B , y_org + B+ border_thickness - 1 , border_color)
        draw.#DRAW_VERTICAL_LINE(x_org + x_start - 1 , y_org - B , y_org - B - border_thickness + 1 , border_color)
    
    }

    // note : no rotation support
    static #FILL_ELLIPSE_WITH_NO_ROTATION(
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
            draw.#DRAW_VERTICAL_LINE( x_org , y_org - y - 1 , y_org + y + 1 , fill_color );

            for(  ; x < A ; x++ ){

                x_sqr = x*x;

                y -= safety_factor;

                for(  ; y < 0 ; y++ ){

                    if( ( x_sqr / A_sqr ) + ( (y*y) / B_sqr ) <= 1 ){

                        draw.#DRAW_VERTICAL_LINE( x_org - x , y_org - y , y_org + y , fill_color );
                        draw.#DRAW_VERTICAL_LINE( x_org + x , y_org - y , y_org + y , fill_color );

                        break;
                    }

                }

            }

        }
        else {

            // fill ellipse process
            draw.#DRAW_HORIZONTAL_LINE( x_org - A +1, x_org + A-1 , y_org , fill_color );
            
            for( ; y < 0 ; y++ ){

                y_sqr = y*y;
                
                x -= safety_factor;
                for( ; x <= 0 ; x++ ){

                    if( ( (x*x) / A_sqr ) + ( y_sqr / B_sqr ) <= 1 ){

                        draw.#DRAW_HORIZONTAL_LINE( x_org - x , x_org + x , y_org + y , fill_color );
                        draw.#DRAW_HORIZONTAL_LINE( x_org - x , x_org + x , y_org - y , fill_color );

                        break;
                    }

                }

            }

        }

    }

    static #DRAW_ELLIPSE_WITH_ROTATION(
        x_org = 1 , y_org = 1 , A = 1 , B = 1 , angle = 0, f1 = new point2D() , f2 = new point2D() , 
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

        f1  = rotate.z( f1.x , f1.y , angle );
        f2  = rotate.z( f2.x , f2.y , angle );
        
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

                        [ref[i].X , ref[i].Y] = rotate.z( ref[i].X , ref[i].Y , angle );

                        if( draw.#CALC_DISTANCE())
                        draw.#CUSTOM_LINE_NO_GRADIENT(
                            new point2D( x_org + ref[i].X , y_org + ref[i].Y ) ,
                            new point2D( x_org + old_ref[i].X , y_org + old_ref[i].Y ) ,
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

    /* need work */
    static #FILL_ELLIPSE_WITH_ROTATION(
        x_org = 1 , y_org = 1 , A = 1 , B = 1 , angle = 0, f1 = new point2D() , f2 = new point2D() , 
        fill_color = undefined 
    ){

    }


    /*
        ==============================================================
                PUBLIC FUCNTIONS AS INTERFACE FOR DRAWING 
        ==============================================================
    */

    static set_grid_setting( size = 1 , distance = 10 , color = new RGBA(255,255,255,0.5) ){

        draw.#RESOURCES.grid_size = (typeof(size) == "number") ? size : 1;
        draw.#RESOURCES.grid_distance = (typeof(distance) == "number") ? distance : 4;
        draw.#RESOURCES.grid_color = (color instanceof RGBA ) ? color : new RGBA(255,255,255,1);

    }

    static draw_grid(){

        for( let x = 0 ; x <= draw.#RESOURCES.canvas.width ; x += draw.#RESOURCES.grid_distance ){

            draw.#DRAW_VERTICAL_LINE( 
                x , 0 , draw.#RESOURCES.canvas.height , draw.#RESOURCES.grid_color 
            );

        }

        for( let y = 0 ; y <= draw.#RESOURCES.canvas.height ; y += draw.#RESOURCES.grid_distance ){
        
            draw.#DRAW_HORIZONTAL_LINE( 
                0 , draw.#RESOURCES.canvas.width , y , draw.#RESOURCES.grid_color
            );
            
        }

    }

    static set_canvas( canvas_object = undefined ){

        if( canvas_object && canvas_object.tagName == "CANVAS" ){

            draw.#RESOURCES.canvas = canvas_object;
            draw.#RESOURCES.ctx = draw.#RESOURCES.canvas.getContext("2d");

            return true;
        }
        else draw.#LOG.ERROR.CANVAS.INVALID();

        return false;
    }

    static set_buffer( buffer_object = new frame_buffer() ){

        if( buffer_object instanceof frame_buffer ){

            draw.#RESOURCES.buffer = buffer_object;
            return true;

        }
        else draw.#LOG.ERROR.BUFFER.INVALID();

        return false;
    }

    static render_buffer(){

        let f1 = draw.#CHECK_CANVAS();
        let f2 = draw.#CHECK_BUFFER();

        if( !(draw.#RESOURCES.draw_direct_to_canvas) ){

        if( f1 && f2 ){

            for( let y = 0 ; y <= draw.#RESOURCES.buffer.height() ; y++ ){

                for( let x = 0 ; x <= draw.#RESOURCES.buffer.width() ; x++ ){

                    draw.#RESOURCES.ctx.fillStyle = RGBA.to_string(draw.#RESOURCES.buffer.get_pixle(x,y));
                    draw.#RESOURCES.ctx.fillRect( x , y , 1 , 1);

                }
                
            }

            //draw.#RESOURCES.ctx.putImageData( img , img.width , img.height );

        }
        else{
            if(!f1) draw.#LOG.ERROR.CANVAS.MISSING();
            if(!f2) draw.#LOG.ERROR.BUFFER.MISSING();
        }

        }

    }

    static line( 
        line_object = new line()
    ) { 

        let f1 = draw.#CHECK_BUFFER();
        let f2 = (line_object instanceof line);

        if( f1 && f2 ){

            this.#CUSTOM_LINE_NO_GRADIENT(
                line_object.p1 , line_object.p2 , 
                line_object.width , line_object.color , line_object.anti_alias
            );

        } 
        else {
            if(!f1) draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }
    
    static line_with_gradient( 
        line_object = new line_with_colors()
    ) {

        let f1 = draw.#CHECK_BUFFER();
        let f2 = (line_object instanceof line_with_colors);

        if( f1 && f2 ){

            this.#CUSTOM_LINE_WITH_GRADIENT(
                line_object.p1 , line_object.p2 , line_object.width , 
                line_object.p1.color , line_object.p2.color , line_object.anti_alias
            );
    
        } 
        else {
            if(!f1) draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static rectangle( rectangle_obejct = new RECT() ){

        let f1 = draw.#CHECK_BUFFER();
        let f2 = (rectangle_obejct instanceof RECT);

        // debugger
        if( f1 && f2 ){

            if( rectangle_obejct.fill_color ){

                // fill rectangle 
                draw.#FILL_RECT(
                    rectangle_obejct.position.x , 
                    rectangle_obejct.position.y , 
                    rectangle_obejct.width , 
                    rectangle_obejct.height , 
                    rectangle_obejct.fill_color
                );

            }
            
            // if rectangle want border around
            if( rectangle_obejct.border > 0){

                // draw border process in "FILL_RECT_BORDER"
                draw.#DRAW_RECT_BORDER( 
                    rectangle_obejct.position.x,
                    rectangle_obejct.position.y,
                    rectangle_obejct.width,
                    rectangle_obejct.height,
                    rectangle_obejct.border,
                    rectangle_obejct.border_color
                ); 

            }

        }
        else {
            if(!f1) draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static triangle( triangle_object = new triangle2D() ){

        // check canvas and triangle
        let f1 = draw.#CHECK_BUFFER();
        let f2 = (triangle_object instanceof triangle2D);
        
        if( f1 && f2 ){

            // make copy for drawing usage 
            let copy = triangle2D.copy(triangle_object);

            // sort points depend on Y-axis
            triangle2D.sort_by_y_axis(copy);
            
            if( copy.fill_color instanceof RGBA ){

                // fill triangle  
                draw.#FILL_TRIANGLE( copy );
                
            }

            if( copy.border_color instanceof RGBA ){
                
                // draw border for triangle
                draw.#DRAW_TRIANGLE( copy );
   
            }

        }
        else{
            if(!f1) draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static circle( circle_object = new circle2D() ){

        // check canvas and circle
        let f1 = draw.#CHECK_BUFFER();
        let f2 = (circle_object instanceof circle2D);

        if( f1 && f2 ){
            
            let copy = circle2D.copy( circle_object );

            if( copy.border_color instanceof RGBA || copy.fill_color instanceof RGBA ){

                draw.#DRAW_CIRCLE( Math.round(copy.x) , Math.round(copy.y) , Math.round(copy.r) , Math.round(copy.border) , copy.fill_color , copy.border_color);

            }
        
        }
        else{
            if(!f1) draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static ellipse( ellipse_object = new ellipse2D() ){

        // check canvas and circle
        let f1 = draw.#CHECK_BUFFER();
        let f2 = (ellipse_object instanceof ellipse2D);
        
        if( f1 && f2 ){
        
            if( ellipse_object.fill_color instanceof RGBA ){

                // if ellipse fill require no rotation
                if( ellipse_object.angle == 0 ){

                    draw.#FILL_ELLIPSE_WITH_NO_ROTATION( 
                        ellipse_object.x , 
                        ellipse_object.y , 
                        ellipse_object.width , 
                        ellipse_object.height ,
                        ellipse_object.fill_color 
                    );

                }
                else { // if ellipse fill require rotation

                    draw.#FILL_ELLIPSE_WITH_ROTATION( 
                        ellipse_object.x , 
                        ellipse_object.y , 
                        ellipse_object.width , 
                        ellipse_object.height ,
                        ellipse_object.angle,
                        ellipse_object.get_f1(),
                        ellipse_object.get_f2(),
                        ellipse_object.fill_color
                    );

                }

            }

            // if ellipse require draw border
            if( ellipse_object.border_color instanceof RGBA ){

                // ellipse with rotation
                if( ellipse_object.angle == 0 ){

                    draw.#DRAW_ELLIPSE_SCANLINE(
                        ellipse_object.x , 
                        ellipse_object.y , 
                        ellipse_object.width , 
                        ellipse_object.height ,
                        ellipse_object.get_f1(),
                        ellipse_object.get_f2(),
                        ellipse_object.border , 
                        ellipse_object.border_color
                    );

                }
                // ellipse with no rotation
                else {

                    draw.#DRAW_ELLIPSE_WITH_ROTATION(
                        ellipse_object.x , 
                        ellipse_object.y , 
                        ellipse_object.width , 
                        ellipse_object.height ,
                        ellipse_object.angle ,
                        ellipse_object.get_f1(),
                        ellipse_object.get_f2(),
                        ellipse_object.border , 
                        ellipse_object.border_color
                    );

                }

            }

        }
        else{

            if(!f1) draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();

        }

    } 

    static plane( plane_2D_object = new plane2D() ){

        // check canvas and circle
        let f1 = draw.#CHECK_BUFFER();
        let f2 = (plane_2D_object instanceof plane2D);
    
        if( f1 && f2 ){ 
    
            if( plane_2D_object.fill_color instanceof RGBA ){
    
                
    
            }
    
        }
        else{
            if(!f1) draw.#LOG.ERROR.BUFFER.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }
    
    
    }
    
    
    /*

        famous drawing algorithms 

    */
    static algorithms = {


        // line algorithms 

        DDA_LINE_DRAW( line_object = new line() ){

            let f1 = draw.#CHECK_BUFFER();
            let f2 = ( line_object instanceof line );

            if( f1 && f2 ){
                draw.#DDA_LINE_DRAW_ALGORITHM( line_object );
            }
            else{
                if(!f1) draw.#LOG.ERROR.BUFFER.MISSING();
                if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
            }

        } ,

        GUPTA_SPROULL_LINE_DRAW( line_object = new line() ){

        } ,

        BRESENHAM_LINE_DRAW( line_object = new line() ){

        } ,
        

        // circle algorithms

        MID_POINT_CIRCLE_DRAW( circle_object = new circle2D() ){

            // check canvas and circle
            let f1 = ( draw.#RESOURCES.draw_to_canvas_direct ) ? draw.#CHECK_CANVAS() : draw.#CHECK_BUFFER();
            let f2 = (circle_object instanceof circle2D);

            if( f1 && f2 ){
                
                let copy = circle2D.copy( circle_object );

                if( copy.border_color instanceof RGBA || copy.fill_color instanceof RGBA ){

                    draw.#MID_POINT_CIRCLE_DRAW( Math.round(copy.x) , Math.round(copy.y) , Math.round(copy.r) , copy.border_color);

                }
            
            }
            else{
                if(!f1) draw.#LOG.ERROR.BUFFER.MISSING();
                if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
            }

        } ,


        // ellipse algorithms

        ELLIPSE_MID_POINT_ALGORITHM( ellipse_object = new ellipse2D() ){

        } ,

    }


}
