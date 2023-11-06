import {RGBA} from "../../color.js";
import {Point2D} from "../../point.js";
import {Line2D} from "../../line.js";
import {Curve2D, LongCurve2D} from "../../curve.js";
import {Rectangle2D} from "../../rectangle.js";
import {Triangle2D, Triangle2DGradient} from "../../triangle.js";
import {Generator} from "../../generators.js";
import {Circle2D} from "../../circle.js";
import {Ellipse2D} from "../../ellipse.js";
import {Check} from "../../check.js";
import {Rotate} from "../../rotate.js";
import {Draw} from "../../draw/draw.js";
import {FrameBuffer} from "../../buffers.js";

const Canvas = document.querySelector("#canvas");
const CTX = Canvas.getContext("2d");
const Buffer = new FrameBuffer( 800 , 600 );

var FPS = 0;
var FpsCounter = 0;

/*
    small configuration rendering/drawing/debug
*/
var Config = {

    RenderingLoop : false ,
    DrawGrid : false ,
    DrawPointsForDebug : false ,
    GenerateRandomShapesEachTime : true ,
    NewTestEachTime : false ,
    IntervalTime : 3000 , // ms
    AntiAlias : false ,
    ShapesIndex  : 3 ,
    ShapesAmount : 3 ,
    BorderThickness : 4 ,
    Gradient : false ,
    MaxWidth  : Canvas.clientWidth  / 1.5 ,
    MaxHeight : Canvas.clientHeight / 1.5 ,

    ShowFps : true,
    
}

/*
    generate random "shapes for testing"
*/

var lines = [
    ...Generator.Random.Lines2D(
        Config.ShapesAmount , 0 , Config.MaxWidth , 0 , Config.MaxHeight 
    )
];

var rectangles = [
    ...Generator.Random.Rectangles2D(
        Config.ShapesAmount , 0 , Config.MaxWidth , 0 , Config.MaxHeight , null , true , null , true , 3
    )
]; 

var triangles = [ 
    /*
    new Triangle2DGradient( 
        new Point2D(350, 10) ,
        new Point2D(10 ,500)  ,
        new Point2D(700 , 500)  ,
        // new RGBA(255,0,255,1) , new RGBA(0,255,255,1) , new RGBA(255,255,0,1) ,
        new RGBA(0,0,255,1) , new RGBA(255,0,0,1) , new RGBA(0,255,0,1) ,  
        ),
    */

    new Triangle2D(
        new Point2D(100  , 350) ,
        new Point2D(160  , 240) ,
        new Point2D(630  , 450) ,
        2 , 
        new RGBA(200,100,25,1) ,  
        new RGBA(0,0,255,1) ,
    )

];

var circles = [
    /*
    ...Generator.Random.Circles2D(
        Config.ShapesAmount , 0 , Config.MaxWidth , 0 , Config.MaxHeight , 2 , null , null , true
    ),
    */
    new Circle2D( 250 , 300 , 50 , new RGBA(0,255,0, 0.4) ) ,
    new Circle2D( 300 , 300 , 50 , new RGBA(0,0,255, 0.5) ) ,
    new Circle2D( 270 , 250 , 50 , new RGBA(255,0,0, 0.6) ) ,
];

var ellipses = [
    /*
    ...Generator.Random.Ellipses2D(
        shapes_amount , 0 , max_width , 0 , max_height 
    ),
    */
    new Ellipse2D(250,300, 50,150 , 0   , new RGBA(55,100,80,0.7)   , new RGBA(155,80,208,0.5) , 16) , 
    new Ellipse2D(201,300, 150,50 , 0.1 , new RGBA(105,200,180,0.7) , new RGBA(255,0,180,0.5)  , 16) , 
];

var curves = [
   ...Generator.Random.Curves2D( 1 , 0 , Config.MaxWidth , 0 , Config.MaxHeight , 2 , 1/32 , null , false ) , 
];

var longcurve = new LongCurve2D(
    1/32 , new RGBA(255,0,0,1), 2 ,
    // ...Generator.Random.Points2D(9, 0 , Config.MaxWidth , 0 , Config.MaxHeight)

    new Point2D( 100 , 100 ),
    new Point2D( 290 , 200 ),
    new Point2D( 390 , 300 ),

    new Point2D( 400 , 400 ),

    new Point2D( 500 , 500 ),
    new Point2D( 650 , 400 ),

    new Point2D( 600 , 350 ),

    new Point2D( 500 , 250 ),
    new Point2D( 650 , 200 ),
    new Point2D( 600 , 100 ),

)


Draw.SetCanvas( Canvas );
Draw.SetBuffer( Buffer );
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
                    
                    rectangles = Generator.Random.Rectangles2D(
                        shapes_amount , 0 , max_width , 0, max_height
                    )

                }

            }

        } break;

        // triangles 
        case 3 : {

            for( let triangle of triangles ){

                if( !Config.Gradient ) {
                    Draw.Triangle2D(triangle , true );
                }
                else {
                    Draw.Triangle2DWithGradient(triangle);
                }

                if( Config.DrawPointsForDebug ) Check.VisualCheck.Triangle2D(triangle);

                if( Config.GenerateRandomShapesEachTime ){

                    triangles = Generator.Random.Triangles2D(
                        Config.ShapesAmount , 0 , Config.MaxWidth , 0 , Config.MaxHeight , 0 , new RGBA(150,150,55,0.7) , 0 
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

        // curves 
        case 6 : {

            if( Config.DrawPointsForDebug ) {
                Check.VisualCheck.LongCurve2D( longcurve , true );
            }

            Draw.LongCurve2D(longcurve);


            if(false){
                for( let curve of longcurve.curves ){
                
                    Draw.Curve2D( curve );

                    if( Config.DrawPointsForDebug ) {
                        Check.VisualCheck.Curves2D( curve , true );
                    }

                    if( Config.GenerateRandomShapesEachTime ) {    
                        curves = Generator.Random.Curves2D( 
                            1 , 0 , Config.MaxWidth , 0 , Config.MaxHeight
                            , 2 , 1/32 , null , false 
                        );
                    }

                }
            }

        } break;
        
    } // end of "switch-case"
    
    Draw.RenderBuffer();


}


function ShowFps(){

    CTX.fillStyle = "white";
    CTX.font = "18px serif";
    CTX.fillText(`FPS : ${FPS}` , 5 , 20 );

}

function Render(){
    
    /*
        todo : implement buffer swap !!!!!!!!!!!!!!!!!!!
    */

    if( Config.RenderingLoop ){

        ClearCanvas();
        ClearBuffer();
        NewFrame();

        FpsCounter += 1;

        if(Config.ShowFps) ShowFps();
    
        requestAnimationFrame( Render );

    }

}

function HandleKeys( e ){

    switch(e.code) {

        case "Space" : { // stop rendering loop

            Config.RenderingLoop = false;

        } break;

        case "ShiftLeft" : { // start rendering loop

            Config.RenderingLoop = true;
            Render();

        }
    }

}

(
function main(){

    if( Config.AntiAlias ){    
        CTX.imageSmoothingEnabled = true;
    }
    else {
        CTX.imageSmoothingEnabled = false;
    }

    document.addEventListener("keyup" , HandleKeys );

    if( Config.ShowFps ){

        setInterval( () => {
            FPS = FpsCounter;
            FpsCounter = 0;
        }, 1000 );

    }

    if( Config.RenderingLoop ){

        Render();

    }
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

}
)();


