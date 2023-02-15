
import {point2D} from "../../point.js"
import {line , line_with_colors} from "../../line.js"
import {rectangle as RECT , rectangle_with_gradient as RECT_WITH_GRADIENT} from "../../rectangle.js";
import {RGBA} from "../../color.js";
import {triangle2D} from "../../triangle.js";

export class draw {

    /*
        ==============================================================
                    PRIVATE STUFF FOR CLASS DRAW 
        ==============================================================
    */

    static #ERRORS = {
        canvas : {
            missing : () => console.error(
                "no canvas defined yet to draw in , define canvas using SET_CANVAS !"
            ),
            invalid : () => console.error(
                "invalid canvas parameter !"
            ),
        },
        ctx : {
            missing : () => console.error(
                "no context defined yet to draw in , define canvas using SET_CANVAS !"
            ),
            invalid : () => console.error(
                "invalid context object !"
            ),
        },
        object : {
            invalid : () => console.error(
                "invalid object to render"
            ),
        }
    }


    static #canvas = undefined;
    static #ctx = undefined;
    static #anti_alise = false;

    static #CHECK_CANVAS(){
        return ( draw.#canvas != undefined && draw.#ctx  != undefined );
    }

    static #set_pixle( x , y , pixle_color = "white" ) {

        draw.#ctx.fillStyle = pixle_color;
        draw.#ctx.fillRect( x , y , 1 , 1 );

    }

    static #get_pixle( x , y , pixle_color = "cyan" ) {

    }

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
    static #DDA_ALGORITHM(
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
    static #GUPTA_SPROULL_ALGORITHM(){
    }

    // ****** need work ******
    static #BRESENHAM_ALGORITHM(){
    }

    static #FILL_RECT(
        X = 1 , Y = 1 , width = 1 , height = 1 , color = new RGBA()
    ){
        //debugger;

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
    
    static #FILL_TRIANGLE(){

    }

    /* need work */
    static #DRAW_HORIZONTAL_LINE( x = 1 , y1 = 1 , y2 = 1 , color = new RGBA() ){

        for( let y = y1 ; y <= y2 ; y += 1){

            this.#set_pixle( x , y , color);

        }

    }

    static #DRAW_TRIANGLE(
        p1 = new point2D() , p2 = new point2D() , thickness = 1 , color = new RGBA()
    ) {

        // calc delta of X & Y
        let delta_x = p2.x - p1.x;
        let delta_y = p2.y - p1.y;

        // steps will be the bigger delta 
        let x_or_y  = ( Math.abs(delta_x) > Math.abs(delta_y) );
        let steps   = ( Math.abs(delta_x) > Math.abs(delta_y) ) ? Math.abs(delta_x) : Math.abs(delta_y);
        
        // calc increment values for X & Y
        let inc_X = delta_x / steps;
        let inc_Y = delta_y / steps;

        let x = p1.x;
        let y = p1.y;

        let isodd = (thickness % 2) == 0;
        let half_width = Math.floor(thickness / 2);

        for(let i = 1; i <= steps ; i += 1){

            let sT = ( ( x_or_y ? y : x ) - half_width );
            let eT = ( ( x_or_y ? y : x ) + half_width - (isodd ? 1 : 0));

            if(x_or_y){

                do{
                    this.#set_pixle(Math.round(x) , Math.round(sT) , RGBA.to_string(color));
                    sT += 1;
                }
                while( sT <= eT );

            }
            else {

                do{
                    this.#set_pixle(Math.round(sT) , Math.round(y) , RGBA.to_string(color));
                    sT += 1;
                }
                while( sT <= eT );

            }

            // calc next position
            x += inc_X;
            y += inc_Y;
        }
    
    
    }

    /*
        ==============================================================
                        PUBLIC FUCNTIONS FOR DRAWING 
        ==============================================================
    */

    static set_canvas( canvas_object = undefined ){

        if( canvas_object && canvas_object.tagName == "CANVAS" ){

            draw.#canvas = canvas_object;
            draw.#ctx = draw.#canvas.getContext("2d");

        }
        else draw.#ERRORS.canvas.invalid();

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
            if(!f1) draw.#ERRORS.canvas.missing();
            if(!f2) draw.#ERRORS.object.invalid();
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
            if(!f1) draw.#ERRORS.canvas.missing();
            if(!f2) draw.#ERRORS.object.invalid();
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
            if(!f1) draw.#ERRORS.canvas.missing();
            if(!f2) draw.#ERRORS.object.invalid();
        }

    }

    static triangle( triangle_object = new triangle2D() ){

        // check canvas and triangle
        let f1 = draw.#CHECK_CANVAS();
        let f2 = (triangle_object instanceof triangle2D);
        
        if( f1 && f2 ){

            // copy triangle 
            let copy = triangle2D.copy(triangle_object);

            // sort points depend on Y-axis
            triangle2D.sort_by_y_axis(copy);

            draw.#DRAW_TRIANGLE( copy.a , copy.b , copy.thickness , copy.color );
            draw.#DRAW_TRIANGLE( copy.a , copy.c , copy.thickness , copy.color );
            draw.#DRAW_TRIANGLE( copy.b , copy.c , copy.thickness , copy.color );

        }
        else{
            if(!f1) draw.#ERRORS.canvas.missing();
            if(!f2) draw.#ERRORS.object.invalid();
        }

    }

    // object contain the famous drawing algorithms . 
    static algorithms = {

        DDA_LINE_DRAW( line_object = new line() ){

            let f1 = draw.#CHECK_CANVAS();
            let f2 = (line_object instanceof line );

            if( f1 && f2 ){
                draw.#DDA_ALGORITHM( line_object );
            }
            else{
                if(!f1) draw.#ERRORS.canvas.missing();
                if(!f2) draw.#ERRORS.object.invalid();
            }

        } ,

        GUPTA_SPROULL_LINE_DRAW( line_object = new line() ){

        } ,

        BRESENHAM_LINE_DRAW( line_object = new line() ){

        }
        
    }


}
