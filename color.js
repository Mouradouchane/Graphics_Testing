
export class RGBA{

    // macros for RGBA class usage
    static #RGB_MAX_VALUE = 255;
    static #RGB_MIN_VALUE = 0;
    static #ALPHA_MIN_VALUE = 0;
    static #ALPHA_MAX_VALUE = 1;

    
    constructor( 
            red = 255, green = 255 , blue = 255 , alpha = 1 
    ) {

        // filter values

        this.red   = (red   > RGBA.#RGB_MAX_VALUE) ? RGBA.#RGB_MAX_VALUE : (red   < RGBA.#RGB_MIN_VALUE) ? RGBA.#RGB_MIN_VALUE : red;
        this.green = (green > RGBA.#RGB_MAX_VALUE) ? RGBA.#RGB_MAX_VALUE : (green < RGBA.#RGB_MIN_VALUE) ? RGBA.#RGB_MIN_VALUE : green;
        this.blue  = (blue  > RGBA.#RGB_MAX_VALUE) ? RGBA.#RGB_MAX_VALUE : (blue  < RGBA.#RGB_MIN_VALUE) ? RGBA.#RGB_MIN_VALUE : blue;

        this.alpha = (alpha > RGBA.#ALPHA_MAX_VALUE) ? RGBA.#ALPHA_MAX_VALUE : (alpha < RGBA.#ALPHA_MIN_VALUE) ? RGBA.#ALPHA_MIN_VALUE : alpha;

    }
    
    static ToString( rgba_object = new RGBA() ) {

        if(rgba_object instanceof RGBA){

            return `rgba(${rgba_object.red},${rgba_object.green},${rgba_object.blue},${rgba_object.alpha})`;
        
        }
        else return null;

    }

    static ToHexa( rgba_object = new RGBA() ) {

        if(rgba_object instanceof RGBA){

            return `#${rgba_object.red.toString(16)}${rgba_object.green.toString(16)}${rgba_object.blue.toString(16),rgba_object.alpha}`;
        
        }
        else return null;

    }

    static Blend( fg_color = new RGBA() , bg_color = new RGBA() ){

        if( fg_color instanceof RGBA && bg_color instanceof RGBA ){
            
            if( fg_color.alpha <= 0 ) return bg_color;
            if( bg_color.alpha <= 0 ) return fg_color;

            // else => blend color a with b

            let new_color = new RGBA(); // new color 
            
            // solve for "a" alpha first
            // alpha's formula : a = af + ( 1 - af ) * ab
            
            let alpha_A = fg_color.alpha; // af
            let alpha_B = bg_color.alpha; // ab

            new_color.alpha = alpha_A + ( 1 - alpha_A ) * alpha_B; // a

            // blend colors

            /* ================ blend formula ====================
                    af * cf + ( 1 - af ) * cb 
                c = _______________________________
                                a
            */
 
            new_color.red = Math.round( 
                ( alpha_A * fg_color.red   + ( 1 - alpha_A ) * bg_color.red  )  / new_color.alpha 
            );
            new_color.green = Math.round(
                ( alpha_A * fg_color.green + ( 1 - alpha_A ) * bg_color.green ) / new_color.alpha 
            );

            new_color.blue = Math.round( 
                ( alpha_A * fg_color.blue  + ( 1 - alpha_A ) * bg_color.blue )  / new_color.alpha 
            );

            return new_color;
            
        }
        else return null;

    }

    static RandomColor( random_alpha = false){

        return new RGBA(
            Math.floor( Math.random() * 255 ), 
            Math.floor( Math.random() * 255 ),
            Math.floor( Math.random() * 255 ),
            (random_alpha) ? Math.random() : 1
        );

    }

    static Copy( rgba_object = new RGBA() ){

        if( rgba_object instanceof RGBA ){
            return new RGBA( 
                Number.parseInt(rgba_object.red) , 
                Number.parseInt(rgba_object.green) , 
                Number.parseInt(rgba_object.blue) , 
                Number.parseFloat(rgba_object.alpha) 
            );
        }
        else return null;

    }

    static ChangeByFactor( rgba_color = new RGBA() , factor_value = 1 ){

        if(rgba_color instanceof RGBA ){

            let new_color = new RGBA( 
                rgba_color.red   * factor_value , 
                rgba_color.green * factor_value , 
                rgba_color.blue  * factor_value ,
                rgba_color.alpha * factor_value
            );

            return new_color;

        }
        else return null;

    }

}