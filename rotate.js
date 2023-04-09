

/*
    =========== STUFF FOR ROTATION IN 2D,3D ===========
*/

export class rotate {

    /*
        =========== HELPER FUNCTIONS ===========  
    */

    static to_radian ( deg_angle = 0 ){
        return ( deg_angle * Math.PI ) / 180;
    }

    /* need work */
    static to_degree( rad_angle = 0 ){ }

    /* need work */
    static random_x(){ }

    /* need work */
    static random_y(){ }

    static random_z(){
        return ( Math.PI * Math.random() );
    }

    /*
        =========== 2D FUNCTIONS ===========  
    */

    // note : rotation round origin (0,0)
    static x( y = 0 , z = 0 , radian_angle = 0 , round_it = false){

        let cos = Math.cos(radian_angle);
        let sin = Math.sin(radian_angle); 

        return [
            (round_it) ? Math.round((y * cos) + (z * -sin)) : (y * cos) + (z * -sin) , // new Y position
            (round_it) ? Math.round((y * sin) + (z *  cos)) : (y * sin) + (z *  cos)   // new Z position
        ];

    }

    // note : rotation round origin (0,0)
    static y( x = 0 , z = 0 , radian_angle = 0 , round_it = false){

        let cos = Math.cos(radian_angle);
        let sin = Math.sin(radian_angle); 
        
        return [
            (round_it) ? Math.round((x *  cos) + (z * sin)) : (x *  cos) + (z * sin) , // new X position   
            (round_it) ? Math.round((x * -sin) + (z * cos)) : (x * -sin) + (z * cos)   // new Z position
        ];

    }
    
    // note : rotation round origin (0,0)
    static z( x = 0 , y = 0 , radian_angle = 0 , round_it = false){
 
        let cos = Math.cos(radian_angle);
        let sin = Math.sin(radian_angle); 
        
        return [ 
           (round_it) ? Math.round((x * cos) + -(y * sin)) : (x * cos) + -(y * sin) , // new X position
           (round_it) ? Math.round((x * sin) +  (y * cos)) : (x * sin) +  (y * cos)   // new Y position
        ];
 
    }
    
    /*
        =========== 3D FUNCTIONS ===========  
    */
   
}