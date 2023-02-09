
import { point2D , point2D_with_color } from "./point.js";
import { RGBA } from "./color.js";

/*

    NOTE : rectangles here only for 2D 

*/



export class rectangle{ // without gradient support  

    constructor(
        x = 1, y = 1, width = 1, height = 1, rectangle_color = new RGBA() , 
        fill = true , border = 0 , border_color = new RGBA() 
    ){

        this.position = new point2D(x , y);
        this.width  = (width < 1) ? 1 : width ;
        this.height = (height < 1) ? 1 : height ;
        this.fill   = (typeof(fill)   == "boolean") ? fill : false;
        this.border = (border < 0) ? 0 : border;
        this.rect_color   = ( rectangle_color instanceof RGBA ) ? rectangle_color : new RGBA();
        this.border_color = ( border_color instanceof RGBA ) ? border_color : new RGBA();

    }

    static random_rectangle(max_x = 1, max_y = 1, max_width = 1, max_hegith = 1, color = undefined){

        // generate random rectangle 
        return new rectangle(

            Math.random() * max_x ,
            Math.random() * max_y ,
            Math.random() * max_width ,
            Math.random() * max_hegith ,
            (color instanceof RGBA) ? color : RGBA.random_color() ,
            Math.round(Math.random()*1)

        );

    }

}


export class rectangle_with_gradient{ // without border's support 
 
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