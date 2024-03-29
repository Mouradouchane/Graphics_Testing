import { RGBA } from "./color.js";

export class Circle2D {

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


    static Copy( circle2D_object = new Circle2D() ){

        if( circle2D_object instanceof Circle2D ) {

            return new Circle2D( 
                Number.parseInt(circle2D_object.x) , 
                Number.parseInt(circle2D_object.y) ,
                Number.parseInt(circle2D_object.r) ,
                (circle2D_object.fill_color instanceof RGBA) ? RGBA.Copy(circle2D_object.fill_color) : undefined ,
                Number.parseInt(circle2D_object.border) ,
                (circle2D_object.border_color instanceof RGBA) ? RGBA.Copy(circle2D_object.border_color) : undefined
            );

        }
        else return null;

    }

    static RandomCircle( 
        max_width = 1, max_height = 1 , thickness = 1 , 
        generate_fill_color = false , generate_border_color = true 
    ){

        return new Circle2D(
            Math.random() * max_width ,
            Math.random() * max_height ,
            Math.random() * max_width/8 ,
            (generate_fill_color) ? RGBA.RandomColor() : undefined ,
            thickness ,
            (generate_border_color) ? RGBA.RandomColor() : undefined
        );

    }

}