

/*
    =========== 2D/3D Rotations ===========

    todo : move all of this to math moduel

*/

export class Rotate {

    /*
        =========== HELPER FUNCTIONS ===========  
    */

    static ToRadian ( deg_angle = 0 ){
        return ( deg_angle * Math.PI ) / 180;
    }

    /* need work */
    static ToDegree( rad_angle = 0 ){ }

    /* need work */
    static RandomAroundX(){ 

    }

    /* need work */
    static RandomAroundY(){ 

    }

    static RandomAroundZ(){
        return ( Math.PI * Math.random() );
    }

    /*
        =========== 2D FUNCTIONS ===========  
    */

    // note : rotation round origin (0,0)
    static X( y = 0 , z = 0 , radian_angle = 0 , round_output = false){

        let cos = Math.cos(radian_angle);
        let sin = Math.sin(radian_angle); 

        return [
            (round_output) ? Math.round((y * cos) + (z * -sin)) : (y * cos) + (z * -sin) , // new Y position
            (round_output) ? Math.round((y * sin) + (z *  cos)) : (y * sin) + (z *  cos)   // new Z position
        ];

    }

    // note : rotation round origin (0,0)
    static Y( x = 0 , z = 0 , radian_angle = 0 , round_output = false){

        let cos = Math.cos(radian_angle);
        let sin = Math.sin(radian_angle); 
        
        return [
            (round_output) ? Math.round((x *  cos) + (z * sin)) : (x *  cos) + (z * sin) , // new X position   
            (round_output) ? Math.round((x * -sin) + (z * cos)) : (x * -sin) + (z * cos)   // new Z position
        ];

    }
    
    // note : rotation round origin (0,0)
    static Z( x = 0 , y = 0 , radian_angle = 0 , round_output = false){
 
        let cos = Math.cos(radian_angle);
        let sin = Math.sin(radian_angle); 
        
        return [ 
           (round_output) ? Math.round((x * cos) + -(y * sin)) : (x * cos) + -(y * sin) , // new X position
           (round_output) ? Math.round((x * sin) +  (y * cos)) : (x * sin) +  (y * cos)   // new Y position
        ];
 
    }
    
    /*
        =========== 3D FUNCTIONS ===========  
    */
    
    /* need work :) */

}