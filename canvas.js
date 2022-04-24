
class point{
    constructor(x = 0 , y = 0 , z = 0 , w = 0){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

class tirangel{

    constructor( a = new point() , b = new point() , c = new point()){
        this.a = a;
        this.b = b;
        this.c = c;

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
const trig = new tirangel(new point(250,200,1) , new point(300,340,1) , new point(180,300,1))

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

var angel_x = 2;
var angel_z = 1;
var angel_y = -2;

var rotate_each_time = setInterval(() => {
    // debugger
    rotate_x( angel_x , trig , { x : trig.b.x , y : trig.b.y , z : 1 } );
    rotate_z( angel_z , trig , { x : 240 , y : 240 , z : 1});
    rotate_y( angel_y , trig , { x : trig.b.x , y : trig.b.y , z : 1 } );

}, 10);

// =============== FPS ===============
var max_fps = 1000 / 40;
var fps_s = 0;
var fps_ms = false;

var frame_calc = setInterval(() => {
    fps_s = fps_ms;
    fps_ms = 0;
}, 1000);


function render(){

    setTimeout(() =>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // =============== triangle ===============
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(trig.a.x, trig.a.y);
        ctx.lineTo(trig.b.x, trig.b.y);
        ctx.lineTo(trig.c.x, trig.c.y);
        ctx.fill();

        // =============== FPS ===============
        fps_ms += 1;
        ctx.fillStyle = "yellow";
        ctx.font = "20px Tahoma";
        ctx.fillText(`FPS   : ${fps_s}`,20,20);
        ctx.fillStyle = "cyan";
        ctx.fillText(`RAD  : ${Number.parseInt(angel_x)}`,20,40);

        requestAnimationFrame(render);
    } , max_fps);

}

render();