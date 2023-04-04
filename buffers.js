import { RGBA } from "./color.js";

// normal buffer with no specification's 
export class frame_buffer{

    // PRIVATE PROPERTIES 
    #width  = 1;
    #height = 1;
    #length = 1;
    #buffer = undefined;
    #c_color = new RGBA(0,0,0,1);

    constructor( buffer_width = 1 , buffer_height = 1 , clear_color = new RGBA(0,0,0,1) ){
        
        if( clear_color instanceof RGBA ) this.#c_color = clear_color;
        
        if( buffer_width > 0 ) {
            this.#width = Number.parseInt(buffer_width);
        }
        else {

            frame_buffer.#LOG.invalid();
            frame_buffer.#LOG.def_value();
            this.#width = 800;

        }

        if( buffer_height > 0 ) {
            this.#height = Number.parseInt(buffer_height);
        }
        else {
            
            frame_buffer.#LOG.invalid();
            frame_buffer.#LOG.def_value();
            this.#height = 600;

        }

        // allocate buffer array 
        this.#length = this.#width * this.#height;
        this.#buffer = new Array( this.#length );
        this.#buffer.fill( this.#c_color );


        /*
           ============ frame_buffer public functions ============ 
        */

        this.get_pixle = ( x = 0 , y = 0 ) => {

            if( x < 0 || x > this.#width  - 1 ) return null;
            if( y < 0 || y > this.#height - 1 ) return null;
            
            return this.#buffer[ (this.#width * y) + x ];

        }
  
        this.set_pixle = ( x = 0 , y = 0 , pixle_color = null ) => {

            if( x < 0 || x > this.#width  - 1 ) return;
            if( y < 0 || y > this.#height - 1 ) return;

            this.#buffer[ (this.#width * y) + x] = pixle_color;

        }

        this.get_line = ( y = 0 ) => {
            
            if( y < 0 || y > this.#height - 1 ){ 
                frame_buffer.#LOG.invalid_value("y",y);
                return null;
            }

            return this.#buffer[y];
        }

        this.clear = ( color_to_clear_with = null ) => {

            let clear_color;

            if( color_to_clear_with instanceof RGBA ) 
                    clear_color = color_to_clear_with;
            else 
                    clear_color = new RGBA(0,0,0,1);

            for( let y = 0; y < (this.#height - 1) ; y++ ){

                for( let x = 0; x < (this.#width - 1) ; x++ ){
                    this.#buffer[y][x] = clear_color;
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
                    this.#buffer[y][x] = clear_color;
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


    static #LOG = {
    
        invalid : (param_name) => {
            console.error(`draw.js : invalid parameter ${param_name} .`);
        },
        invalid_value : (param_name , param_value) => {
            console.warn(`draw.js : parameter ${param_name} = ${param_value} , not a valid value .`);
        },
        def_value : (param_name) => {
            console.warn(`draw.js : because the passed parameter ${param_name} invalid , the default value gonna replace it .`);
        }
    
    }

}
