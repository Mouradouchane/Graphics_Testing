
import { Point2D , Vector2D } from "./point.js";

/*
    small math library contain functions in this project  
*/

export class MATH{

    // calc the deltha bettween tow values 
    // formula :: a2 - a1
    static Deltha( v1 , v2 ){
        return v2 - v1 ;
    }

    // calc slope of a line bettween to points in 2D space 
    // note : vertical line => slope gonna be high slope not infinity
    // formula :: delta_y / delta_x
    static Slope2D( point_1 = new Point2D() , point_2 = new Point2D() ){

        let delta_x = MATH.Deltha( point_1.x , point_2.x );

        return (delta_x == 0) ? 1000 : MATH.Deltha( point_1.y , point_2.y ) / delta_x ;

    }
    
    // calc the "Y interception" at "X position" in 2D space
    // formula :: y = (slope * x) + b
    static Yintercept2D( 
        x = undefined ,             // x position
        slope = undefined ,         // slope of the line 
        intercept_at_x0 = undefined // y value when x = 0 
    ){

        return ( x * slope ) + intercept_at_x0 ; // y

    }

    // calc the "X interception" at "Y position" in 2D space
    // formula :: x = (y - b) / slope
    static Xintercept2D( 
        y = undefined ,             // y position
        slope = undefined ,         // slope of the line at that point
        Y_at_x0 = undefined         // y value when x = 0 
    ){

        return (y - Y_at_x0) / (slope == 0 ? 1 : slope) ; // x

    }

    // calc the "Y interception" when "X = 0"
    // formula :: Y_intercept = y - (slope * x)
    static Yintercept_At_X0_2D(
        point = new Point2D() ,     // point include x , y
        slope = undefined ,         // slope of the line at that point
    ){

        return point.y - ( slope * point.x );

    }

    // calc the "X interception" when "Y = 0"
    // formula :: x = (y - b) / slope
    static Xintercept_At_Y0_2D(
        slope = undefined,          // slope of the line at that point
        Y_at_x0 = undefined         // y value when x = 0 
    ){

        return MATH.Xintercept2D( 0 , slope , Y_at_x0 );

    }

    // calc distance bettween tow points
    // formula :: distance = sqrt( (x1 - x2)² + (y1 - y2)² )
    static Distance( 
        point_1 = new Point2D() , 
        point_2 = new Point2D() 
    ){

        return Math.sqrt(
            Math.abs(
                ( (point_1.x - point_2.x) ** 2 ) + ( (point_1.y - point_2.y) ** 2 )
            )
        );

    };

    // calc the point intersection bettween tow points in 2D
    // formula :: x = ( (d - c) / ((a - b) | 1) )
    // formula :: y = ( a * ( (d - c) / ((a - b) | 1) ) ) + c
    static TowPointsInterceptAt_2D( 
        point_1 , point_2 , point_1_slope , point_2_slope
    ){
        // calc intercept point of point 1 & 2
        let c = MATH.Yintercept_At_X0_2D( point_1 , point_1_slope );
        // let d = MATH.Yintercept_At_X0_2D( point_2 , point_2_slope );

        let x1 = point_1.x , x2 = point_2.x;
        let y1 = point_1.y , y2 = point_2.y;

        let X = (y2 - y1 + point_1_slope * x1 - point_2_slope * x2) / (point_1_slope - point_2_slope);
        let Y = (X * point_1_slope) + c; 

        // the intersection point
        return new Point2D(
            X , Y
        );

    }

    // get another point on that line using only point and it's slope  
    static Point2DAtLine( 
        point  = undefined , 
        slope  = undefined ,
        distance = undefined ,
    ){

        let Y = MATH.Yintercept_At_X0_2D(point , slope );

        return new Point2D( 
            point.x + distance , 
            ((point.x+distance) * slope) + Y
        );

    }

    // calc the tow normals bettween tow points
    // normal_1 = (-dy ,  dx)
    // normal_2 = ( dy , -dx)
    static Normals2D( point_a = undefined , point_b = undefined ){

        let delta_x = MATH.Deltha( point_a.x , point_b.x );
        let delta_y = MATH.Deltha( point_a.y , point_b.y );

        return {
            n1 : new Point2D( -delta_y ,  delta_x ) ,
            n2 : new Point2D(  delta_y , -delta_x ) ,
        }
    }


    /*
        few functions for 2D triangles
    */

    // formula : X = (a.x + b.x + c.x) / 3 | Y = (a.y + b.y + c.y) / 3
    static Triangle2DCentroid( 
        // points in 2D space
        a = undefined , 
        b = undefined , 
        c = undefined , 
    ){

        return new Point2D(
            (a.x + b.x + c.x) / 3 ,
            (a.y + b.y + c.y) / 3
        );

    };

    // calculate the area of 2D triangle using "Heron's Formula"
    // note : no negative area 
    // formula1 : p = (a+b+c) / 3
    // formula2 : area = sqrt( p * (p - A) * (p - B) * (p - C) )
    static AreaOfTriangle2D(
        point_1 = undefined ,
        point_2 = undefined ,
        point_3 = undefined ,
    ){

        let A = MATH.Distance( point_2 , point_1 );
        let B = MATH.Distance( point_3 , point_2 );
        let C = MATH.Distance( point_3 , point_1 );

        let p = (A+B+C) / 2;

        return Math.abs( 
            Math.sqrt( p * (p - A) * (p - B) * (p - C) ) 
        );

    }


    static IsPointInsideTriangle(
        // point to check if it lies inside traingle 
        target_point = new Point2D() , 
        // a , b , c : area triangle points
        a = new Point2D(), 
        b = new Point2D(),
        c = new Point2D(),
    ){
        let triangle_area = MATH.AreaOfTriangle2D(a,b,c);
        
        let alpha =  MATH.AreaOfTriangle2D(a, target_point , c) / triangle_area;    
        let beta  =  MATH.AreaOfTriangle2D(target_point , b , c) / triangle_area;    
        let gamma =  MATH.AreaOfTriangle2D(a , b , target_point) / triangle_area;    

        /*
          if 3 values bigger than 1 mean the target_point is outside
        */
        return ( (alpha + beta + gamma) < 1 );

    }

    /*
        few functions for 2D vectors/points
    */

    static Add2DPoints( a , b ){ 

        return new Point2D( 
            a.x + b.x ,
            a.y + b.y
        )

    };

    static Add2DVectors( a , b ){ 

        return new Vector2D( 
            a.x + b.x ,
            a.y + b.y
        )

    };

    // note : a - b
    static Sub2DVectors( a , b ){

        return new Vector2D( 
            a.x - b.x ,
            a.y - b.y
        )

    };

    // formula :: (a.x * b.x) + (a.y * a.y) + ... (a.n * b.n)
    static DotProduct2DVectors( a , b ){ 

        return ( a.x * b.x ) + ( a.y * b.y );

    };


    static Vector2DScale( vector , scalar ){ 

        return new Vector2D(
            vector.x * scalar ,
            vector.y * scalar
        );

    };

    // note : length of the vector based on the origin(0,0)
    static Vector2DLength( vector ){ 

        return MATH.Distance( new Vector2D(0,0) , vector );

    };

    // formula :: normalization = vector / vector_length
    static Vector2DNormalaize( vector ){

        let length = MATH.Vector2DLength( vector );

        return new Vector2D(
            (length == 0) ? 0 : vector.x / length ,
            (length == 0) ? 0 : vector.y / length 
        );

    };

    static Vector2DNormalaizeAndScale( vector , scalar = undefined ){

        let n = MATH.Vector2DNormalaize( vector );

        n.x *= scalar;
        n.y *= scalar;

        return n;
    }

}