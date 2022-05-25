import {triangle} from "./triangle.js"

export class mesh{

    constructor( x , y , z , size = 1){
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.size = size;

        this.triangles = [];

        this.set_triangles = (...triangles ) => {
            
          
            for(let trig of triangles){

                trig.set_coordinates( this.x , this.y , this.z );
                trig.scale( this.size );

                this.triangles.push( trig );

            }
        }

        this.copy = () => {

            let mesh_copy = new mesh(
                this.x,
                this.y,
                this.z,
                this.size
            )
            
            mesh_copy.set_triangles( ...(this.triangles) )

            return mesh_copy;
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
