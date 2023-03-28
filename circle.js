import { RGBA } from "./color.js";

export class circle2D {

    constructor( 
        x = 1 , y = 1 , radius = 1 , fill_color = undefined , border_thickness = 1 , border_color = undefined
    ){

        this.x = x;
        this.y = y;
        this.r = radius;
        this.border = border_thickness;
        this.fill_color = (fill_color instanceof RGBA) ? fill_color : undefined;
        this.border_color = (border_color instanceof RGBA) ? border_color : undefined;

    }


    static copy( circle2D_object = new circle2D() ){

        if( circle2D_object instanceof circle2D ) {

            return new circle2D( 
                new Number(circle2D_object.x) , 
                new Number(circle2D_object.y) ,
                new Number(circle2D_object.r) ,
                (circle2D_object.fill_color instanceof RGBA) ? RGBA.copy(circle2D_object.fill_color) : undefined ,
                new Number(circle2D_object.border) ,
                (circle2D_object.border_color instanceof RGBA) ? RGBA.copy(circle2D_object.border_color) : undefined
            );

        }
        else return null;

    }

    static random_circle( 
        max_width = 1, max_height = 1 , thickness = 1 , 
        generate_fill_color = false , generate_border_color = true 
    ){

        return new circle2D(
            Math.random() * max_width ,
            Math.random() * max_height ,
            Math.random() * max_width/8 ,
            (generate_fill_color) ? RGBA.random_color() : undefined ,
            thickness ,
            (generate_border_color) ? RGBA.random_color() : undefined
        );

    }

}