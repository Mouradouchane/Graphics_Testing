import { RGBA } from "./color.js";

export class circle2D {

    constructor( 
        x = 1 , y = 1 , radius = 1 , color = new RGBA() , border_color = undefined
    ){

        this.x = x;
        this.y = y;
        this.r = radius;
        this.color = (color instanceof RGBA) ? color : new RGBA();
        this.border_color = (border_color instanceof RGBA) ? border_color : undefined;

    }


    static copy( circle2D_object = new circle2D() ){

        if( circle2D_object instanceof circle2D ) {

            return new circle2D( 
                circle2D_object.x , 
                circle2D_object.y ,
                circle2D_object.r ,
                circle2D_object.color ,
                circle2D_object.fill_color 
            );

        }
        else return null;

    }

}