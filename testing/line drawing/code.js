
import {point} from "../../point.js"
import {line} from "../../line.js"
import {rgb} from "../../color.js";

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
        width = 1 , color_a = "cyan" ,  color_b = "cyan" , alpha_a = 1 , alpha_b = 1 , anti_alias = false
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
            
            // draw vertical line
            for(let y = point_a_y ; y <= point_b_y ; y += 1){

                let s = start;
                // fill line thickness
                do{
                    this.#set_pixle( canvas , s , y , color_a );
                    s += 1;
                }
                while( s < end );
            }

            return true;
        }

        if( delta_y == 0 ){ // if horizontal line

            // calc thickness range 
            let start = Math.abs(point_a_y - width - width_mod);
            let end   = Math.abs(point_a_y + width);
            
            // draw horizontal line
            for(let x = point_a_x ; x <= point_b_x ; x += 1){

                // fill line thickness
                let s = start;
                do{
                    this.#set_pixle( canvas , x , s , color_a );
                    s += 1;
                }
                while( s < end );
            }

            return true;
        }
        

        let slope = delta_y / delta_x; // M
        let Y_intercept = point_a_y - ( slope * point_a_x ); // B

        let new_x = 0;
        let new_y = 0;


        // delta_x bigger => go in each x and solve for y  
        if( Math.abs(delta_x) >= Math.abs(delta_y) ){
            
            if( point_a_x > point_b_x ){
                [point_a_x , point_b_x] = [point_b_x , point_a_x];
                [point_a_y , point_b_y] = [point_b_y , point_a_y];
            }
    

            for( let x = point_a_x ; x <= point_b_x ; x += 1){

                // calc new y position
                new_y = (x * slope) + Y_intercept;
    
                // calc line thickness range 
                let start = Math.abs(new_y - width - width_mod);
                let end   = Math.abs(new_y + width);
                
                // fill line thickness 
                do{
                    this.#set_pixle( canvas , x , start , color_a );
                    start += 1;
                }
                while(start < end);
            }
            
        }
        // delta_y bigger => go in each y and solve for x  
        else {

            if( point_a_y > point_b_y ){
                [point_a_x , point_b_x] = [point_b_x , point_a_x];
                [point_a_y , point_b_y] = [point_b_y , point_a_y];
            }

            //debugger;

            for(let y = point_a_y ; y <= point_b_y ; y += 1){

                // calc new x position
                new_x = (y - Y_intercept) / slope;
                
                // calc line thickness range 
                let start = Math.abs(new_x - width - width_mod);
                let end   = Math.abs(new_x + width);
                
                // fill line thickness 
                do{
                    this.#set_pixle( canvas , start , y , color_a );
                    start += 1;
                }     
                while(start < end);

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
    static line_from_a_to_b( 
        canvas , point_a = {} , point_b = {} , width = 1 ,
        rgb_color = {} , anti_alias = false
    ) { 

        if(canvas) {

            return this.#line_drawing(
                canvas , point_a.x , point_a.y  , point_b.x , point_b.y , 
                width , rgb_color.to_string()
            );

        } 
        else return false;
    }

    /* need work */
    static line_from_a_to_b_with_gradient( 
        canvas , point_a = {} , point_b = {} , width = 1 ,
        rgb_color_1 = {} , rgb_color_2 = {} , anti_alias = false
    ) {

    }

    /* need work */
    static line_object(
        canvas , line_object = {} , rgb_a_color = {} , anti_alias = false
    ) { 

    }

    /* need work */
    static line_from_xy1_to_xy2 (
        canvas , x1 = 1 , y1 = 1 , x2 = 1 , y2 = 1 , 
        rgb_color = "cyan" , alpha = 1 , anti_alias = false
    ) { 

    }

    /* need work */ 
    static line_from_xy1_to_xy2_with_gradient( 
        canvas , x1 = 1 , y1 = 1 , x2 = 1 , y2 = 1 , 
        color_a = "cyan" , color_b = "cyan" , alpha = 1 , anti_alias = false
    ) {

    }


}
