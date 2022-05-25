import {triangle} from "./triangle.js"

export class mesh{

    constructor( x , y , z , size = 1){
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.size = size;

        this.trigs = [];

        this.set_trigs = ( ...triangles ) => {

            for(let trig of triangles){

                trig.set_coordinates( this.x , this.y , this.z );
                trig.set_scalar( this.size );

                this.trigs.push( trig );

            }
        }

        this.sort = () => {

            for(let trig of this.trigs){
                trig.sort();
            }

            this.trigs.sort(( t , k ) => {
                if( 
                    t.a.z > k.a.z ||
                    t.b.z > k.b.z ||
                    t.c.z > k.c.z 
                ) 
                return true;

                else return false;
            })
        }
    }
}
