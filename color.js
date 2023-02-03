
export class RGBA{

    // static private values for RGBA class usage
    static #RGB_MAX_VALUE = 255;
    static #RGB_MIN_VALUE = 0;
    static #ALPHA_MIN_VALUE = 0;
    static #ALPHA_MAX_VALUE = 1;

    constructor( red = 255, green = 255 , blue = 255 , alpha = 1) {

        let min = RGBA.#RGB_MIN_VALUE;
        let max = RGBA.#RGB_MAX_VALUE;

        this.red = (red > max) ? max: (red < min) ? min : red;
        this.green = (green > max) ? max : (green < min) ? min : green;
        this.blue = (blue > max) ? max : (blue < min) ? min : blue;

        min = RGBA.#ALPHA_MIN_VALUE;
        max = RGBA.#ALPHA_MAX_VALUE;

        this.alpha = (alpha > max) ? max : (alpha < min) ? min : alpha;

    }
    
    static to_string( RGBA_object = new RGBA() ) {

        if(RGBA_object instanceof RGBA){

            return `rgba(${RGBA_object.red},${RGBA_object.green},${RGBA_object.blue},${RGBA_object.alpha})`;
        
        }
        else return null;

    }

    static to_hexa( RGBA_object = new RGBA() ) {

        if(RGBA_object instanceof RGBA){

            return `#${RGBA_object.red.toString(16)}${RGBA_object.green.toString(16)}${RGBA_object.blue.toString(16),RGBA_object.alpha}`;
        
        }
        else return null;

    }

    static blend( fg_color = new RGBA() , bg_color = new RGBA() ){

        if( fg_color instanceof RGBA && bg_color instanceof RGBA ){
            
            if( fg_color.alpha <= 0 ) return bg_color;
            if( bg_color.alpha <= 0 ) return fg_color;

            // else => blend color a with b

            let new_color = new RGBA(); // new color 
            
            // solve for "a" alpha first
            // blend alpha's formula ======> a = af + ( 1 - af ) * ab
            
            let alpha_A = fg_color.alpha; // af
            let alpha_B = bg_color.alpha; // ab

            new_color.alpha = alpha_A + ( RGBA.#ALPHA_MAX_VALUE - alpha_A ) * alpha_B; // a

            // blend colors
            /* ============== formula =======================
                    af * cf + ( 1 - af ) * cb 
                c = _______________________________
                                a
            */
            for( let color of ["red","green","blue"] ){
                RGBA.set[color]( 
                    new_color , 
                    Math.round( 
                        ( alpha_A * fg_color[color] + ( RGBA.#ALPHA_MAX_VALUE - alpha_A ) * bg_color[color] ) / new_color.alpha  
                    )
                );
            }

            return new_color;
            
        }
        else return null;

    }

    static set = {

        red( RGBA_color_object = new RGBA() , red_value = 0 ){

            if( RGBA_color_object instanceof RGBA ){

                RGBA_color_object.red = (red_value > RGBA.#RGB_MAX_VALUE) ? RGBA.#RGB_MAX_VALUE: (red_value < RGBA.#RGB_MIN_VALUE) ? RGBA.#RGB_MIN_VALUE : red_value;
                return true;

            }
            return false;
        },

        green( RGBA_color_object = new RGBA() , green_value = 0 ){

            if( RGBA_color_object instanceof RGBA ){

                RGBA_color_object.green = (green_value > RGBA.#RGB_MAX_VALUE) ? RGBA.#RGB_MAX_VALUE: (green_value < RGBA.#RGB_MIN_VALUE) ? RGBA.#RGB_MIN_VALUE : green_value;
                return true;
                
            }
            return false;
        },

        blue( RGBA_color_object = new RGBA() , blue_value = 0 ){

            if( RGBA_color_object instanceof RGBA ){

                RGBA_color_object.blue = (blue_value > RGBA.#RGB_MAX_VALUE) ? RGBA.#RGB_MAX_VALUE: (blue_value < RGBA.#RGB_MIN_VALUE) ? RGBA.#RGB_MIN_VALUE : blue_value;
                return true;
                
            }
            return false;
        },

        alpha( RGBA_color_object = new RGBA() , alpha_value = 0 ){

            if( RGBA_color_object instanceof RGBA ){

                RGBA_color_object.alpha = (alpha_value > RGBA.#ALPHA_MAX_VALUE ) ? RGBA.#ALPHA_MAX_VALUE: (alpha_value < RGBA.#ALPHA_MIN_VALUE) ? RGBA.#ALPHA_MIN_VALUE : alpha_value;
                return true;
                
            }
            return false;
        }

    }

}