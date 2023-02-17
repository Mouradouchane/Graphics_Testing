import {RGBA} from "./color.js";
import {point2D , point2D_with_color} from "./point.js";
import {line , line_with_colors } from "./line.js";
import {rectangle , rectangle_with_gradient} from "./rectangle.js";
import {triangle2D} from "./triangle.js";
import {circle2D} from "./circle.js";

export class generate {
   
    static random = {

        lines( max_width = 1, max_height = 1, amount = 1 , thickness = 1 , gradient = false ){

            amount = Math.abs( amount );
            var arr = [];

            if(gradient){

                for( let i = 0 ; i < amount ; i += 1)
                    arr[i] = line_with_colors.random_line(max_width , max_height , thickness);
            
            }
            else{

                for( let i = 0 ; i < amount ; i += 1)
                    arr[i] = line.random_line(max_width , max_height , thickness);
            
            }

            return arr;

        },

        rectangles( max_width = 1 , max_height = 1 , amount = 1 , color = undefined ){

            amount = Math.abs( amount );
            var arr = [];
            
            for( let i = 0 ; i < amount ; i += 1)
                arr[i] = rectangle.random_rectangle(max_width , max_height , color);
        
            
            return arr;
            
        },

        triangles(
            max_width = 1 , max_height = 1 , amount = 1 , thickness = 1 , color = true , border_color = false
        ){

            amount = Math.abs(amount);
            var arr = [];

            for( let i = 0 ; i < amount ; i += 1 ){
                arr[i] = triangle2D.random_triangle(max_width , max_height , thickness , color , border_color);
            }

            return arr;
            
        },

        cicrles( 
            max_width = 1 , max_height = 1 , amount = 1 , thickness = 1 , color = false , border_color = true 
        ){

            amount = Math.abs(amount);
            var arr = [];

            for( let i = 0 ; i < amount ; i += 1 ){
                arr[i] = circle2D.random_circle( max_width , max_height , thickness , color , border_color );
            }

            return arr;

        }

    }

}