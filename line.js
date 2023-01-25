
import { point } from "./point.js";

export class line{

    constructor(point1 = new point() , point2 = new point() , width_by_pixel = 1){

        this.p1 = point1;
        this.p2 = point2;
        this.width = width_by_pixel;

    }

    
    static copy( ln = new line() ) {

        let copy_line = new line( ln.p1.copy() , ln.p2.copy() );

        return copy_line;
    }

}