import { RGBA } from "./color.js";

export class circle2D {

    constructor( 
        x = 1 , y = 1 , radius = 1 , color = undefined , border_thickness = 1 , border_color = new RGBA()
    ){

        this.x = x;
        this.y = y;
        this.r = radius;
        this.thickness = border_thickness;
        this.color = (color instanceof RGBA) ? color : new RGBA();
        this.border_color = (border_color instanceof RGBA) ? border_color : undefined;

    }


    static copy( circle2D_object = new circle2D() ){

        if( circle2D_object instanceof circle2D ) {

            return new circle2D( 
                new Number(circle2D_object.x) , 
                new Number(circle2D_object.y) ,
                new Number(circle2D_object.r) ,
                (circle2D_object.color instanceof RGBA) ? RGBA.copy(circle2D_object.color) : undefined ,
                new Number(circle2D_object.thickness) ,
                (circle2D_object.border_color instanceof RGBA) ? RGBA.copy(circle2D_object.border_color) : undefined
            );

        }
        else return null;

    }

    static random_circle( max_width = 1, max_height = 1 , thickness = 1 , color = false , border_color = true ){

        return new circle2D(
            Math.random() * max_width ,
            Math.random() * max_height ,
            Math.random() * max_width/8 ,
            (color) ? RGBA.random_color() : undefined ,
            thickness ,
            (border_color) ? RGBA.random_color() : undefined
        );

    }

}