import {point} from "./point.js"

export class triangle{

    constructor( a = new point() , b = new point() , c = new point() , color = "white"){
        
        this.x = 0;
        this.y = 0;
        this.z = 0;
        
        this.a = a;
        this.b = b;
        this.c = c;

        this.color = color;

        this.scale_factor = 1;

        this.scale_point_by = ( point = new point() , scale_factor = 1  ) => {
           
            point.x = point.x * scale_factor + this.x;
            point.y = point.y * scale_factor + this.y;
            point.z = point.z * scale_factor + this.z;

        }

        this.scale_triangle_by = ( scale_factor = 1 ) => {
            this.scale_factor = scale_factor;
            
            this.scale_point_by( this.a , this.scale_factor);
            this.scale_point_by( this.b , this.scale_factor);
            this.scale_point_by( this.c , this.scale_factor);
        }

        this.set_coordinates = ( x = 0,y = 0,z = 0 ) => {
            this.x = x;
            this.y = y;
            this.z = z;    
        }

        this.sort = () => {
            let swap = null;

            if(this.a.z < this.b.z){
                swap = this.a;

                this.a = this.b;
                this.b = swap;
            } 

            if(this.a.z < this.c.z){
                swap = this.a;

                this.a = this.c;
                this.c = swap;
            } 


            if(this.b.z < this.c.z){
                swap = this.b;

                this.b = this.c;
                this.c = swap;
            } 
        }
    }
}