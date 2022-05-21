
class point{
    constructor(x = 0 , y = 0 , z = 0 , w = 1){

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        this.scalar = ( size = 1 , x , y , z ) => {
            this.x *= size;
            this.y *= size;
            this.z *= size;

            this.x += x;
            this.y += y;
            this.z += z;
        }
    }
}

class tirangel{

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

class meshe{

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

// =============== canvas ===============
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// =============== triangles & shapes ===============
let x = 20, y = 40 , z = -80;
let size = 40;

const shape = new meshe( x , y , z , size );
let pshape = new meshe();

shape.set_trigs(
    new tirangel(new point(0,0,0) , new point(0,1,0) , new point(1,1,0) , "white"),
    new tirangel(new point(0,0,0) , new point(1,0,0) , new point(1,1,0) , "red"),

    new tirangel(new point(0,0,-1) , new point(1,0,-1) , new point(1,1,-1) , "yellow"),
    new tirangel(new point(0,0,-1) , new point(0,1,-1) , new point(1,1,-1) , "green"),

    new tirangel(new point(1,1,0) , new point(1,0,-1) , new point(1,1,-1) , "cyan"),
    new tirangel(new point(1,1,0) , new point(1,0,-1) , new point(1,0,0) , "orange"),

    new tirangel(new point(0,0,0) , new point(0,0,-1) , new point(0,1,-1) , "pink"),
    new tirangel(new point(0,0,0) , new point(0,1,0) , new point(0,1,-1) , "blue"),
);



// =============== rotate functions ===============
function to_radian ( deg_angle = 0 ){
    return ( deg_angle * Math.PI ) / 180;
}

function rotate_x( angel = 0 , tg = new tirangel() , origin = { x : 0 , y : 0 , z : 0} ){
    // debugger
    r_angel = to_radian(angel);

    let cos = Math.cos(r_angel);
    let sin = Math.sin(r_angel); 
    
    let names = ["a","b","c"];

    for(let p of names){
        tg[p].y -= origin.y;
        tg[p].z -= origin.z;
        
        let new_y = (tg[p].y * cos + tg[p].z * -sin);
        let new_z = (tg[p].y * sin + tg[p].z * cos);
        
        tg[p].y = new_y + origin.y;
        tg[p].z = new_z + origin.z;
    }
}

function rotate_y( angel = 0 , tg = new tirangel() , origin = { x : 0 , y : 0 , z : 0} ){
    // debugger
    r_angel = to_radian(angel);

    let cos = Math.cos(r_angel);
    let sin = Math.sin(r_angel); 
    
    let names = ["a","b","c"];

    for(let p of names){
        tg[p].x -= origin.x;
        tg[p].z -= origin.z;
        
        let new_x = (tg[p].x * cos + tg[p].z * sin);
        let new_z = (tg[p].x * -sin + tg[p].z * cos);
        
        tg[p].x = new_x + origin.x;
        tg[p].z = new_z + origin.z;
    }
}


function rotate_z( angel = 0 , tg = new tirangel() , origin = { x : 0 , y : 0 , z : 0} ){
    // debugger
    r_angel = to_radian(angel);

    let cos = Math.cos(r_angel);
    let sin = Math.sin(r_angel); 
    
    let names = ["a","b","c"];

    for(let p of names){
        tg[p].x -= origin.x;
        tg[p].y -= origin.y;
        
        let new_x = (tg[p].x * cos + tg[p].y * -sin);
        let new_y = (tg[p].x * sin + tg[p].y * cos);
        
        tg[p].x = new_x + origin.x;
        tg[p].y = new_y + origin.y;
    }
}

var angel_x = 0.8;
var angel_z = 1;
var angel_y = 0.5;

let r_z_point = new point(40,40,0);
let r_x_point = new point(0,40,-100);

var rotate_each_time = setInterval(() => {
    // debugger
    
    for(let trig of shape.trigs){
        //rotate_x( angel_y , trig , r_x_point );
        //rotate_z( angel_z , trig , r_z_point );
    }
    
}, 10);

// =============== FPS ===============
var max_fps = 1000 / 40;
var fps_s = 0;
var fps_ms = false;

var frame_calc = setInterval(() => {
    fps_s = fps_ms;
    fps_ms = 0;
}, 1000);


function render_coordinates(CTX = ctx , color = "white", p , render_points = false){

    let ndc_x = p.x;
    let ndc_y = p.y;

    let x = ( p.x ) * canvas.width;
    let y = ( p.y ) * canvas.height;

    CTX.font = 'bold 12px serif';
    CTX.fillStyle = color;
    CTX.fillText(`x=${ndc_x}`,x+5,y);
    CTX.fillText(`y=${ndc_y}`,x+5,y+20);
    CTX.fillText(`z=${p.z}`,x+5,y+40);
    CTX.fillText(`w=${p.w}`,x+5,y+60);

    if(render_points){
        CTX.fillStyle = "white";
        CTX.beginPath();
        CTX.arc(x,y,4,0,Math.PI*2);
        CTX.fill(); 
    }
    
}

function render_meshe( CTX = ctx , SHAPE , colors = true , just_line = false , debug = false){


    for(let trig of SHAPE.trigs){

        let a = trig.a;
        let b = trig.b;
        let c = trig.c;

        if(!just_line){

            CTX.fillStyle = (colors) ? trig.color : "white";
            CTX.beginPath();
            CTX.moveTo((a.x ) * canvas.width , (a.y ) * canvas.height);
            CTX.lineTo((b.x ) * canvas.width , (b.y ) * canvas.height);
            CTX.lineTo((c.x ) * canvas.width , (c.y ) * canvas.height);
            CTX.lineTo((a.x ) * canvas.width , (a.y ) * canvas.height);
            CTX.fill();

        }
        else{

            ctx.lineWidth   = 1;
            CTX.strokeStyle = (colors) ? trig.color : "white";

            CTX.beginPath();
            CTX.moveTo((a.x ) * canvas.width , (a.y ) * canvas.height);
            CTX.lineTo((b.x ) * canvas.width , (b.y ) * canvas.height);
            CTX.lineTo((c.x ) * canvas.width , (c.y ) * canvas.height);
            CTX.lineTo((a.x ) * canvas.width , (a.y ) * canvas.height);

            CTX.stroke();

        }
        if(debug){
            render_coordinates(CTX,"red",a,true);
            render_coordinates(CTX,"yellow",b,true);
            render_coordinates(CTX,"cyan",c,true);
        }

    }
}

let aspect_ratio = canvas.height / canvas.width;
let fov = 1 / Math.tan(to_radian(100/2));

let t = -1;
let b = 1;

let l = -1;
let r = 1;

let f = -1;
let n = 1;

let orth_matrix = [
    //      x               y               z                   w
    [  2 / (r - l)  ,       0       ,       0       , -( (r + l) / (r - l) )],
    [   0           , 2 / (t - b)   ,       0       , -( (t + b) / (t - b) )],
    [   0           ,       0       ,   -2 / (f - n), -( (f + n) / (f - n) )],
    [   0           ,       0       ,       0       ,           1           ] 
];

function ortho_calc( Point = new point() ){

    Point.x = Point.x * orth_matrix[0][0] + Point.w * orth_matrix[0][3];
    Point.y = Point.y * orth_matrix[1][1] + Point.w * orth_matrix[1][3];
    Point.z = Point.z * orth_matrix[2][2] + Point.w * orth_matrix[2][3];
    Point.w = Point.w;



    return Point;
    
}

function orthographic_projection( SHAPE = new meshe() ){
    //debugger
    let points = ['a','b','c'];

    for(let trig of SHAPE.trigs){
        
        // normalize values to NDC -1 0 1 
        trig.a = ortho_calc(trig.a);
        trig.b = ortho_calc(trig.b);
        trig.c = ortho_calc(trig.c);
        

        for(let p = 0 ; p < 3 ; p += 1){

            // perspective divide
            if(trig[points[p]].z != 0){

                trig[points[p]].x /= -trig[points[p]].z;
                trig[points[p]].y /= -trig[points[p]].z;
                
                // clipping check
                
                if( trig[points[p]].x < l ) console.warn("left" , trig[points[p]].x );
                if( trig[points[p]].x > r ) console.warn("right", trig[points[p]].x );
                
                if( trig[points[p]].y < t ) console.warn("top"   , trig[points[p]].y );
                if( trig[points[p]].y > b ) console.warn("buttom", trig[points[p]].y );
                if( trig[points[p]].z > n ) console.warn("near"  , trig[points[p]].z );
                


                // go to canonical space between 0 - 1
                trig[points[p]].x = (trig[points[p]].x + 1) / 2;
                trig[points[p]].y = (trig[points[p]].y + 1) / 2;

            }
        }


    }

    return SHAPE;
}

let speed = 0.4;
let speed_lr = 0.4;

document.addEventListener("keydown" , (e) => {

    if(e.key == "z"){

        for(let trig of shape.trigs){
            trig.a.y += speed_lr;
            trig.b.y += speed_lr;
            trig.c.y += speed_lr;
        }
        
    } 
    if(e.key == "s") {

        for(let trig of shape.trigs){
            trig.a.y -= speed_lr;
            trig.b.y -= speed_lr;
            trig.c.y -= speed_lr;
        }

    }

    if(e.key == "q"){

        for(let trig of shape.trigs){
            trig.a.x += speed_lr;
            trig.b.x += speed_lr;
            trig.c.x += speed_lr;
        }

    } 
    if(e.key == "d") {

        for(let trig of shape.trigs){
            trig.a.x -= speed_lr;
            trig.b.x -= speed_lr;
            trig.c.x -= speed_lr;
        }
    }

    if(e.key == "e"){

        for(let trig of shape.trigs){
            trig.a.z += speed;
            trig.b.z += speed;
            trig.c.z += speed;
        }

    } 
    if(e.key == "a") {

        for(let trig of shape.trigs){
            trig.a.z -= speed;
            trig.b.z -= speed;
            trig.c.z -= speed;
        }

    }

    pshape = orthographic_projection(JSON.parse(JSON.stringify(shape)));

});

pshape = orthographic_projection(JSON.parse(JSON.stringify(shape)));

function render(){

    setTimeout(() =>{
        //debugger
        // =============== clear ===============
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        shape.sort();
        // =============== triangle ============  
        render_meshe(ctx , pshape , false , true , true );

        // =============== FPS =================
        fps_ms += 1;
        ctx.fillStyle = "yellow";
        ctx.font = "20px Tahoma";
        ctx.fillText(`FPS   : ${fps_s}`,20,20);

        requestAnimationFrame(render);
    } , max_fps);

}

render();