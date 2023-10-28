import { RGBA } from "./color.js";
import { Point2D } from "./point.js";

export class ellipse2D{

    // ellipse foci point's
    // note : foci point's around origin (0,0) !!
    #f1 = undefined;
    #f2 = undefined;

    constructor( 
        x = 1 , y = 1 , width = 1 , height = 1 , radian_angle = 0 , 
        fill_color = undefined , border_color = undefined , border = 1
    ){

        this.x = (typeof(x) == "number") ? x : 1;
        this.y = (typeof(y) == "number") ? y : 1;

        // rotation angle around "Z-axis"
        this.angle = (typeof(radian_angle) == "number") ? radian_angle : 0; 

        this.border = border;

        this.width  = (typeof(width)  == "number") ? width/2  : 1;
        this.height = (typeof(height) == "number") ? height/2 : 1;

        this.fill_color   = (fill_color instanceof RGBA)   ? fill_color   : undefined;
        this.border_color = (border_color instanceof RGBA) ? border_color : undefined;

        if( width > height ){

            let fvalue = Math.sqrt( (width*width) - (height*height) );
            this.#f2 = new Point2D( fvalue , 0 );
            this.#f1 = new Point2D(-fvalue , 0 );

        }
        else {

            let fvalue = Math.sqrt( (height*height) - (width*width) );
            this.#f2 = new Point2D( 0 ,  fvalue );
            this.#f1 = new Point2D( 0 , -fvalue );

        }

        this.get_f1 = () => {
            return Point2D.Copy( this.#f1 );
        }

        this.get_f2 = () => {
            return Point2D.Copy( this.#f2 );
        }

    }


}
