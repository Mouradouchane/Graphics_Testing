
import {point} from "../../point.js"
import {line} from "../../line.js"
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

    /* need work */
    static #blend_colors( color_1 = "cyan" , color_2 = "cyan" ) {

    }

    /* need work */
    static #is_point_out(canvas , point_x = 1 , point_y = 1 ){
   
    }
    
    /* 
        - need work 
        - if tow points is out in same direction then the line will be rejected 
    */
    static #is_rejected_line(canvas , point_a_x , point_a_y  , point_b_x , point_b_y ){

    }

    /* 
        - need work
        - main function who draw lines   
    */
    static #line_drawing( 
        canvas , point_a_x = 1 , point_a_y = 1 , point_b_x = 1 , point_b_y = 1 , 
        width = 1 , color_a = new RGBA() ,  color_b = null , anti_alias = false
    ) {

        let delta_x = (point_b_x - point_a_x); 
        let delta_y = (point_b_y - point_a_y); 

        width = Math.abs(width);
        let width_mod = Math.floor(width) % 2;
        width = Math.floor( width / 2 );


        if( delta_x == 0 ){ // if vertical line

            // calc thickness range 
            let start = Math.abs(point_a_x - width - width_mod);
            let end   = Math.abs(point_a_x + width);
            
            // draw vertical line process 

            // if none linear-gradient 
            if( color_b == null || color_b == color_a ){
                
                for(let y = point_a_y ; y <= point_b_y ; y += 1){

                    let s = start;
                    // fill line thickness
                    do{
                        this.#set_pixle( canvas , s , y , RGBA.to_string(color_a) );
                        s += 1;
                    }
                    while( s < end );
                }

            }
            else {

                let delta_red = (color_a.red - color_b.red) / delta_y ;
                let delta_green = (color_a.green  - color_b.green) / delta_y ;
                let delta_blue =(color_a.blue - color_b.blue) / delta_y ;
                let delta_alpha = (color_a.alpha - color_b.alpha) / delta_y;

                let color = new RGBA(color_a.red , color_a.green , color_a.blue , color_a.alpha);

                for(let y = point_a_y ; y <= point_b_y ; y += 1){

                    let s = start;

                    // fill line thickness
                    do{
                        this.#set_pixle( canvas , s , y , RGBA.to_string(color) );
                        s += 1;
                    }
                    while( s < end );

                    color.red -= delta_red;
                    color.green -= delta_green;
                    color.blue -= delta_blue;
                    color.alpha -= delta_alpha;
                }

            }

            return true;
        }

        if( delta_y == 0 ){ // if horizontal line

            // calc thickness range 
            let start = Math.abs(point_a_y - width - width_mod);
            let end   = Math.abs(point_a_y + width);
            
            // draw horizontal line process 

            if( color_b == null || color_b == color_a ){

                for(let x = point_a_x ; x <= point_b_x ; x += 1){

                    // fill line thickness
                    let s = start;
                    do{
                        this.#set_pixle( canvas , x , s , RGBA.to_string(color_a) );
                        s += 1;
                    }
                    while( s < end );

                }

            }
            else {
                // debugger

                let delta_red = (color_a.red - color_b.red) / delta_x ;
                let delta_green = (color_a.green  - color_b.green) / delta_x ;
                let delta_blue = (color_a.blue - color_b.blue) / delta_x ;
                let delta_alpha = (color_a.alpha - color_b.alpha) / delta_x;

                let color = new RGBA(color_a.red , color_a.green , color_a.blue , color_a.alpha);

                for(let x = point_a_x ; x <= point_b_x ; x += 1){

                    // fill line thickness
                    let s = start;
                    do{
                        this.#set_pixle( canvas , x , s , RGBA.to_string(color) );
                        s += 1;
                    }
                    while( s < end );

                    color.red -= delta_red;
                    color.green -= delta_green;
                    color.blue -= delta_blue;
                    color.alpha -= delta_alpha;
                }

            }

            return true;
        }
        

        let slope = delta_y / delta_x; // M
        let Y_intercept = point_a_y - ( slope * point_a_x ); // B

        let new_x = 0;
        let new_y = 0;

        debugger
        
        // delta_x bigger => go in each x and solve for y  
        if( Math.abs(delta_x) >= Math.abs(delta_y) ){
            
            if( point_a_x > point_b_x ){
                [point_a_x , point_b_x] = [point_b_x , point_a_x];
                [point_a_y , point_b_y] = [point_b_y , point_a_y];
            }

            if( color_b == null ) color_b = color_a;
        
            let delta_red   = (color_a.red   - color_b.red)   / delta_x ;
            let delta_green = (color_a.green - color_b.green) / delta_x ;
            let delta_blue  = (color_a.blue  - color_b.blue)  / delta_x ;
            let delta_alpha = (color_a.alpha - color_b.alpha) / delta_x ;
            
            let color = new RGBA(color_a.red , color_a.green , color_a.blue , color_a.alpha);
            
            for( let x = point_a_x ; x <= point_b_x ; x += 1){

                // calc new y position
                new_y = (x * slope) + Y_intercept;

                // calc line thickness range 
                let start = Math.abs(new_y - width - width_mod);
                let end   = Math.abs(new_y + width);
                
                // fill line thickness 
                do{
                    this.#set_pixle( canvas , x , start , RGBA.to_string(color) );
                    start += 1;
                }
                while(start < end);

                color.red -= delta_red;
                color.green -= delta_green;
                color.blue -= delta_blue;
                color.alpha -= delta_alpha;

            }
            
        }
        // delta_y bigger => go in each y and solve for x  
        else {

            if( point_a_y > point_b_y ){
                [point_a_x , point_b_x] = [point_b_x , point_a_x];
                [point_a_y , point_b_y] = [point_b_y , point_a_y];
            }

            debugger;

            if( color_b == null ) color_b = color_a;
        
            let delta_red   = (color_a.red   - color_b.red)   / delta_y ;
            let delta_green = (color_a.green - color_b.green) / delta_y ;
            let delta_blue  = (color_a.blue  - color_b.blue)  / delta_y ;
            let delta_alpha = (color_a.alpha - color_b.alpha) / delta_y ;
            
            let color = new RGBA(color_a.red , color_a.green , color_a.blue , color_a.alpha);
            
            for(let y = point_a_y ; y <= point_b_y ; y += 1){

                // calc new x position
                new_x = (y - Y_intercept) / slope;
                
                // calc line thickness range 
                let start = Math.abs(new_x - width - width_mod);
                let end   = Math.abs(new_x + width);
                
                // fill line thickness 
                do{
                    this.#set_pixle( canvas , start , y , RGBA.to_string(color) );
                    start += 1;
                }     
                while(start < end);

                color.red -= delta_red;
                color.green -= delta_green;
                color.blue -= delta_blue;
                color.alpha -= delta_alpha;

            }

        }

        return true;

    }


    /*
        ==============================================================
                           PUBLIC FUCNTIONS TO USE 
        ==============================================================
    */

    /* need work */
    static line( 
        canvas , point_a = {} , point_b = {} , width = 1 ,
        rgb_color = new RGBA() , anti_alias = false
    ) { 

        if(canvas && rgb_color instanceof RGBA ) {

            return this.#line_drawing(
                canvas , point_a.x , point_a.y  , point_b.x , point_b.y , 
                width , rgb_color , null , 1 , 1 , anti_alias
            );

        } 
        else return false;
    }

    /* need work */
    static line_with_linear_gradient( 
        canvas , point_a = {} , point_b = {} , width = 1 ,
        color_1 = {} , color_2 = {} , anti_alias = false
    ) {

        if(canvas && color_1 instanceof RGBA && color_2 instanceof RGBA) {

            return this.#line_drawing(
                canvas , point_a.x , point_a.y  , point_b.x , point_b.y , 
                width , color_1 , color_2 , anti_alias
            );

        } 
        else return false;

    }

    /* need work */
    static line_object(
        canvas , line_object = {} , rgb_a_color = {} , anti_alias = false
    ) { 

    }

}
