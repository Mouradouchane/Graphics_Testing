import {mesh} from "./mesh.js"
// =============== rotate functions ===============

// from deg to rad
export function to_radian ( deg_angle = 0 ){
    return ( deg_angle * Math.PI ) / 180;
}


export function rotate_x( angel = 0 , tg = new triangle() , origin = { x : 0 , y : 0 , z : 0} ){
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


export function rotate_y( angel = 0 , tg = new triangle() , origin = { x : 0 , y : 0 , z : 0} ){
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


export function rotate_z( angel = 0 , tg = new triangle() , origin = { x : 0 , y : 0 , z : 0} ){
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

let current_rotate_index = 0;
let rotate_intervals = [];

export function rotate_each_time(
        time_in_ms = 10 , x_angel = 0 , y_angel = 0 , z_angel = 0, 
        origin = new point(),mesh = new mesh()
){

    current_rotate_index += 1;

    rotate_interval.push(

        setInterval((x,y,z,o,m) => {

            for(let trig of m.trigs){
                if(x_angel != 0) rotate_x( x , trig , o);
                if(y_angel != 0) rotate_y( y , trig , o);
                if(z_angel != 0) rotate_z( z , trig , o);
            }

        },time_in_ms , x_angel , y_angel , z_angel , origin , mesh)

    );

    return current_rotate_index;
}


export function stop_rotate( rotate_index ){

    if( rotate_intervals[rotate_index] == null) return false;

    rotate_intervals[rotate_index] = null;
    return true;
}