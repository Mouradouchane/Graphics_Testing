import {RGBA} from "./color.js";
import {point2D , point2D_with_color} from "./point.js";
import {line , line_with_colors } from "./line.js";
import {rectangle , rectangle_with_gradient} from "./rectangle.js";
import {triangle2D} from "./triangle.js";
import {circle2D} from "./circle.js";
import {plane2D} from "./plane.js";

export class generate {
   
    static #default = {

        thickness : 4,

        min_width : 1,
        max_width : 800,

        min_height : 1,
        max_height : 600,
        
    } 


    // the main function who generate all the shapes 
    static #main_generator(

        SHAPES_TYPE = undefined ,

        min_X = undefined , max_X = undefined , 
        min_Y = undefined , max_Y = undefined , 

        amount_of_shapes = 1 , thickness = undefined , 

        fill_color = undefined , border_color = undefined ,
        fill_color_alpha = undefined , border_color_alpha = undefined ,



    ){

        // check ranges before generate the point

        min_X = (min_X == undefined) ? generate.#default.min_width : min_X;
        max_X = (max_X == undefined) ? generate.#default.max_width : max_X;
        
        min_Y = (min_Y == undefined) ? generate.#default.min_height : min_Y;
        max_Y = (max_Y == undefined) ? generate.#default.max_height : max_Y;


        // generate shapes 

        var shapes = [];

        for( let i = 0 ; i < amount_of_shapes ; i += 1){

            if ( SHAPES_TYPE === RGBA ){

            } 

            if( SHAPES_TYPE === point2D ){

                shapes[i] = new point2D(
                    (Math.random() * max_X) + min_X , 
                    (Math.random() * max_Y) + min_Y 
                );
                continue;

            }
            
            if( SHAPES_TYPE === line ){
                
                shapes[i] = new line(
                    generate.random.point2D( min_X , max_X , min_Y , max_Y ) ,
                    generate.random.point2D( min_X , max_X , min_Y , max_Y ) ,
                    ( thickness == undefined ) ? generate.#default.thickness : thickness,
                    ( color == undefined || !(color instanceof RGBA) ) ? generate.random.color(random_alpha) : color
                );
                continue;

            }


        }

        return shapes;

    }

    static random = {

        color( random_alpha = undefined ){

            return new RGBA(
                Math.floor( Math.random() * 255 ) , 
                Math.floor( Math.random() * 255 ) ,
                Math.floor( Math.random() * 255 ) ,
                ( random_alpha == undefined || random_alpha > 1 || random_alpha < 0 ) ? Math.random() : random_alpha
            );

        },

        point2D(  
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined , amount_of_shapes = 1 
        ){

            return generate.#main_generator( point2D , min_X , max_X , min_Y , max_Y , amount_of_shapes );

        },

        lines( 
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            amount_of_shapes = 1 , thickness = undefined , 
            color = undefined , random_alpha = false
        ){

            return generate.#main_generator( 
                line , min_X  , max_X , min_Y , max_Y ,
                amount_of_shapes , thickness , color , random_alpha 
            );

        },

        rectangles( 
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            amount_of_shapes = 1 , color = undefined 
        ){

            amount_of_shapes = Math.abs( amount_of_shapes );
            var shapes = [];
            
            for( let i = 0 ; i < amount_of_shapes ; i += 1 ){
                
                shapes[i] = rectangle.random_rectangle(max_X , max_Y , color);

            }
        
            return shapes;

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
            max_width = 1 , max_height = 1 , amount = 1 , thickness = 1 , fill_color = true , border_color = true 
        ){

            amount = Math.abs(amount);
            var arr = [];
            
            for( let i = 0 ; i < amount ; i += 1 ){
                arr[i] = circle2D.random_circle( max_width , max_height , thickness , fill_color , border_color );
            }

            return arr;

        },

        planes(
            max_width = 1 , max_height = 1 , amount_of_shapes = 1 , thickness = undefined , 
            fill_color = true , border_color = true , 
            fill_color_random_alpha = false , border_color_random_alpha = false
        ){

            amount_of_shapes = Math.abs(amount_of_shapes);
            var shapes = [];

            for( let i = 0 ; i < amount_of_shapes ; i += 1 ){

                shapes[i] = new plane2D( 

                    point2D.random_point( max_width , max_height ) , 
                    point2D.random_point( max_width , max_height ) , 
                    point2D.random_point( max_width , max_height ) , 
                    point2D.random_point( max_width , max_height ) ,

                    (fill_color) ? RGBA.random_color(fill_color_random_alpha) : undefined ,
                    (border_color) ? RGBA.random_color(border_color_random_alpha) : undefined , 

                    (thickness == undefined) ? Math.ceil( (Math.random() * generate.#default.thickness ) + 1) : thickness 
                );

            }
            

            return shapes;

        }

    }

}