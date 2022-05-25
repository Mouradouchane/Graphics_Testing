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


    static render( CTX , MESH , colors = true , lines = false , points = false , info = false){
        
        //debugger

        // loop over tirangles
        for(let trig of MESH.triangles){

            if(trig != null){
            
                let a = trig.a;
                let b = trig.b;
                let c = trig.c;

                CTX.lineWidth   = 1;
                CTX.fillStyle   = (colors) ? trig.color : "white";
                CTX.strokeStyle = "white";

                CTX.beginPath();
                CTX.moveTo((a.x ) * canvas.width , (a.y ) * canvas.height);
                CTX.lineTo((b.x ) * canvas.width , (b.y ) * canvas.height);
                CTX.lineTo((c.x ) * canvas.width , (c.y ) * canvas.height);
                CTX.lineTo((a.x ) * canvas.width , (a.y ) * canvas.height);
                
                if(lines){

                    CTX.stroke();

                }

                if(colors){

                    CTX.fill();

                }

                
                if(points){
                    mesh.render_coordinates(CTX,"red",a,true,true);
                    mesh.render_coordinates(CTX,"yellow",b,true,true);
                    mesh.render_coordinates(CTX,"cyan",c,true,true);
                }
                else{
                    mesh.render_coordinates(CTX,"red",a,true,false);
                    mesh.render_coordinates(CTX,"yellow",b,true,false);
                    mesh.render_coordinates(CTX,"cyan",c,true,false); 
                }
                
            }

        }
          
    }
    
    static render_coordinates(CTX , color = "pink", point , info = false , points = false){

        let x = ( point.x ) * canvas.width;
        let y = ( point.y ) * canvas.height;
        
        if(info){
            let ndc_x = point.x;
            let ndc_y = point.y;
    
            CTX.font = 'bold 12px serif';
            CTX.fillStyle = color;
            
            CTX.fillText(`x=${ndc_x}`,x+5,y);
            CTX.fillText(`y=${ndc_y}`,x+5,y+20);
            CTX.fillText(`z=${point.z}`,x+5,y+40);
            CTX.fillText(`w=${point.w}`,x+5,y+60);
        }
    
        if(points){
            CTX.fillStyle = "yellow" ;
            CTX.beginPath();
            CTX.arc(x,y,4,0,Math.PI*2);
            CTX.fill(); 
        }
    }
       
}
