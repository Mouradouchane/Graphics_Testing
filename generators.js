import {RGBA} from "./color.js";
import {Point2D} from "./point.js";
import {Line2D} from "./line.js";
import {Triangle2D} from "./triangle.js";
import {Circle2D} from "./circle.js";
import {Ellipse2D} from "./ellipse.js";
import {Rectangle2D} from "./rectangle.js";

export class Generator {
   
    // default options for shapes generation in case some parameters "undefined"
    static #DEFAULT = {

        thickness : 6 ,

        min_width : 1,
        max_width : 800,

        min_height : 1,
        max_height : 600,
        
    } 


    // main generator function used in all other functions to generate all the shapes
    static #MAIN_GENERATOR(

        // class name
        shape_type = undefined , 
    
        amount_of_objects = 1 , 

        thickness = undefined , 

        min_X = undefined , max_X = undefined , 
        min_Y = undefined , max_Y = undefined , 

        fill_color = undefined , border_color = undefined ,
        fill_color_random_alpha = false , border_color_random_alpha = false ,

    ) {

        // check parameter's before generate

        if( shape_type === undefined || shape_type === null ) return null;

        amount_of_objects = ( amount_of_objects <= 0 ) ? 1 : amount_of_objects;

        min_X = (min_X == undefined) ? Generator.#DEFAULT.min_width : min_X;
        max_X = (max_X == undefined) ? Generator.#DEFAULT.max_width : max_X;
        
        min_Y = (min_Y == undefined) ? Generator.#DEFAULT.min_height : min_Y;
        max_Y = (max_Y == undefined) ? Generator.#DEFAULT.max_height : max_Y;

        let allow_fill = false;
        if( fill_color == undefined || !(fill_color instanceof RGBA) ) {

            allow_fill = true;
            fill_color = Generator.Random.Colors( fill_color_random_alpha );

        } 

        let allow_border = false;
        if( border_color == undefined || !(border_color instanceof RGBA) ){

            allow_border = true;
            border_color = Generator.Random.Colors( border_color_random_alpha );

        } 
        
        let allow_thickness = false;
        if( thickness == undefined || thickness <= 0 ) {

            allow_thickness = true;
            thickness = Generator.#DEFAULT.thickness;

        }


        // generate process 
        
        var OBJECTS = [];

        for( let i = 0 ; i < amount_of_objects ; i += 1){
            
            if(allow_fill)      fill_color      = Generator.Random.Colors( fill_color_random_alpha );
            if(allow_border)    border_color    = Generator.Random.Colors( border_color_random_alpha );
            if(allow_thickness) thickness       = Math.ceil((Math.random() * Generator.#DEFAULT.thickness) + 1);
            
            if( shape_type === Point2D ){

                OBJECTS[i] = new Point2D(
                    (Math.random() * max_X) + min_X , 
                    (Math.random() * max_Y) + min_Y 
                );
                
                continue;
            }
            
            if( shape_type === Line2D ){
                
                OBJECTS[i] = new Line2D(
                    new Point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ) ,
                    new Point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ) ,
                    ( thickness == undefined || thickness <= 0 ) ? Generator.#DEFAULT.thickness : thickness ,
                    ( fill_color == undefined || !(fill_color instanceof RGBA) ) ? Generator.Random.Colors(fill_color_random_alpha) : fill_color
                );
                continue;

            }

            if( shape_type === Rectangle2D ){

                // X , Y
                let x = ( Math.random() * max_X / 2) + min_X ;
                let y = ( Math.random() * max_Y / 2) + min_Y ;
                // WIDTH , HEIGHT
                let w = ( Math.random() * max_X );
                let h = ( Math.random() * max_Y );

                OBJECTS[i] = new Rectangle2D(
                    x , y ,
                    ( x + w > max_X) ? max_X - x - thickness: w, 
                    ( y + h > max_Y) ? max_Y - y - thickness: h,
                    
                    fill_color ,
                    border_color,
                    thickness
                );

                continue;
            }

            if( shape_type === Triangle2D ){

                OBJECTS[i] = new Triangle2D(
                    // Points A , B , C
                    new Point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ),
                    new Point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ),
                    new Point2D( (Math.random() * max_X) + min_X , (Math.random() * max_Y) + min_Y ),
                    
                    thickness,
                    fill_color ,
                    border_color
                );
                
                continue;
            }

            if( shape_type === Circle2D ){    
                
                OBJECTS[i] = new Circle2D(
                    // X , Y
                    (Math.random() * max_X) + min_X , 
                    (Math.random() * max_Y) + min_Y , 
                    // Raduis
                    (Math.random() * (max_X/4)) + min_X , 

                    fill_color ,
                    thickness,
                    border_color
                );

                continue;
            }

            if( shape_type === Ellipse2D ){

                OBJECTS[i] = new Ellipse2D(
                    // X , Y
                    (Math.random() * max_X) + min_X , 
                    (Math.random() * max_Y) + min_Y ,

                    // WIDTH , HEIGHT
                    (Math.random() * (max_X/4)) + min_X , 
                    (Math.random() * (max_Y/4)) + min_Y ,

                    // angle
                    (Math.random() * Math.PI),

                    fill_color ,
                    border_color,
                    thickness
                );

                continue;
            }

        }

        return OBJECTS;

    }


    static Random = {

        Colors( random_alpha = false ){

            return RGBA.RandomColor(random_alpha);

        },

        Points2D(  
            amount_of_points = 1 , 
            min_X = undefined , max_X = undefined , min_Y = undefined , max_Y = undefined , 
        ){

            return Generator.#MAIN_GENERATOR( 
                Point2D , amount_of_points , undefined , min_X , max_X , min_Y , max_Y 
            );

        },

        Lines2D( 
            amount_of_objects = 1 ,
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            fill_color = undefined , fill_color_random_alpha = false ,
            border_thickness = undefined , 
        ){

            return Generator.#MAIN_GENERATOR( 
                Line2D , amount_of_objects , border_thickness , min_X , max_X , min_Y , max_Y ,
                fill_color , undefined , fill_color_random_alpha 
            );

        },

        Rectangles2D( 
            amount_of_objects = 1 ,
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            fill_color = undefined , fill_color_random_alpha = false , 
            border_color = undefined , border_color_random_alpha = false ,
            border_thickness = undefined, 
        ){

            return Generator.#MAIN_GENERATOR( 
                Rectangle2D , amount_of_objects ,
                border_thickness,
                min_X , max_X , min_Y , max_Y , 
                fill_color , border_color , 
                fill_color_random_alpha , border_color_random_alpha 
            );

        },

        Triangles2D(
            amount_of_objects = 1 ,

            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            border_thickness = 0 ,
            
            fill_color = undefined , border_color = undefined ,

            fill_color_random_alpha = undefined , 
            border_color_random_alpha = undefined
        ){

            return Generator.#MAIN_GENERATOR(
                Triangle2D , amount_of_objects , border_thickness ,
                min_X , max_X ,min_Y ,max_Y , 
                fill_color , border_color ,
                fill_color_random_alpha , border_color_random_alpha
            );
            
        },

        Cicrles2D( 
            amount_of_objects = 1 ,
            
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            border_thickness = 0 ,
            
            fill_color = undefined , border_color = undefined ,

            fill_color_random_alpha = undefined , 
            border_color_random_alpha = undefined
        ){

            return Generator.#MAIN_GENERATOR(
                Circle2D , amount_of_objects , border_thickness ,
                min_X , max_X ,min_Y ,max_Y ,
                fill_color , border_color ,
                fill_color_random_alpha , border_color_random_alpha
            );

        },

        Ellipses2D(
            amount_of_objects = 1 ,
            
            min_X = undefined , max_X = undefined , 
            min_Y = undefined , max_Y = undefined ,
            border_thickness = 0 ,
            
            fill_color = undefined , border_color = undefined ,

            fill_color_random_alpha = undefined , 
            border_color_random_alpha = undefined
        ){

            return Generator.#MAIN_GENERATOR( 
                Ellipse2D , amount_of_objects , border_thickness ,
                min_X , max_X ,min_Y ,max_Y ,
                fill_color , border_color ,
                fill_color_random_alpha , border_color_random_alpha
            );

        },

    } // end of Random object

} // end of Generator class
