import { RGBA } from "./color.js";

/*
    ===================================================
                            2D
    ===================================================
*/
export class point2D{

    constructor(x = 0 , y = 0){

        this.x = (typeof(x) == "number") ? x : 0;
        this.y = (typeof(y) == "number") ? y : 0;

    }

    static copy( POINT = new point2D() ){
        return new point2D(POINT.x, POINT.y);
    }

}

export class point2D_with_color extends point2D{

    constructor( x , y , color = new RGBA() ){
        super( x , y );
        this.color = (color instanceof RGBA) ? color : new RGBA(); // color should be object from RGBA
    }

    static copy( POINT = new point2D_with_color() ){
        return new point2D_with_color(POINT.x , POINT.y , POINT.color);
    }

}


/*
    ===================================================
                            3D
    ===================================================
*/
export class point3D extends point2D{

    constructor( x = 0 , y = 0 , z = 0 ){

        super(x,y);
        this.z = z;

    }

    static copy( POINT = new point3D() ){
        return new point3D(POINT.x, POINT.y , POINT.z);
    }

}

export class point3D_with_color extends point3D{

    constructor(  x = 0 , y = 0 , z = 0 , color = new RGBA()){
        super( x , y , z );
        this.color = (color instanceof RGBA) ? color : new RGBA();
    }

    static copy( POINT = new point3D_with_color() ){
        return new point3D_with_color(POINT.x, POINT.y , POINT.z , POINT.color);
    }

}


/*
    ===================================================
                            4D
    ===================================================
*/
export class point4D extends point3D{

    constructor( x = 0 , y = 0 , z = 0 , w = 1){
        super( x , y , z );
        this.w = w;
    }

    static copy( POINT = new point4D() ){
        return new point4D(POINT.x , POINT.y , POINT.z , POINT.w);
    }

}

export class point4D_with_color extends point4D{

    constructor(  x = 0 , y = 0 , z = 0 , w = 1 , color = new RGBA()){
        super( x , y , z , w );
        this.color = (color instanceof RGBA) ? color : new RGBA();
    }

    static copy( POINT = new point4D_with_color() ){
        return new point4D_with_color(POINT.x, POINT.y , POINT.z , POINT.w , POINT.color);
    }

}