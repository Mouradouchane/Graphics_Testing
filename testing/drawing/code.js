
import {point2D} from "../../point.js"
import {line , line_with_colors} from "../../line.js"
import {rectangle as RECT , rectangle_with_gradient as RECT_WITH_GRADIENT} from "../../rectangle.js";
import {RGBA} from "../../color.js";
import {triangle2D} from "../../triangle.js";
import {circle2D} from "../../circle.js";
import {ellpise2D} from "../../ellipse.js";
import {buffer} from "../../buffers.js";


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

    // object for needed "stuff,options,..." for drawing 
    static #NEEDED = {

        buffer : undefined,
        canvas : undefined,
        ctx : undefined,
        anti_alising : false,
        copy_object_for_drawing : false,

    }

    static #CHECK_CANVAS(){
        return ( draw.#NEEDED.canvas != undefined && draw.#NEEDED.ctx  != undefined );
    }

    static #set_pixle( x , y , pixle_color = "white" ) {

        draw.#NEEDED.ctx.fillStyle = pixle_color;
        draw.#NEEDED.ctx.fillRect( x , y , 1 , 1 );

    }

    // we need this for our color blending 
    static #canvas_get_pixle( x , y ) {

    }
    static #buffer_get_pixle( x , y ) {

    }
    static #buffer_get_sample( x , y ) {

    }

    // =========================================================================
    //                          LINE DRAW FUNCTIONS
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
                    this.#set_pixle( position , start , RGBA.to_string(color) );
                    start += 1;
                }
                while(start < end);

            }
            else {

                do{
                    this.#set_pixle( start , position , RGBA.to_string(color) );
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
                    this.#set_pixle( position , start , RGBA.to_string(color) );
                    start += 1;
                }
                while(start < end);

            }
            else {

                do{
                    this.#set_pixle( start , position , RGBA.to_string(color) );
                    start += 1;
                }
                while(start < end);

            }

        }
            

    }

    // ****** need work ******
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
                    this.#set_pixle(Math.round(x) , Math.round(sT) , RGBA.to_string(line_object.color));
                    sT += 1;
                }
                while( sT <= eT );

            }
            else {

                do{
                    this.#set_pixle(Math.round(sT) , Math.round(y) , RGBA.to_string(line_object.color));
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
    static #DRAW_HORIZONTAL_LINE( x1 = 1 , x2 = 1 , y = 1 , str_color = "white" ){

        if( x1 > x2 ) [x1 , x2] = [x2 , x1];

        for( let x = x1 ; x <= x2 ; x += 1 ){

            this.#set_pixle( x , y , str_color );

        }

    }
    
    // fast and direct function for filling shapes line by line verticaly  
    static #DRAW_VERTICAL_LINE( x = 1 , y1 = 1 , y2 = 1 , str_color = "white" ){

        if( y1 > y2 ) [y1 , y2] = [y2 , y1];

        for( let y = y1 ; y <= y2 ; y += 1 ){

            this.#set_pixle( x , y , str_color );

        }

    }
    

    // =========================================================================
    //                      RECTANGLE PRIVATE FUNCTIONS
    // =========================================================================

    static #FILL_RECT(
        X = 1 , Y = 1 , width = 1 , height = 1 , color = new RGBA()
    ){
        // debugger;

        let str_color = RGBA.to_string(color);
        let w = X + width;
        let h = Y + height;

        for(let x = X ; x <= w ; x += 1){
            
            for(let y = Y ; y <= h ; y += 1){
                
                draw.#set_pixle( x , y , str_color );
                
            }
            
        }

    }

    static #DRAW_RECT_BORDER(
        X = 1 , Y = 1 , W = 1 , H = 1 , B = 1 , color = new RGBA()
    ){
        
        let str_color = RGBA.to_string(color);

        let ranges = [
            { x : (X - B) , y : (Y - B) , w : (X + W + B) , h : Y               },
            { x : (X - B) , y : (Y + H) , w : (X + W + B) , h : ( Y + H + B )   },
            { x : (X - B) , y :  Y      , w :  X          , h : (Y + H)         },
            { x : (X + W) , y :  Y      , w : (X + W + B) , h : (Y + H)         },
        ];

        for(let range of ranges){

            for(let x = range.x; x < range.w ; x += 1)
                for(let y = range.y; y < range.h; y += 1)
                    draw.#set_pixle( x , y , str_color);
            
        }

    }


    // =========================================================================
    //                      TRIANGLE PRIVATE FUNCTIONS
    // =========================================================================


    static #FILL_TRIANGLE( copy = new triangle2D() ){

        // calc needed values
                
        // A-B
        let D_AB_X = (copy.a.x - copy.b.x);
        let D_AB_Y = (copy.a.y - copy.b.y);
        let slope_AB = D_AB_X != 0 ? ( D_AB_Y / D_AB_X ) : 0;
        let intercept_AB = copy.a.y - (slope_AB * copy.a.x);

        // A-C
        let D_AC_X = (copy.a.x - copy.c.x);
        let D_AC_Y = (copy.a.y - copy.c.y);
        let slope_AC = D_AC_X != 0 ? ( D_AC_Y / D_AC_X ) : 0;
        let intercept_AC = copy.a.y - (slope_AC * copy.a.x);

        let x_start = 0;
        let x_end = 0;
        let y = copy.a.y;

        // fill from A to B
        for( ; y <= copy.b.y ; y += 1 ){

            // find X's
            x_start = Math.round( (y - intercept_AC) / slope_AC );
            x_end   = Math.round( (y - intercept_AB) / slope_AB );
            
            // fill range
            draw.#DRAW_HORIZONTAL_LINE( x_start , x_end , y , RGBA.to_string(copy.fill_color) );

        }

        // B-C
        let D_BC_X = (copy.b.x - copy.c.x);
        let D_BC_Y = (copy.b.y - copy.c.y);
        let slope_BC = D_BC_X != 0 ? ( D_BC_Y / D_BC_X ) : 0;
        let intercept_BC = copy.b.y - (slope_BC * copy.b.x);
        
        y = copy.b.y;

        // fill from B to C
        for( ; y <= copy.c.y ; y += 1 ){

            x_start = Math.round( (y - intercept_AC) / slope_AC );
            x_end   = Math.round( (y - intercept_BC) / slope_BC );

            draw.#DRAW_HORIZONTAL_LINE( x_start , x_end , y , RGBA.to_string(copy.fill_color) );

        }

    }

    static #DRAW_TRIANGLE(
        p1 = new point2D() , p2 = new point2D() , thickness = 1 , color = new RGBA()
    ) {

        let delta_x = p2.x - p1.x;
        let delta_y = p2.y - p1.y;

        let x_or_y  = ( Math.abs(delta_x) > Math.abs(delta_y) );
        let steps   = ( Math.abs(delta_x) > Math.abs(delta_y) ) ? Math.abs(delta_x) : Math.abs(delta_y);
        
        let inc_X = delta_x / steps;
        let inc_Y = delta_y / steps;

        let x = p1.x;
        let y = p1.y;

        let isodd = (thickness % 2) == 0;
        let half_width = Math.floor(thickness / 2);

        for(let i = 1; i <= steps ; i += 1){

            let sT = ( ( x_or_y ? y : x ) - half_width );
            let eT = ( ( x_or_y ? y : x ) + half_width - (isodd ? 1 : 0));
            let str_color = RGBA.to_string(color);

            if(x_or_y){

                do{
                    this.#set_pixle(Math.round(x) , Math.round(sT) , str_color);
                    sT += 1;
                }
                while( sT <= eT );

            }
            else {

                do{
                    this.#set_pixle(Math.round(sT) , Math.round(y) , str_color);
                    sT += 1;
                }
                while( sT <= eT );

            }

            x += inc_X;
            y += inc_Y;
        }
    
    
    }

    // =========================================================================
    //                         CIRCLE PRIVATE FUNCTIONS
    // =========================================================================

    static #DRAW_ALL_QUADS(
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

    static #FILL_ALL_QUADS(
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
        x_org = 1 , y_org = 1 , r = 1 , str_border_color = undefined
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
            if( str_border_color ) 
                draw.#DRAW_ALL_QUADS( X , Y , x_org , y_org , str_border_color );
            
        }
        while( Y > X );

    }

    // draw circle using soultion of mix bettween "mid-point" and "scan-line" 
    static #DRAW_CIRCLE(
        x_org = 1 , y_org = 1 , r = 1 , thickness = 1 , fill_color = undefined , border_color = undefined
    ){

        // convert colors to strings
        let str_fill_color   = (fill_color   instanceof RGBA) ? RGBA.to_string( fill_color )   : undefined ;
        let str_border_color = (border_color instanceof RGBA) ? RGBA.to_string( border_color ) : undefined ;
        
        // in case "draw cicle border" wanted
        if( str_border_color ){

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
                        draw.#DRAW_HORIZONTAL_LINE( x_org + x , x_org - x , y_org + y , str_border_color);
                        draw.#DRAW_HORIZONTAL_LINE( x_org + x , x_org - x , y_org - y , str_border_color);
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
                    x_org + start , x_org + end -1, y_org + ty , str_border_color
                );
                
                draw.#DRAW_HORIZONTAL_LINE( 
                    x_org - start , x_org - end +1, y_org + ty , str_border_color
                );
                
                // reset for next step
                find_start = true;
                start = 0;
                end = 0;

            }
        
        }

        // in case "fill circle" wanted
        if( str_fill_color ) draw.#FILL_ALL_QUADS( x_org , y_org , r , str_fill_color );

    }
    

    // =========================================================================
    //                         ELLPISE PRIVATE FUNCTIONS
    // =========================================================================


    static #FILL_ELLIPSE_QUADS_X(){

    }
    static #FILL_ELLIPSE_QUADS_Y(){

    }

    static #DRAW_ELLIPSE_DDA(){

    }

    static #DRAW_ELLIPSE_MID_POINT(){

    }

    static #DRAW_ELLIPSE_SCANLINE(
        x_org = 1 , y_org = 1 , A = 1 , B = 1 , fill_color_str = undefined , border_color_str = undefined
    ){

        let A_sqr = A*A;
        let B_sqr = B*B;

        if( A > B ){

            for(let x = A ; x >= 0 ; x-- ){

                let x_sqr = x*x;

                for(let y = B; y >= 0 ; y-- ){

                    if( (x_sqr / A_sqr) + ( (y*y) / B_sqr) <= 1 ){

                        draw.#set_pixle( x_org + x , y_org + y , border_color_str );
                        draw.#set_pixle( x_org - x , y_org + y , border_color_str );
                        draw.#set_pixle( x_org + x , y_org - y , border_color_str );
                        draw.#set_pixle( x_org - x , y_org - y , border_color_str );

                        break;
                    }
                }

            }

        }
        else {



        }

    }



    /*
        ==============================================================
                PUBLIC FUCNTIONS AS INTERFACE FOR DRAWING API 
        ==============================================================
    */

    static set_canvas( canvas_object = undefined ){

        if( canvas_object && canvas_object.tagName == "CANVAS" ){

            draw.#NEEDED.canvas = canvas_object;
            draw.#NEEDED.ctx = draw.#NEEDED.canvas.getContext("2d");

        }
        else draw.#LOG.ERROR.CANVAS.INVALID();

    }

    /* need work */
    static set_buffer( buffer_object = new buffer() ){

    }

    static line( 
        line_object = new line()
    ) { 

        let f1 = draw.#CHECK_CANVAS();
        let f2 = (line_object instanceof line);

        if( f1 && f2 ){

            this.#CUSTOM_LINE_NO_GRADIENT(
                line_object.p1 , line_object.p2 , 
                line_object.width , line_object.color , line_object.anti_alias
            );

        } 
        else {
            if(!f1) draw.#LOG.ERROR.CANVAS.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }
    
    static line_with_gradient( 
        line_object = new line_with_colors()
    ) {

        let f1 = draw.#CHECK_CANVAS();
        let f2 = (line_object instanceof line_with_colors);

        if( f1 && f2 ){

            this.#CUSTOM_LINE_WITH_GRADIENT(
                line_object.p1 , line_object.p2 , line_object.width , 
                line_object.p1.color , line_object.p2.color , line_object.anti_alias
            );
    
        } 
        else {
            if(!f1) draw.#LOG.ERROR.CANVAS.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static rectangle( rectangle_obejct = new RECT() ){

        let f1 = draw.#CHECK_CANVAS();
        let f2 = (rectangle_obejct instanceof RECT);

        // debugger
        if( f1 && f2 ){

            if( rectangle_obejct.fill ){

                // fill rectangle 
                draw.#FILL_RECT(
                    rectangle_obejct.position.x , rectangle_obejct.position.y , 
                    rectangle_obejct.width , rectangle_obejct.height , rectangle_obejct.color
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
            if(!f1) draw.#LOG.ERROR.CANVAS.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static triangle( triangle_object = new triangle2D() ){

        // check canvas and triangle
        let f1 = draw.#CHECK_CANVAS();
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
                draw.#DRAW_TRIANGLE( copy.a , copy.b , copy.thickness , copy.border_color );
                draw.#DRAW_TRIANGLE( copy.a , copy.c , copy.thickness , copy.border_color );
                draw.#DRAW_TRIANGLE( copy.b , copy.c , copy.thickness , copy.border_color );

            }

        }
        else{
            if(!f1) draw.#LOG.ERROR.CANVAS.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static circle( circle_object = new circle2D() ){

        // check canvas and circle
        let f1 = draw.#CHECK_CANVAS();
        let f2 = (circle_object instanceof circle2D);

        if( f1 && f2 ){
            
            let copy = circle2D.copy( circle_object );

            if( copy.border_color instanceof RGBA || copy.fill_color instanceof RGBA ){

                draw.#DRAW_CIRCLE( Math.round(copy.x) , Math.round(copy.y) , Math.round(copy.r) , Math.round(copy.border) , copy.fill_color , copy.border_color);

            }
        
        }
        else{
            if(!f1) draw.#LOG.ERROR.CANVAS.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    }

    static ellipse( ellipse_object = new ellpise2D() ){

        // check canvas and circle
        let f1 = draw.#CHECK_CANVAS();
        let f2 = (ellipse_object instanceof ellpise2D);

        if( f1 && f2 ){
        
            draw.#DRAW_ELLIPSE_SCANLINE( 
                ellipse_object.x , 
                ellipse_object.y , 
                ellipse_object.width , 
                ellipse_object.height , 
                RGBA.to_string(ellipse_object.fill_color) , 
                RGBA.to_string(ellipse_object.border_color) , 
            );

        }
        else{
            if(!f1) draw.#LOG.ERROR.CANVAS.MISSING();
            if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
        }

    } 


    // object contain the famous drawing algorithms . 
    static algorithms = {


        // line algorithms 

        DDA_LINE_DRAW( line_object = new line() ){

            let f1 = draw.#CHECK_CANVAS();
            let f2 = ( line_object instanceof line );

            if( f1 && f2 ){
                draw.#DDA_LINE_DRAW_ALGORITHM( line_object );
            }
            else{
                if(!f1) draw.#LOG.ERROR.CANVAS.MISSING();
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
            let f1 = draw.#CHECK_CANVAS();
            let f2 = (circle_object instanceof circle2D);

            if( f1 && f2 ){
                
                let copy = circle2D.copy( circle_object );

                if( copy.border_color instanceof RGBA || copy.fill_color instanceof RGBA ){

                    draw.#MID_POINT_CIRCLE_DRAW( Math.round(copy.x) , Math.round(copy.y) , Math.round(copy.r) , RGBA.to_string(copy.border_color) );

                }
            
            }
            else{
                if(!f1) draw.#LOG.ERROR.CANVAS.MISSING();
                if(!f2) draw.#LOG.ERROR.OBJECT.INVALID();
            }

        } ,


        // ellipse algorithms

        ELLIPSE_MID_POINT_ALGORITHM( ellipse_object = new ellpise2D() ){

        } ,

    }


}
