
import { point } from "./point.js";

export class line{

    constructor(point1 = new point() , point2 = new point() ){

        this.p1 = point1;
        this.p2 = point2;

    }

    static copy( ln = new line() ) {

        let cline = new line( ln.p1.copy() , ln.p2.copy() );

        return cline;
    }
}