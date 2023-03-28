
import { point2D , point2D_with_color } from "./point.js";
import { RGBA } from "./color.js";

/*

    NOTE : rectangles here only for 2D 

*/


export class rectangle{ // no gradient support  

    constructor(
        x = 1, y = 1, width = 1, height = 1, fill_color = undefined , 
        border_color = undefined , border_thickness = 0 
    ){

        this.position = new point2D(x , y);
        this.width  = (width < 1) ? 1 : width ;
        this.height = (height < 1) ? 1 : height ;
        this.border = (border_thickness <= 0) ? 0 : border_thickness;
        this.fill_color   = ( fill_color instanceof RGBA ) ? fill_color : undefined;
        this.border_color = ( border_color instanceof RGBA ) ? border_color : undefined;

    }

}


export class rectangle_with_gradient{ // no border support 
 
    constructor(   
        x = 1, y = 1, width = 1, height = 1 , 
        color_a = new RGBA() ,
        color_b = new RGBA() ,
        color_c = new RGBA() ,
        color_d = new RGBA() ,
    ){  

        this.position = new point2D( x , y );
        this.width = (width < 1) ? 1 : width;
        this.height = (height < 1) ? 1 : height;

        // points object contain all the 4 points each one with it's "position,color" 
        // to make it easy when we want to process gradient's 
        this.points = {
            a : new point2D_with_color(x , y , color_a),
            b : new point2D_with_color(x+this.width , y, color_b),
            c : new point2D_with_color(x , y+this.height , color_c),
            d : new point2D_with_color(x+this.width , y+this.height , color_d),
        }
    }

}