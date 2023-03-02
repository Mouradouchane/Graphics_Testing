import { RGBA } from "./color.js";

export class ellpise2D{

    constructor( 
        x = 1 , y = 1 , width = 1 , height = 1 , degree = 0 , fill_color = undefined , border_color = undefined
    ){

        this.x = (typeof(x) == "number") ? x : 1;
        this.y = (typeof(y) == "number") ? y : 1;

        this.degree = (typeof(degree) == "number") ? degree : 0.; // for ellipse rotation around "Z"

        this.width  = (typeof(width)  == "number") ? width  : 1;
        this.height = (typeof(height) == "number") ? height : 1;

        this.fill_color   = (fill_color instanceof RGBA)   ? fill_color   : undefined;
        this.border_color = (border_color instanceof RGBA) ? border_color : undefined;

    }


}
