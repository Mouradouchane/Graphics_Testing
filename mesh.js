import {triangle} from "./triangle.js"

export class mesh{

    constructor( x , y , z , size = 1 , ...triangles){
        
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.size = size;

        this.triangles = [];

        for(let trig of triangles){
            let copy_trig = new triangle(trig.a.copy(),trig.b.copy(),trig.c.copy(),trig.color);
            this.triangles.push(copy_trig);
        }

        this.set_triangles = ( ...triangles ) => {
            
          
            for(let trig of triangles){

                trig.set_coordinates( this.x , this.y , this.z );
                trig.scale_triangle_by( this.size );

                this.triangles.push( trig );

            }
        }

        this.copy = () => {

            return new mesh(
                this.x,
                this.y,
                this.z,
                this.size,
                ...(this.triangles)
            );
        }

        this.sort = () => {

            for(let trig of this.triangles){
                trig.sort();
            }

            this.triangles.sort(( t , k ) => {
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
