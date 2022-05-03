
class point{
    constructor(x = 0 , y = 0 , z = 0 , w = 0){
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
const trig1 = new tirangel(new point(200,300,1) , new point(200,500,1) , new point(400,300,1) , "white");
const trig2 = new tirangel(new point(400,300,1) , new point(200,500,1) , new point(400,500,1) , "red");

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
    rotate_x( angel_x , trig2 , { x : trig2.a.x  , y :trig2.a.y  , z : trig2.a.z } );
    rotate_y( angel_y , trig2 , { x : trig2.c.x  , y :trig2.c.y  , z : trig2.c.z } );

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


function render_trig( CTX = ctx , trig){

    // =============== triangle ===============
    CTX.fillStyle = trig.color;
    CTX.beginPath();
    CTX.moveTo(trig.a.x * fov * aspect_ratio, trig.a.y * fov);
    CTX.lineTo(trig.b.x * fov * aspect_ratio, trig.b.y * fov);
    CTX.lineTo(trig.c.x * fov * aspect_ratio, trig.c.y * fov);
    CTX.fill();
}

let t = 1;
let b = canvas.clientHeight;

let l = 1;
let r = canvas.clientWidth;

let f = -1000;
let n = 1;

let aspect_ratio = canvas.height / canvas.width;
let fov = 1 / Math.tan(to_radian(90/2));
let orth_matrix = [
    //      x               y               z                   w
    [  2 / (r - l)  ,       0       ,       0       , -( (r + l) / (r - l) )],
    [   0           , 2 / (t - b)   ,       0       , -( (t + b) / (t - b) )],
    [   0           ,       0       ,   -2 / (f - n), -( (f + n) / (f - n) )],
    [   0           ,       0       ,       0       ,           1           ] 
];
function orthographic_projection( point = new tirangel(1,1,-1,0)){
    // debugger
    
    point.x = point.x * orth_matrix[0][0] + point.w * orth_matrix[0][3];
    point.y = point.y * orth_matrix[1][1] + point.w * orth_matrix[1][3];
    point.z = point.z * orth_matrix[2][2] + point.w * orth_matrix[2][3];

    point.x = point.x * aspect_ratio * fov;
    point.y = point.y * fov ;
}

let depth = 0.005;
document.addEventListener("keydown" , (e) => {

    if(e.key == "z"){
        trig1.a.z += depth;
        trig1.b.z += depth;
        trig1.c.z += depth;

        orthographic_projection(trig1.a );
        orthographic_projection(trig1.b );
        orthographic_projection(trig1.c );
    } 
    if(e.key == "s") {
        trig1.a.z -= depth;
        trig1.b.z -= depth;
        trig1.c.z -= depth;
        
        orthographic_projection(trig1.a );
        orthographic_projection(trig1.b );
        orthographic_projection(trig1.c );
    }
});

function render(){

    setTimeout(() =>{
        debugger
        // =============== clear ===============
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // =============== triangle ============  

        render_trig(ctx , trig1);
        render_trig(ctx , trig2);

        // =============== FPS =================
        fps_ms += 1;
        ctx.fillStyle = "yellow";
        ctx.font = "20px Tahoma";
        ctx.fillText(`FPS   : ${fps_s}`,20,20);


        requestAnimationFrame(render);
    } , max_fps);

}

render();