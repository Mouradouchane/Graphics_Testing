
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

        console.warn( "i see you :) ");
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
