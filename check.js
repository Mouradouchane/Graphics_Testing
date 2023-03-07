
// import {RGBA} from "../../color.js";
import {line as LINE_2D} from "./line.js";
import {point2D as POINT_2D} from "./point.js";
import {rectangle as RECTANGLE} from "./rectangle.js";
import {triangle2D as TRIANGLE_2D} from "./triangle.js";
import {circle2D as CIRCLE_2D} from "./circle.js";
import {ellpise2D as ELLIPSE_2D} from "./ellipse.js";
import {rotate} from "./rotate.js";

/*
    ============================================================
        class for testing/checking "functions" for draw api
    ============================================================
*/
export class check {

    static #LOG = {

        ERROR : {
            CANVAS_INVALID : () => console.error("received parameter as canvas are invalid , send a real canvas !"),
            CANVAS_NOT_DEFINED : () => console.error("canvas not defined yet to draw in"),

            BUFFER_INVALID : () => console.error("received parameter as buffer are invalid , send a real buffer or a supported buffer type !"),
            BUFFER : () => console.error("buffer not defined yet to draw in"),
            
            OBJECT_INVALID : (fn_name = "def" , needed_type = "object") => console.error(`received parameter in function ${fn_name} is not a valid type ${needed_type}`)
        },

        WARN : {

        },

        HINT : {
            
            DEFINE_CANVAS : () =>{
                console.info("use check.set.canvas and pass your 'canvas dom' as parameter !");
            },
            
            DEFINE_THIS : ()=> {
                console.info(" ");
            },

            DEFINE_BUFFER : () =>{
                console.info("use check.set.buffer and pass your 'buffer obj' as parameter !");
            },
            
            USE_THIS_TYPE_TO_THIS_FUNCTION : ( fn_name = "def" , typename = "object") => {
                console.info(`when you use function '${fn_name}' pass a valid parameter from type '${typename}'`);
            },
        },

    }

    // needed stuff to work with 
    // note : we don't need everything !
    static #NEEDED = {

        buffer : undefined ,
        canvas : undefined , 
        ctx : undefined ,

        copy_objects_for_testing : false,

        default_point_size  : 2 ,
        default_point_color : "cyan" ,
        default_line_color  : "yellow" ,

    }


    /*
        =============================================================
                        PUBLIC FUNCTION TO USE
        =============================================================
    */

    static set = {

        canvas : ( canvas_object = undefined ) => {
    
            if( canvas_object && canvas_object.tagName == "CANVAS" ){

                check.#NEEDED.canvas = canvas_object;
                check.#NEEDED.ctx = check.#NEEDED.canvas.getContext("2d");
    
            }
            else{
                check.#LOG.ERROR.CANVAS_INVALID();
                check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.set.canvas" , "canvas dom");
            } 
    
        },
        
        buffer : () => {
    
        }

    }

    // NOTE  : currently support only cavnas !
    // to-do : add support to buffer's
    static visual_check = {  

        point : function( point_object = new POINT_2D() , point_size = undefined , str_color = undefined){
    
            if( check.#NEEDED.canvas ){

                let ctx =  check.#NEEDED.ctx;
                let psize = (point_size) ? point_size : check.#NEEDED.default_point_size;

                if( point_object instanceof POINT_2D){

                    ctx.fillStyle = (str_color) ? str_color : check.#NEEDED.default_point_color ;

                    ctx.beginPath();
                    ctx.arc(point_object.x, point_object.y, psize , 0 , Math.PI * 2);
                    ctx.fill();

                }
                else {
                    check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.point" , "point2D");
                    check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.point" , "point2D");
                }

            }
            else {
                check.#LOG.ERROR.CANVAS_NOT_DEFINED();
                check.#LOG.HINT.DEFINE_CANVAS();
            }

        },
        
        line : function( line_object = new LINE_2D() , point_size = undefined ){

            if( check.#NEEDED.canvas ){

                if( line_object instanceof LINE_2D ){
                
                    let ctx =  check.#NEEDED.ctx;
    
                    ctx.fillStyle = check.#NEEDED.default_line_color;
            
                    ctx.beginPath();
                    ctx.arc(line_object.p1.x, line_object.p1.y, point_size , 0, Math.PI * 2);
                    ctx.arc(line_object.p2.x, line_object.p2.y, point_size , 0, Math.PI * 2);
                    ctx.fill();

                }   
                else {
                    check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.line" , "line2D");
                    check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.line" , "line2D");
                }

            }
            else {
                check.#LOG.ERROR.CANVAS_NOT_DEFINED();
                check.#LOG.HINT.DEFINE_CANVAS();
            }

        },
        
        rectangle : function( rectangle_object = new RECTANGLE() , point_size = undefined ){

            if( check.#NEEDED.canvas ){

                if( rectangle_object instanceof RECTANGLE ){
            
                    let ctx =  check.#NEEDED.ctx;

                    let x = rectangle_object.position.x;
                    let y = rectangle_object.position.y;
                    let w = rectangle_object.width;
                    let h = rectangle_object.height;
            
                    ctx.fillStyle = check.#NEEDED.default_line_color;
                    ctx.beginPath();
                    ctx.arc( x , y , point_size , 0 , Math.PI * 2);
                    ctx.fill();
            
                    ctx.beginPath();
                    ctx.arc( x+w , y , point_size , 0 , Math.PI * 2);
                    ctx.fill();
                
                    ctx.beginPath();
                    ctx.arc( x , y+h , point_size , 0 , Math.PI * 2);
                    ctx.fill();
            
                    ctx.beginPath();
                    ctx.arc( x+w , y+h , point_size , 0 , Math.PI * 2);
                    ctx.fill();

                }   
                else {
                    check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.rectangle" , "rectangle2D");
                    check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.rectangle" , "rectangle2D");
                }

            }
            else {
                check.#LOG.ERROR.CANVAS_NOT_DEFINED();
                check.#LOG.HINT.DEFINE_CANVAS();
            }
    
        },
        
        triangle : function( triangle_object = new TRIANGLE_2D() ){

            if( check.#NEEDED.canvas ){

                if( triangle_object instanceof TRIANGLE_2D ){

                    check.visual_check.point( triangle_object.a );
                    check.visual_check.point( triangle_object.b );
                    check.visual_check.point( triangle_object.c );
                    
                }
                else {
                    check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.triangle" , "triangle2D");
                    check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.triangle" , "triangle2D");
                }
                
            }
            else {
                check.#LOG.ERROR.CANVAS_NOT_DEFINED();
                check.#LOG.HINT.DEFINE_CANVAS();
            }

        },
        
        circle : function( circle_object = new CIRCLE_2D() ){

            if( check.#NEEDED.canvas ){

                if( circle_object instanceof CIRCLE_2D ){

                    check.visual_check.point( new POINT_2D(circle_object.x , circle_object.y) );
                    check.visual_check.point( new POINT_2D(circle_object.x , circle_object.y + circle_object.r) );

                }
                else {
                    check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.circle" , "circle2D");
                    check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.circle" , "circle2D");
                }

            }
            else {
                check.#LOG.ERROR.CANVAS_NOT_DEFINED();
                check.#LOG.HINT.DEFINE_CANVAS();
            }

        },

        ellipse : function( ellipse_object = new ELLIPSE_2D()){
            
            if( check.#NEEDED.canvas ){

                if( ellipse_object instanceof ELLIPSE_2D ){

                    let reflected_values = [
                        { X : 0, Y : 0 , color : "white"} ,
                        { X :  ellipse_object.width , Y : 0 , color : "lightgreen"},
                        { X : -ellipse_object.width , Y : 0 , color : "lightgreen"},
                        { X : 0 , Y :  ellipse_object.height , color : "red"},
                        { X : 0 , Y : -ellipse_object.height , color : "red"},
                    ];

                    for( let reflected of reflected_values ){
                    
                        let rt = rotate.z( reflected.X , reflected.Y , ellipse_object.angle );

                        check.visual_check.point( 
                            new POINT_2D( rt[0] + ellipse_object.x , rt[1] + ellipse_object.y ) , undefined , reflected.color 
                        );

                    }

                }
                else {
                    check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.ellipse" , "ellipse2D");
                    check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.ellipse" , "ellipse2D");
                }

            }
            else {
                check.#LOG.ERROR.CANVAS_NOT_DEFINED();
                check.#LOG.HINT.DEFINE_CANVAS();
            }

        }
    }
    

}