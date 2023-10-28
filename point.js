
/*
    ===================================================
                            2D
    ===================================================
*/

export class Point2D{

    constructor(x = 0 , y = 0){

        this.x = (typeof(x) == "number" || x instanceof Number ) ? x : 0;
        this.y = (typeof(y) == "number" || y instanceof Number ) ? y : 0;

    }

    static Copy( point = new Point2D() ){
        return new Point2D( Number.parseFloat( point.x ) , Number.parseFloat( point.y ) );
    }

    static Swap( point_a = new Point2D() , point_b = new Point2D() ){

        if( (point_a instanceof Point2D) && (point_b instanceof Point2D) ){

            let temp = new Point2D(point_b.x , point_b.y);

            point_b.x = point_a.x;
            point_b.y = point_a.y;

            point_a.x = temp.x;
            point_a.y = temp.y;

        }

    }

    static Round( point = new Point2D() ){

        if( point instanceof Point2D ){
            point.x = Math.round( point.x );
            point.y = Math.round( point.y );
        }

    }

}

/*
    ===================================================
                            3D
    ===================================================
*/

export class Point3D extends Point2D {

    constructor( x = 0 , y = 0 , z = 0 ){

        super(x,y);
        this.z = z;

    }

    static Copy( point = new Point3D() ){
        return new Point3D( point.x , point.y , point.z );
    }

}

/*
    ===================================================
                            4D
    ===================================================
*/

export class Point4D extends Point3D{

    constructor( x = 0 , y = 0 , z = 0 , w = 1){

        super( x , y , z );
        this.w = w;
        
    }

    static Copy( point = new Point4D() ){
        return new Point4D(point.x , point.y , point.z , point.w);
    }

}
