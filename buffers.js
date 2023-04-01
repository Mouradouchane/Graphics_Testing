import { RGBA } from "./color.js";

// normal buffer with no specification's 
export class frame_buffer{

    // PRIVATE PROPERTIES 
    #width  = 1;
    #height = 1;
    #buffer = undefined;

    constructor( buffer_width = 1 , buffer_height = 1 ){

        if( buffer_width > 0 ) this.#width = new Number(buffer_width);
        else {

            frame_buffer.#LOG.invalid();
            frame_buffer.#LOG.def_value();

        }

        if( buffer_height > 0 ) this.#height = new Number(buffer_height);
        else {
            
            frame_buffer.#LOG.invalid();
            frame_buffer.#LOG.def_value();

        }

        // allocated 2D buffer

        this.#buffer = new Array(this.#height);

        for(let y = 0; y < this.#height ; y += 1 ){
            this.#buffer[y] = new Array( this.#width ).fill(null);
        }


        // frame_buffer functions
         
        this.get_pixle = ( x = 0 , y = 0 ) => {

            if( x < 0 || x > this.#width - 1 ) {
                frame_buffer.#LOG.invalid_value("x" , x);
                return null;
            }

            if( y < 0 || y > this.#height - 1 ) {
                frame_buffer.#LOG.invalid_value("y" , y);
                return null;
            }

            return this.#buffer[x][y];

        }
  
        this.set_pixle = ( x = 0 , y = 0 , pixle_color = null ) => {
            debugger
            if( x < 0 || x > this.#width - 1 ) {
                frame_buffer.#LOG.invalid_value("x" , x);
                return false;
            }

            if( y < 0 || y > this.#height - 1 ) {
                frame_buffer.#LOG.invalid_value("y" , y);
                return false;
            }

            if( pixle_color != null || !(pixle_color instanceof RGBA) ){
                frame_buffer.#LOG.invalid_value("pixle_color" , pixle_color);
                return false;
            }

            this.#buffer[x][y] = pixle_color;

            return true;
        }

        this.clear = ( color_to_clear_with = null ) => {

            let clear_color;

            if( color_to_clear_with instanceof RGBA ) 
                    clear_color = color_to_clear_with;
            else 
                    clear_color = new RGBA(0,0,0,1);

            for( let y = 0; y < (this.#height - 1) ; y++ ){

                for( let x = 0; x < (this.#width - 1) ; x++ ){
                    this.#buffer[x][y] = clear_color;
                }

            }

        }

        this.clear_from_to = ( x = 0 , y = 0 , width = 1 , height = 1 , color_to_clear_with = null ) => {

            let clear_color;

            if( color_to_clear_with instanceof RGBA ) 
                    clear_color = color_to_clear_with;
            else 
                    clear_color = new RGBA(0,0,0,1);
           
            x = ( x < 0 ) ? 0 : ( x > (this.#width  - 1) ) ? this.#width  - 1  : x;
            y = ( y < 0 ) ? 0 : ( y > (this.#height - 1) ) ? this.#height - 1  : y;

            width  = ( width < 1 )  ? 1 : ( width  + x > (this.#width - 1) )  ? this.#width  - 1 : width;
            height = ( height < 1 ) ? 1 : ( height + y > (this.#height - 1) ) ? this.#height - 1 : height;
            
            for( let Y = y ; Y <= (height + y) ; Y++ ){

                for( let X = x ; X <= (width + x) ; X++ ){
                    this.#buffer[X][Y] = clear_color;
                }

            }

        }

        this.width = () => {
            return this.#width - 1;
        }

        this.height = () => {
            return this.#height - 1;
        }

    }


    // STATIC PRIVATE/PUBLIC FUNCTION'S

    static #LOG = {
    
        invalid : (param_name) => {
            console.error(`invalid parameter ${param_name} .`);
        },
        invalid_value : (param_name , param_value) => {
            console.warn(`parameter ${param_name} = ${param_value} , not a valid value .`);
        },
        def_value : (param_name) => {
            console.warn(`because the passed parameter ${param_name} invalid , the default value gonna replace it .`);
        }
    
    }

}
