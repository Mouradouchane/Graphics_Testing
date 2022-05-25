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
        this.scalar = 1;

        this.center = {
            x : 0,
            y : 0,
            z : 0,
        }

        this.set_center = ( x = 0,y = 0,z = 0 ) => {
            this.a = a;
            this.b = b;
            this.c = c;    
        }

        this.set_coordinates = ( x = 0,y = 0,z = 0 ) => {
            this.x = x;
            this.y = y;
            this.z = z;    
        }

        this.set_scalar = ( size = 1 ) => {
            this.scalar = size;
            
            this.a.scalar(size , this.x , this.y , this.z);
            this.b.scalar(size , this.x , this.y , this.z);
            this.c.scalar(size , this.x , this.y , this.z);
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