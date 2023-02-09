
import {point2D} from "../../point.js"
import {line , line_with_colors} from "../../line.js"
import { rectangle as RECT , rectangle_with_gradient as RECT_WITH_GRADIENT } from "../../rectangle.js";
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

    // standard line draw 
    static #CUSTOM_LINE_WITH_GRADIENT(
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

    // standard line draw 
    static #CUSTOM_LINE_NO_GRADIENT( 
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
    static #DDA_ALGORITHM(
        canvas , line_object = new line() , anti_alias = false
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
                    this.#set_pixle(canvas , Math.round(x) , Math.round(sT) , RGBA.to_string(line_object.color));
                    sT += 1;
                }
                while( sT <= eT );

            }
            else {

                do{
                    this.#set_pixle(canvas , Math.round(sT) , Math.round(y) , RGBA.to_string(line_object.color));
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
        canvas , x = 1 , y = 1 , width = 1 , height = 1 , color = new RGBA()
    ){
        let str_color = RGBA.to_string(color);
        
        for(let X = x ; X <= width ; X += 1){
            
            for(let Y = y ; Y <= height ; Y += 1){
                
                draw.#set_pixle( canvas , X , Y , str_color);
                
            }
            
        }

    }
    
    /*
        ==============================================================
                        PUBLIC FUCNTIONS FOR DRAWING 
        ==============================================================
    */

    static line( 
        canvas , line_object = new line() , anti_alias = false
    ) { 

        if( canvas && line_object instanceof line ){

            this.#CUSTOM_LINE_NO_GRADIENT(
                canvas , line_object.p1 , line_object.p2 , 
                line_object.width , line_object.color , anti_alias
            );

        } 

    }
    
    static line_with_gradient( 
        canvas , line_object = new line_with_colors() , anti_alias = false
    ) {

        if( 
            canvas && line_object instanceof line_with_colors
        ){

            this.#CUSTOM_LINE_WITH_GRADIENT(
                canvas , 
                line_object.p1 , line_object.p2 , line_object.width , 
                line_object.p1.color , line_object.p2.color , anti_alias
            );
    
        } 

    }

    static rectangle( canvas , rectangle_obejct = new RECT() ){

        // debugger
        if( canvas && rectangle_obejct instanceof RECT ){

            if( rectangle_obejct.fill ){

                // fill rectangle 
                draw.#FILL_RECT(
                    canvas,
                    rectangle_obejct.position.x , rectangle_obejct.position.y , 
                    rectangle_obejct.width , rectangle_obejct.height , rectangle_obejct.color
                );

            }

            // if rectangle want border around
            if( rectangle_obejct.border > 0){

                // fill border process

                // calc border values

            }

        }

    }

    // object contain the famous drawing algorithms . 
    static algorithms = {

        DDA_LINE_DRAW(
            canvas , line_object = new line() , anti_alias = false
        ){
            
            if( canvas && line_object instanceof line ){
    
                draw.#DDA_ALGORITHM(
                    canvas , line_object , anti_alias
                )
    
            }
    
        } ,

        GUPTA_SPROULL_LINE_DRAW(
            canvas , line_object = new line() , anti_alias = false
        ){

        } ,

        BRESENHAM_LINE_DRAW(
            canvas , line_object = new line() , anti_alias = false
        ){

        }
        
    }


}
