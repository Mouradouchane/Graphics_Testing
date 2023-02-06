
import {point2D} from "../../point.js"
import {line , line_with_colors } from "../../line.js"
import {RGBA} from "../../color.js";

export class draw {

    /*
        ==============================================================
                    PRIVATE FUCNTIONS FOR GENERAL PURPOSE
        ==============================================================
    */

    /* need work */
    static #set_pixle( canvas , x , y , pixle_color = "cyan" ) {
        let ctx = canvas.getContext("2d");

        ctx.fillStyle = pixle_color;
        ctx.fillRect( x , y , 1 , 1 );
    }

    /* need work */
    static #get_pixle( canvas , x , y , pixle_color = "cyan" ) {

    }

    // ****** stable ******
    // mine algorithm for drawing lines with gradient
    static #C_DRAW_LINE_WITH_GRADIENT(
        canvas , 
        point_a = new point2D() , point_b = new point2D() , width = 1 ,
        color_a = new RGBA()  , color_b = new RGBA()  ,
        anti_alias = false
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
            do{

                if(x_or_y)
                    this.#set_pixle( canvas , position , start , RGBA.to_string(color) );
                else
                    this.#set_pixle( canvas , start , position , RGBA.to_string(color) );

                start += 1;
            }
            while(start < end);

            // update gradient color
            color.red   += delta_red;
            color.green += delta_green;
            color.blue  += delta_blue;
            color.alpha += delta_alpha;

        }
            
    } 

    // ****** stable ******
    // mine algorithm for drawing lines without gradient
    static #C_DRAW_LINE_NO_GRADIENT( 
        canvas , point_a = new point2D() , point_b = new point2D() , 
        width = 1 , color = new RGBA() , anti_alias = false
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
            do{

                if(x_or_y)
                    this.#set_pixle( canvas , position , start , RGBA.to_string(color) );
                else
                    this.#set_pixle( canvas , start , position , RGBA.to_string(color) );

                start += 1;
            }
            while(start < end);

        }
            

    }

    // ****** need work ******
    static #DDA_LINE_DRAW_NO_GRADIENT(){
    }

    // ****** need work ******
    static #GUPTA_SPROULL_LINE_DRAW(){
    }

    // ****** need work ******
    static #BRESENHAM_LINE_DRAW(){
    }

    /*
        ==============================================================
                           PUBLIC FUCNTIONS TO USE 
        ==============================================================
    */

    // ****** stable ******
    static line( 
        canvas , line_object = new line() , anti_alias = false
    ) { 

        if(
            canvas && line_object instanceof line 
        ){

            this.#C_DRAW_LINE_NO_GRADIENT(
                canvas , line_object.p1 , line_object.p2 , 
                line_object.width , line_object.color , anti_alias
            );

        } 

    }
    
    // ****** stable ******
    static line_with_gradient( 
        canvas , line_object = new line_with_colors() , anti_alias = false
    ) {

        if( 
            canvas && line_object instanceof line_with_colors
        ){

            this.#C_DRAW_LINE_WITH_GRADIENT(
                canvas , 
                line_object.p1 , line_object.p2 , line_object.width , 
                line_object.p1.color , line_object.p2.color , anti_alias
            );
    
        } 

    }


}
