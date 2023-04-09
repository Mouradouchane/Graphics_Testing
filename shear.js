

/*
    ========= STUFF FOR SHEARING IN 2D,3D =========
*/
export class shear {

    /*
        ========= 2D FUNCTIONS =========
    */

    static x( x = 0 , y = 0 , shear_value = 0 , round_it = false){ 

        return (round_it) ? Math.round( x + shear_value * y ) : ( x + shear_value * y ) ;

    }

    static y( x = 0 , y = 0 , shear_value = 0 , round_it = false){ 

        return (round_it) ? Math.round( y + shear_value * x ) : ( y + shear_value * x ) ;

    }

    /*
        ========= 3D FUNCTIONS =========
    */
   
    /* need work */
    static z(){ }

}