import { RGBA } from "./color.js";

/*
    normal buffer with no specification's 
*/
export class FrameBuffer{

    // PRIVATE PROPERTIES
    #x = 0;
    #y = 0; 
    #width  = 1;
    #height = 1;
    #length = 1;
    #buffer = undefined;
    #color  = new RGBA(0,0,0,1);

    constructor( 
        x = 0 , y = 0 , width = 1 , height = 1 , color = new RGBA(0,0,0,1) 
    ){
        
        if( color instanceof RGBA ) this.#color = color;
        
        this.#x = x;
        this.#y = y;

        if( width > 0 ) {
            this.#width = Number.parseInt(width);
        }
        else {

            FrameBuffer.#LOG.invalid();
            FrameBuffer.#LOG.def_value();
            this.#width = 800;

        }

        if( height > 0 ) {
            this.#height = Number.parseInt(height);
        }
        else {
            
            FrameBuffer.#LOG.invalid();
            FrameBuffer.#LOG.def_value();
            this.#height = 600;

        }

        // allocate buffer array 
        this.#length = this.#width * this.#height;
        this.#buffer = new Array( this.#length );
        this.#buffer.fill( this.#color );


        /*
           ============ frame_buffer public functions ============ 
        */

        this.GetSample = ( x = 0 , y = 0 ) => {

            if( x < 0 || x > this.#width  - 1 ) return null;
            if( y < 0 || y > this.#height - 1 ) return null;
            
            return this.#buffer[ (this.#width * y) + x ];

        }
  
        this.SetSample = ( x = 0 , y = 0 , pixle_color = null ) => {

            if( x < 0 || x > this.#width  - 1 ) return;
            if( y < 0 || y > this.#height - 1 ) return;

            this.#buffer[ (this.#width * y) + x] = pixle_color;

        }

        this.GetRowOfSamples = ( y = 0 ) => {
            
            if( y < 0 || y > this.#height - 1 ){ 
                FrameBuffer.#LOG.invalid_value("y",y);
                return null;
            }

            return this.#buffer[y];
        }

        this.Clear = ( color_to_clear_with = null ) => {

            let clear_color;

            if( color_to_clear_with instanceof RGBA ) {
                clear_color = color_to_clear_with;
            }
            else {
                clear_color = this.#color;
            }

            for( let y = 0; y < (this.#height - 1) ; y++ ){

                for( let x = 0; x < (this.#width - 1) ; x++ ){
                    this.#buffer[y][x] = clear_color;
                }

            }

        }

        this.ClearFromTo = ( x = 0 , y = 0 , width = 1 , height = 1 , color_to_clear_with = null ) => {

            let clear_color;

            if( color_to_clear_with instanceof RGBA ) {
                clear_color = color_to_clear_with;
            }
            else {
                clear_color = this.#color;
            }
           
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

        this.Width = () => {
            return this.#width - 1;
        }

        this.Height = () => {
            return this.#height - 1;
        }

        this.GetX = () => {
            return this.#x;
        }

        this.GetY = () => {
            return this.#y;
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

/*
    a boundry "declaration" of a sub-buffer on the top of a main buffer  
*/
export class SubBuffer{

    constructor( x_min , y_min , x_max , y_max ){

        this.x_min = x_min;
        this.x_max = x_max;

        this.y_min = y_min;
        this.y_max = y_max;

        this.width  = x_max - x_min;
        this.height = y_max - y_min;
        
    }

}