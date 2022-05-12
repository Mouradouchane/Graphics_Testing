
class point{
    constructor(x = 0 , y = 0 , z = 0 , w = 1){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

class tirangel{

    constructor( a = new point() , b = new point() , c = new point() , color = "white"){
        this.a = a;
        this.b = b;
        this.c = c;
        this.color = color;

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
    }
}

// =============== canvas ===============
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// =============== triangle test ===============
const trig1 = new tirangel(new point(20,30,-100) , new point(20,50,-100) , new point(40,30,-100) , "white");
const trig2 = new tirangel(new point(40,30,-60) , new point(20,50,-60) , new point(40,50,-60) , "red");

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

var rotate_each_time = setInterval(() => {
    // debugger

    //rotate_x( angel_x , trig1 , { x : trig1.a.x  , y :trig1.a.y  , z : trig1.a.z } );
    //rotate_x( angel_x , trig2 , { x : trig2.a.x /2 , y :trig2.a.y /2 , z : trig2.a.z } );
    rotate_y( angel_y , trig2 , { x : 0 , y :0 , z : -100 } );

    //rotate_y( angel_y , trig1 , { x : trig1.c.x  , y :trig1.c.y  , z : trig1.c.z } );
    /*
    rotate_z( angel_y , trig3 , { x : trig3.a.x , y : trig3.a.y , z : trig3.a.z } );
    */
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
    
    let x = (p.x * fov  * aspect_ratio) * canvas.width;
    let y = (p.y * fov) * canvas.height;

    ctx.fillStyle = color;
    CTX.fillText(`x=${x}`,x+5,y);
    CTX.fillText(`y=${y}`,x+5,y+20);
    CTX.fillText(`z=${p.z}`,x+5,y+40);
    CTX.fillText(`w=${p.w}`,x+5,y+60);

    if(render_points){
        ctx.beginPath();
        CTX.arc(x,y,4,0,Math.PI*2);
        ctx.fill(); 
    }
    
}

function render_trig( CTX = ctx , trig , debug = false){

    let a = orthographic_projection(trig.a);
    let b = orthographic_projection(trig.b);
    let c = orthographic_projection(trig.c);

    // =============== triangle ===============
    CTX.fillStyle = trig.color;

    CTX.beginPath();
    CTX.moveTo((a.x * fov * aspect_ratio) * canvas.width , (a.y * fov) * canvas.height);
    CTX.lineTo((b.x * fov * aspect_ratio) * canvas.width , (b.y * fov) * canvas.height);
    CTX.lineTo((c.x * fov * aspect_ratio) * canvas.width , (c.y * fov) * canvas.height);
    CTX.fill();

    if(debug){
        render_coordinates(ctx,"cyan",a,true);
        render_coordinates(ctx,"orange",b,true);
        render_coordinates(ctx,"lightgreen",c,true);
    }

}

let aspect_ratio = canvas.height / canvas.width;
let fov = 1 / Math.tan(to_radian(100/2));

let t = 1;
let b = -1;

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
function orthographic_projection( Point = new point(1,1,-1,0)){
    //debugger
    
    let x = Point.x * orth_matrix[0][0] + Point.w * orth_matrix[0][3];
    let y = Point.y * orth_matrix[1][1] + Point.w * orth_matrix[1][3];
    let z = Point.z * orth_matrix[2][2] + Point.w * orth_matrix[2][3];
    let w = Point.w;

    
    if(Point.z != 0){
        x /= -z;
        y /= -z;

        x = (x + 1) / 2;
        y = (y + 1) / 2;
    }

    return new point(x,y,z,w);
}

let speed = 0.5;
let speed_lr = 1.5;
document.addEventListener("keydown" , (e) => {

    if(e.key == "z"){
        trig2.a.y += speed_lr;
        trig2.b.y += speed_lr;
        trig2.c.y += speed_lr;
    } 
    if(e.key == "s") {
        trig2.a.y -= speed_lr;
        trig2.b.y -= speed_lr;
        trig2.c.y -= speed_lr; 
    }

    if(e.key == "q"){
        trig2.a.x += speed_lr;
        trig2.b.x += speed_lr;
        trig2.c.x += speed_lr;
    } 
    if(e.key == "d") {
        trig2.a.x -= speed_lr;
        trig2.b.x -= speed_lr;
        trig2.c.x -= speed_lr; 
    }

    if(e.key == "e"){
        trig2.a.z += speed;
        trig2.b.z += speed;
        trig2.c.z += speed;
    } 
    if(e.key == "a") {
        trig2.a.z -= speed;
        trig2.b.z -= speed;
        trig2.c.z -= speed; 
    }

});

function render(){

    setTimeout(() =>{
        //debugger
        // =============== clear ===============
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // =============== triangle ============  
        render_trig(ctx , trig1);
        render_trig(ctx , trig2 , true);

        // =============== FPS =================
        fps_ms += 1;
        ctx.fillStyle = "yellow";
        ctx.font = "20px Tahoma";
        ctx.fillText(`FPS   : ${fps_s}`,20,20);

        requestAnimationFrame(render);
    } , max_fps);

}

render();