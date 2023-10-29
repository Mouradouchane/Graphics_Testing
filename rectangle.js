
import { RGBA } from "./color.js";
import { Point2D } from "./point.js";

/*

    NOTE : no support for gradient currentlly   
    
*/

export class Rectangle2D{ 


    constructor(
        x = 1, y = 1, width = 1, height = 1, fill_color = undefined , 
        border_color = undefined , border_thickness = 0 
    ){

        this.position = new Point2D(x , y);
        this.width  = (width < 1) ? 1 : width ;
        this.height = (height < 1) ? 1 : height ;
        this.border = (border_thickness <= 0) ? 0 : border_thickness;
        this.fill_color   = ( fill_color instanceof RGBA ) ? fill_color : undefined;
        this.border_color = ( border_color instanceof RGBA ) ? border_color : undefined;

    }

}

