import {Draw} from "../../draw/draw.js";
import {RGBA} from "../../color.js";
import {Point2D} from "../../point.js";
import {Line2D} from "../../line.js";
import {Rectangle2D} from "../../rectangle.js";
import {Triangle2D, Triangle2DGradient} from "../../triangle.js";
import {generate} from "../../generators.js";
import {Circle2D} from "../../circle.js";
import {Ellipse2D} from "../../ellipse.js";
import {Check} from "../../check.js";
import {Rotate} from "../../rotate.js";
import {CURVE_2D_3_POINTS , CURVE_2D_4_POINTS} from "../../curve.js";
import { FrameBuffer } from "../../buffers.js";

const Canvas = document.querySelector("#canvas");
const CTX = Canvas.getContext("2d");
const Buffer = new FrameBuffer( 800 , 600 );

/*
    small configuration rendering/drawing/debug
*/
var Config = {

    RenderingLoop : false ,
    DrawGrid : false ,
    DrawPointsForDebug : false ,
    NewTestEachTime : false ,
    IntervalTime : 3000 , // ms
    AntiAlias : false ,
    ShapesIndex  : 3 ,
    ShapesAmount : 3 ,
    GenerateRandomShapesEachTime : false ,
    BorderThickness  : 4 ,
    Gradient : true ,
    MaxWidth  : Canvas.clientWidth  / 1.5 ,
    MaxHeight : Canvas.clientHeight / 1.5 ,

}

/*
    generate random "shapes for testing"
*/
var lines = [
    ...generate.random.lines(shapes_amount , 0 , max_width , 0, max_height )
];

var rectangles = [
    ...generate.random.rectangles(shapes_amount , 0 , max_width , 0, max_height , null , true , null , true , 3)
]; 

var triangles = [ 
    /*
    ...generate.random.triangles(2 , 0 , max_width*0.8 , 0 ,max_height*0.8, null , null , new RGBA(255,255,255,0.5) , 1 ),
    new triangle2D( 
        new point2D(100, 200) ,
        new point2D(300, 200) ,
        new point2D(300, 240) ,
        thickness, 0 , 
        new RGBA(0,100,80,0.5) 
    ),
    new triangle2D( 
        new point2D(300 , 200-100) ,
        new point2D(100 , 200-100) ,
        new point2D(300 , 240-100) ,
        thickness, 
        new RGBA(0,100,80,0.5) , 0
    ),
    new triangle2D( 
        new point2D(200, 300) ,
        new point2D(200, 400) ,
        new point2D(100, 300) ,
        thickness, 
        new RGBA(150,100,180,0.5) , 0
    ),
 
    new triangle2D( 
        new point2D(200, 400+110) ,
        new point2D(200, 300+110) ,
        new point2D(100, 300+110) ,
        3 , 
        new RGBA(150,100,180,0.5), new RGBA(255,0,0,0.6) ,
    ),
        
    new triangle2D( 
        new point2D(100, 100) ,
        new point2D(100, 300) ,
        new point2D(300, 300) ,
        1 , 
        new RGBA(150,100,180,0.5) , new RGBA(255,0,0,0.6) ,
    ),

    new triangle2D_gradient( 
        new point2D(600, 300) ,
        new point2D(500, 255) ,
        new point2D(400, 444) ,
        new RGBA(255,0,0,1) , new RGBA(0,255,0,1) , new RGBA(0,0,255,1) ,
    ),

    new triangle2D_gradient( 
        new point2D(150, 150) ,
        new point2D(150, 255) ,
        new point2D(200, 255) ,
        new RGBA(255,0,0,1) , new RGBA(0,255,0,1) , new RGBA(0,0,255,1) ,
    ),

    new triangle2D_gradient( 
        new point2D(450, 150) ,
        new point2D(300, 55)  ,
        new point2D(200, 80)  ,
        new RGBA(255,0,0,1) , new RGBA(0,255,0,1) , new RGBA(0,0,255,1) ,
    ),
*/
        new Triangle2DGradient( 
            new point2D(350, 10) ,
            new point2D(10 ,500)  ,
            new point2D(700 , 500)  ,
            // new RGBA(255,0,255,1) , new RGBA(0,255,255,1) , new RGBA(255,255,0,1) ,
            new RGBA(0,0,255,1) , new RGBA(255,0,0,1) , new RGBA(0,255,0,1) ,  
        ),

];

var circles = [
    //...generate.random.cicrles(shapes_amount , 0 , max_width , 0 , max_height , 2 , null , null , true)
    new circle2D( 250 , 300 , 50 , new RGBA(0,255,0, 0.4) ) ,
    new circle2D( 300 , 300 , 50 , new RGBA(0,0,255, 0.5) ) ,
    new circle2D( 270 , 250 , 50 , new RGBA(255,0,0, 0.6) ) ,
];

var ellipses = [
    // ...generate.random.ellipses(shapes_amount , 0 , max_width , 0 , max_height )
    // new ellipse2D(250,300, 50,150 , 0 , new RGBA(55,100,80,0.7) , new RGBA(155,80,208,0.5) , 16) , 
    new Ellipse2D(201,300, 150,50 , 0.1 , new RGBA(105,200,180,0.7) , new RGBA(255,0,180,0.5) , 16) , 
];


Draw.set_canvas( Canvas );
Draw.set_buffer( Buffer );
Check.Set.Buffer( Buffer );

/*
    render/frame functions
*/
function ClearCanvas(){

    CTX.fillStyle = "rgba(0,0,0,1)";
    CTX.fillRect( 0 , 0 , Canvas.clientWidth , Canvas.clientHeight );

}

function ClearBuffer(){

    Buffer.Clear();

}

function NewFrame(){

    if( Config.Draw ) Draw.DrawGrid();
    
    CTX.fillStyle   = "white";
    CTX.strokeStyle = "white";

    switch( Config.ShapesIndex ){

        // lines
        case 1 : {
                
            for( let line of lines ){

                Draw.line( line );

                if( Config.DrawPointsForDebug ) Check.VisualCheck.Line2D( line );
                
            }

        } break;

        // rectangles
        case 2 : {

            for( let rectangle of rectangles ){

                Draw.Rectangle2D( rectangle ); 
  
                if( Config.DrawPointsForDebug ) Check.VisualCheck.Rectangle2D( rectangle );

                if( Config.GenerateRandomShapesEachTime ){
                    
                    rectangles = generate.random.rectangles(
                        shapes_amount , 0 , max_width , 0, max_height
                    )

                }

            }

        } break;

        // triangles 
        case 3 : {

            for( let triangle of triangles ){

                if( !Config.Gradient ) {
                    Draw.Triangle2D(triangle);
                }
                else {
                    Draw.Triangle2DWithGradient(triangle);
                }

                if( Config.DrawPointsForDebug ) Check.VisualCheck.Triangle2D(triangle);

                if( Config.GenerateRandomShapesEachTime ){

                    triangles = generate.random.triangles(
                        shapes_amount , 0 , max_width/2 , 0, max_height/2 , 0 , new RGBA(150,150,55,0.7) , 0 
                    );

                }

            }
            
        } break;

        // cicrles
        case 4 : {

            for( let circle of circles ){

                Draw.Circle2D( circle );

                if( Config.DrawPointsForDebug ) Check.VisualCheck.Circle2D( circle );
                

            } 

        } break;

        // ellipses
        case 5 : {

            for( let ellipse of ellipses ){
            
                Draw.Ellipse2D( ellipse );

                if( Config.DrawPointsForDebug ) Check.VisualCheck.Ellipse2D( ellipse , true );

            }

        } break;


        
    } // end of "switch-case"
    
    Draw.RenderBuffer();

}


function Render(){
    
    /*
        todo : implement buffer swap !!!!!!!!!!!!!!!!!!!
    */
    ClearCanvas();
    ClearBuffer();
    NewFrame();

    requestAnimationFrame( Render );

}

if( Config.AntiAlias ){    
    CTX.imageSmoothingEnabled = true;
}
else {
    CTX.imageSmoothingEnabled = false;
}


if( Config.RenderingLoop ) Render();
else {
    
    if( Config.NewTestEachTime ){

        setInterval( () => {

            ClearCanvas();
            NewFrame();

        } , Config.IntervalTime );

    }
    else{

        ClearCanvas();
        NewFrame();

    }

}