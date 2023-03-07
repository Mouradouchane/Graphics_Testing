import { RGBA } from "./color.js";

export class ellpise2D{

    // ellipse foci point
    #f1 = undefined;
    #f2 = undefined;

    constructor( 
        x = 1 , y = 1 , width = 1 , height = 1 , radian_angle = 0 , fill_color = undefined , border_color = undefined
    ){

        this.x = (typeof(x) == "number") ? x : 1;
        this.y = (typeof(y) == "number") ? y : 1;

        this.angle = (typeof(radian_angle) == "number") ? radian_angle : 0; // for rotation around "Z-axis"

        this.width  = (typeof(width)  == "number") ? width  : 1;
        this.height = (typeof(height) == "number") ? height : 1;

        this.fill_color   = (fill_color instanceof RGBA)   ? fill_color   : undefined;
        this.border_color = (border_color instanceof RGBA) ? border_color : undefined;

        /*
            to-do : 
                - calc foci points
                - add getter's for foci points 
                - add support to rotate ellipse
        */
    }


}
