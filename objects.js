
import {point} from "./point.js"
import {triangle} from "./triangle.js"
import {mesh} from "./mesh.js"


let x = 20, y = 40 , z = -80;
let size = 40;


let shape = new mesh( x , y , z , size );

shape.set_trigs(
    /*
    new triangle(new point(0,0,0) , new point(0,1,0) , new point(1,1,0) , "white"),
    new triangle(new point(0,0,0) , new point(1,0,0) , new point(1,1,0) , "red"),

    new triangle(new point(0,0,-1) , new point(1,0,-1) , new point(1,1,-1) , "yellow"),
    new triangle(new point(0,0,-1) , new point(0,1,-1) , new point(1,1,-1) , "green"),

    new triangle(new point(1,1,0) , new point(1,0,-1) , new point(1,1,-1) , "cyan"),
    new triangle(new point(1,1,0) , new point(1,0,-1) , new point(1,0,0) , "orange"),

    new triangle(new point(0,0,0) , new point(0,0,-1) , new point(0,1,-1) , "pink"),
    */
   new triangle(new point(1,1,-1) , new point(0,1,0) , new point(0,1,-1.5) , "blue"),
);


export {shape};
