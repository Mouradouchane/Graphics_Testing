import {RGBA} from "./color.js";
import {point2D , point2D_with_color} from "./point.js";
import {line , line_with_colors } from "./line.js";
import {rectangle , rectangle_with_gradient} from "./rectangle.js";
import {triangle2D} from "./triangle.js";
import {circle2D} from "./circle.js";
import {plane2D} from "./plane.js";

export class generate {
   
    // default options for shapes generation in case some parameters "undefined"
    static #default = {

        thickness : 6 ,

        min_width : 1,
        max_width : 800,

        min_height : 1,
        max_height : 600,
        
    } 


    // the main function who generate all the shapes 
    static #main_generator(

        // class name
        SHAPES_TYPE = undefined , 
    
        AMOUNT_OF_OBJECTS = 1 , 

        thickness = undefined , 

        min_X = undefined , max_X = undefined , 
        min_Y = undefined , max_Y = undefined , 

        fill_color = undefined , border_color = undefined ,
        fill_color_random_alpha = false , border_color_random_alpha = false ,

    ) {

        // check parameter's before generate

        if( SHAPES_TYPE === undefined || SHAPES_TYPE === null ) return null;

        AMOUNT_OF_OBJECTS = ( AMOUNT_OF_OBJECTS <= 0 ) ? 1 : AMOUNT_OF_OBJECTS;

        min_X = (min_X == undefined) ? generate.#default.min_width : min_X;
        max_X = (max_X == undefined) ? generate.#default.max_width : max_X;
        
        min_Y = (min_Y == undefined) ? generate.#default.min_height : min_Y;
        max_Y = (max_Y == undefined) ? generate.#default.max_height : max_Y;

        let allow_fill = false;
        if( fill_color == undefined || !(fill_color instanceof RGBA) ) {

            allow_fill = true;
            fill_color = generate.random.color( fill_color_random_alpha );

        } 

        let allow_border = false;
        if( border_color == undefined || !(border_color instanceof RGBA) ){

            allow_border = true;
            border_color = generate.random.color( border_color_random_alpha );

        } 
        
        let allow_thickness = false;
        if( thickness == undefined || thickness <= 0 ) {

            allow_thickness = true;
            thickness = generate.#default.thickness;

        }


        // generate process 
        
        var OBJECTS = [];

        for( let i = 0 ; i < AMOUNT_OF_OBJECTS ; i += 1){
            
            if(allow_fill)      fill_color      = generate.random.color( fill_color_random_alpha );
            if(allow_border)    border_color    = generate.random.color( border_color_random_alpha );
            if(allow_thickness) thickness       = Math.ceil((Math.random() * generate.#default.thickness) + 1);
            
            if( SHAPES_TYPE === point2D ){

                OBJECTS[i] = new point2D(
                    (Math.random() * max_X) + min_X , 
                    (Math.random() * max_Y) + min_Y 
                );
                
                continue;
            }
            
            if( SHAPES_TYPE === line ){
                
                OBJECTS[i] = new line(
                    new point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ) ,
                    new point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ) ,
                    ( thickness == undefined || thickness <= 0 ) ? generate.#default.thickness : thickness ,
                    ( fill_color == undefined || !(fill_color instanceof RGBA) ) ? generate.random.color(fill_color_random_alpha) : fill_color
                );
                continue;

            }

            if( SHAPES_TYPE === rectangle ){

                // X , Y
                let x = ( Math.random() * max_X / 2) + min_X ;
                let y = ( Math.random() * max_Y / 2) + min_Y ;
                // WIDTH , HEIGHT
                let w = ( Math.random() * max_X );
                let h = ( Math.random() * max_Y );

                OBJECTS[i] = new rectangle(
                    x , y ,
                    ( x + w > max_X) ? max_X - x - thickness: w, 
                    ( y + h > max_Y) ? max_Y - y - thickness: h,
                    
                    fill_color ,
                    border_color,
                    thickness
                );

                continue;
            }

            if( SHAPES_TYPE === triangle2D ){

                OBJECTS[i] = new triangle2D(
                    // Points A , B , C
                    new point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ),
                    new point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ),
                    new point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ),
                    
                    thickness,
                    fill_color ,
                    border_color
                );
                
                continue;
            }

            if( SHAPES_TYPE === circle2D ){    
                
                OBJECTS[i] = new circle2D(
                    // X , Y
                    (Math.random() * max_X) + min_X , 
                    (Math.random() * max_Y) + min_Y , 
                    // Raduis
                    ((Math.random() * max_X) + min_X) / 4, 

                    fill_color ,
                    thickness,
                    border_color
                );

                continue;
            }

            if( SHAPES_TYPE === plane2D ){

                OBJECTS[i] = new plane2D(
                    // POINTS A , B , C , D
                    new point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ) ,  
                    new point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ) ,  
                    new point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ) ,  
                    new point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ) ,
                    fill_color , border_color , thickness 
                );

                continue;
            }

        }

        return OBJECTS;

    }

    static random = {

        color( random_alpha = undefined ){

            return new RGBA(
                Math.floor( Math.random() * 255 ) ,
                Math.floor( Math.random() * 255 ) ,
                Math.floor( Math.random() * 255 ) ,
                ( random_alpha ) ? Math.random() + 0.1 : 1
            );

        },

        point2D(  
            amount_of_points = 1 , 
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined , 
        ){

            return generate.#main_generator( 
                point2D , amount_of_points , undefined , min_X , max_X , min_Y , max_Y 
            );

        },

        lines( 
            amount_of_objects = 1 ,
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            fill_color = undefined , fill_color_random_alpha = false ,
            thickness = undefined , 
        ){

            return generate.#main_generator( 
                line , amount_of_objects , thickness , min_X , max_X , min_Y , max_Y ,
                fill_color , undefined , fill_color_random_alpha 
            );

        },

        rectangles( 
            amount_of_objects = 1 ,
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            fill_color = undefined , fill_color_random_alpha = false , 
            border_color = undefined , border_color_random_alpha = false ,
            border_thickness = undefined, 
        ){

            return generate.#main_generator( 
                rectangle , amount_of_objects ,
                border_thickness,
                min_X , max_X , min_Y , max_Y , 
                fill_color , border_color , 
                fill_color_random_alpha , border_color_random_alpha 
            );

        },

        triangles(
            amount_of_objects = 1 ,

            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            border_thickness = 0 ,
            
            fill_color = undefined , border_color = undefined ,

            fill_color_random_alpha = undefined , 
            border_color_random_alpha = undefined
        ){

            return generate.#main_generator(
                triangle2D , amount_of_objects , border_thickness ,
                min_X , max_X ,min_Y ,max_Y , 
                fill_color , border_color ,
                fill_color_random_alpha , border_color_random_alpha
            );
            
        },

        cicrles( 
            amount_of_objects = 1 ,
            
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            border_thickness = 0 ,
            
            fill_color = undefined , border_color = undefined ,

            fill_color_random_alpha = undefined , 
            border_color_random_alpha = undefined
        ){

            return generate.#main_generator(
                circle2D , amount_of_objects , border_thickness ,
                min_X , max_X ,min_Y ,max_Y ,
                fill_color , border_color ,
                fill_color_random_alpha , border_color_random_alpha
            );

        },

        planes(
            amount_of_objects = 1 ,  

            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            border_thickness = 0 ,

            fill_color = undefined , border_color = undefined ,

            fill_color_random_alpha = undefined , 
            border_color_random_alpha = undefined
        ){

            return generate.#main_generator(
                plane2D , amount_of_objects , border_thickness ,
                min_X , max_X ,min_Y ,max_Y ,
                fill_color , border_color ,
                fill_color_random_alpha , border_color_random_alpha
            );

        }

    }

}