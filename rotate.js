

export class rotate {

    static to_radian ( deg_angle = 0 ){
        return ( deg_angle * Math.PI ) / 180;
    }

    static to_degree( rad_angle = 0 ){

    }
    
    // note : rotation round origin (0,0,0)
    static x( y = 0 , z = 0 , radian_angle = 0 ){

        let cos = Math.cos(radian_angle);
        let sin = Math.sin(radian_angle); 

        let new_y = (tg[p].y * cos + tg[p].z * -sin);
        let new_z = (tg[p].y * sin + tg[p].z * cos);
        

        return [
            ( y * cos ) + ( z * -sin ),   // new Y position
            ( y * sin ) + ( z *  cos )    // new Z position
        ];

    }

    // note : rotation round origin (0,0,0)
    static y( x = 0 , z = 0 , radian_angle = 0 ){

        let cos = Math.cos(radian_angle);
        let sin = Math.sin(radian_angle); 
        
        return [
            (x *  cos) + (z * sin) ,    // new X position   
            (x * -sin) + (z * cos)      // new Z position
        ];

    }

    // note : rotation round origin (0,0,0)
    static z( x = 0 , y = 0 , radian_angle = 0 ){

        let cos = Math.cos(radian_angle);
        let sin = Math.sin(radian_angle); 
        
        return [ 
            (x * cos) + -(y * sin) ,    // new X position
            (x * sin) +  (y * cos)      // new Y position
        ];

    }

    static random_x(){

    }

    static random_y(){
        
    }
    static random_z(){
        return ( Math.PI * Math.random() );
    }

    /*
    static rotate_each_time(
            time_in_ms = 10 , x_angel = 0 , y_angel = 0 , z_angel = 0, 
            origin = new point(),mesh = new mesh()
    ){

        current_rotate_index += 1;

        rotate_interval.push(

            setInterval((x,y,z,o,m) => {

                for(let trig of m.trigs){
                    if(x_angel != 0) rotate_x( x , trig , o);
                    if(y_angel != 0) rotate_y( y , trig , o);
                    if(z_angel != 0) rotate_z( z , trig , o);
                }

            },time_in_ms , x_angel , y_angel , z_angel , origin , mesh)

        );

        return current_rotate_index;
    }

    static stop_rotate( rotate_index ){

        if( rotate_intervals[rotate_index] == null) return false;

        rotate_intervals[rotate_index] = null;
        return true;
    }
    */

}