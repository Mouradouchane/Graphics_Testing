
import {RGBA} from "../../color.js";
import {Point2D} from "./point.js";
import {Line2D} from "./line.js";
import {Draw} from "../draw/draw.js";
import {Rectangle2D} from "./rectangle.js";
import {Triangle2D} from "./triangle.js";
import {Circle2D} from "./circle.js";
import {Ellipse2D} from "./ellipse.js";
import {Rotate} from "./rotate.js";
import {FrameBuffer} from "./buffers.js";
import {Curve2D , LongCurve2D} from "./curve.js";

/*
    ============================================================
            FOR VISUAL "TESTING / CHECKING" RESULT 
    ============================================================
*/
export class Check {

    static #LOG = {

        ERROR : {
            CANVAS_INVALID : () => console.error("received parameter as canvas are invalid , send a real canvas !"),
            CANVAS_NOT_DEFINED : () => console.error("canvas not defined yet to draw in"),

            BUFFER_INVALID : () => console.error("received parameter as buffer are invalid , send a real buffer or a supported buffer type !"),
            BUFFER_NOT_DEFINED : () => console.error("buffer not defined yet to draw in"),
            
            OBJECT_INVALID : (fn_name = "def" , needed_type = "object") => console.error(`received parameter in function ${fn_name} is not a valid type ${needed_type}`),
            NO_RESOURCE_FOR_DRAW : (fn_name = "def") => console.error(`no canvas or buffer found for drawing , function ${fn_name} .`),
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

    // some resources to work with 
    static #RESOURCES = {

        buffer : undefined ,
        canvas : undefined , 
        ctx : undefined ,
        
        draw_direct_to_canvas : true,
        copy_objects_for_testing : false,

        default_point_size  : 2 ,
        default_point_color : new RGBA(255,0,160,1) ,
        default_line_color  : new RGBA(255,255,255,1) ,

    }

    /*
        =============================================================
                        PUBLIC FUNCTION TO USE
        =============================================================
    */

    static Set = {

        Canvas : ( canvas_object = undefined ) => {
    
            if( canvas_object && canvas_object.tagName == "CANVAS" ){

                Check.#RESOURCES.canvas = canvas_object;
                Check.#RESOURCES.ctx = Check.#RESOURCES.canvas.getContext("2d");
    
            }
            else{
                Check.#LOG.ERROR.CANVAS_INVALID();
                Check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.set.canvas" , "canvas dom");
            } 
    
        },
        
        Buffer : ( buffer_object = undefined ) => {
            
            if( buffer_object instanceof FrameBuffer ){

                Check.#RESOURCES.buffer = buffer_object;
                
            }
            else {

                Check.#LOG.ERROR.BUFFER_INVALID();
                Check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.set.buffer" , "frame_buffer");

            }

        }

    }

    /*
        NOTE : currently support only frame_buffer !!!!!!!!
    */
    static VisualCheck = {  

        Point2D : function( point = new Point2D() , point_radius = undefined , color = undefined ){
            
            let check_buffer = Check.#RESOURCES.buffer instanceof FrameBuffer;
            let check_canvas = Check.#RESOURCES.canvas;
            let check_type   =  point instanceof Point2D;

            if( check_buffer || check_canvas ){
                
                if( check_type ){
                    
                    color = (color) ? color : Check.#RESOURCES.default_point_color;
                    let psize = (point_radius) ? point_radius : Check.#RESOURCES.default_point_size;

                    Draw.Circle2D( new Circle2D( point.x , point.y , psize , color ) );

                }
                else {

                    Check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.point" , "point2D");
                    Check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.point" , "point2D");
                
                }
                
            }

            if( !check_buffer && !check_canvas ){
                Check.#LOG.NO_RESOURCE_FOR_DRAW( "check.visual_check" );
            }
            
        },
        
        Line2D  : function( line  = new Line2D()  , point_radius = undefined , color = undefined ){
 
            let check_buffer = Check.#RESOURCES.buffer instanceof FrameBuffer;
            let check_canvas = Check.#RESOURCES.canvas;
            let check_type   =  line instanceof Line2D ;

            if( check_buffer || check_canvas ){

                if( check_type ){
                
                    Check.VisualCheck.Point2D( line.a , point_radius , color);
                    Check.VisualCheck.Point2D( line.b , point_radius , color);
                
                }   
                else {
                    Check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.line" , "line2D");
                    Check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.line" , "line2D");
                }

            }

            if( !check_buffer && !check_canvas ){
                Check.#LOG.NO_RESOURCE_FOR_DRAW( "check.visual_check" );
            }

        },
        
        Rectangle2D : function( rectangle = new Rectangle2D() , point_radius = undefined , color = undefined){
            
            let check_buffer = Check.#RESOURCES.buffer instanceof FrameBuffer;
            let check_canvas = Check.#RESOURCES.canvas;
            let check_type   =  rectangle instanceof RECTANGLE ;

            if( check_buffer || check_canvas ){

                if( check_type ){

                    let x = rectangle.position.x;
                    let y = rectangle.position.y;
                    let w = rectangle.width;
                    let h = rectangle.height;
                    
                    Check.VisualCheck.Point2D( new Point2D( x , y )     , point_radius , color );
                    Check.VisualCheck.Point2D( new Point2D( x+w , y )   , point_radius , color );
                    Check.VisualCheck.Point2D( new Point2D( x  , y+h )  , point_radius , color );
                    Check.VisualCheck.Point2D( new Point2D( x+w , y+h ) , point_radius , color );

                }   
                else {
                    Check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.rectangle" , "rectangle2D");
                    Check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.rectangle" , "rectangle2D");
                }

            }

            if( !check_buffer && !check_canvas ){
                Check.#LOG.NO_RESOURCE_FOR_DRAW( "check.visual_check" );
            }
    
        },
        
        Triangle2D : function( triangle = new Triangle2D() , point_radius = undefined , color = undefined ){

            let check_buffer = Check.#RESOURCES.buffer instanceof FrameBuffer;
            let check_canvas = Check.#RESOURCES.canvas;
            let check_type   = triangle instanceof Triangle2D ;

            if( check_buffer || check_canvas ){

                if( check_type ){

                    Check.VisualCheck.Point2D( triangle.a , point_radius , color );
                    Check.VisualCheck.Point2D( triangle.b , point_radius , color );
                    Check.VisualCheck.Point2D( triangle.c , point_radius , color );
                    
                }
                else {
                    Check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.triangle" , "triangle2D");
                    Check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.triangle" , "triangle2D");
                }
                
            }
            
            if( !check_buffer && !check_canvas ){
                Check.#LOG.NO_RESOURCE_FOR_DRAW( "check.visual_check" );
            }

        },
        
        Circle2D  : function( circle = new Circle2D() , point_radius = undefined , color = undefined ){

            let check_buffer = Check.#RESOURCES.buffer instanceof FrameBuffer;
            let check_canvas = Check.#RESOURCES.canvas;
            let check_type   =  circle instanceof Circle2D ;

            if( check_buffer || check_canvas ){

                if( check_type ){

                    Check.VisualCheck.Point2D( new Point2D(circle.x , circle.y) , point_radius , color );
                    Check.VisualCheck.Point2D( new Point2D(circle.x , circle.y + circle.r) , point_radius , color );

                }
                else {
                    Check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.circle" , "Circle2D");
                    Check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.circle" , "Circle2D");
                }

            }

            if( !check_buffer && !check_canvas ){
                Check.#LOG.NO_RESOURCE_FOR_DRAW( "check.visual_check" );
            }

        },

        Ellipse2D : function( ellipse = new Ellipse2D() , show_foci = false , point_radius = undefined , color = undefined){
            
            let check_buffer = Check.#RESOURCES.buffer instanceof FrameBuffer;
            let check_canvas = Check.#RESOURCES.canvas;
            let check_type   = ellipse instanceof Ellipse2D;

            if(  check_buffer || check_canvas  ){

                if( check_type ){

                    let reflected_values = [
                        { X : 0, Y : 0 , color : "white"} ,
                        { X :  ellipse.width , Y : 0 , color : "lightgreen"},
                        { X : -ellipse.width , Y : 0 , color : "lightgreen"},
                        { X : 0 , Y :  ellipse.height , color : "red"},
                        { X : 0 , Y : -ellipse.height , color : "red"},
                    ];

                    for( let reflected of reflected_values ){
                    
                        let rt = Rotate.Z( reflected.X , reflected.Y , ellipse.angle );

                        Check.VisualCheck.Point2D( 
                            new Point2D( rt[0] + ellipse.x , rt[1] + ellipse.y ) , point_radius , color
                        );

                    }

                    if( show_foci ){

                        let foci = ellipse.GetFoci1();

                        let rt = Rotate.Z( foci.x , foci.y , ellipse.angle );

                        Check.VisualCheck.Point2D( 
                            new Point2D( rt[0] + ellipse.x , rt[1] + ellipse.y ) , undefined , "cyan" 
                        );

                        foci = ellipse.GetFoci2();
                        rt = Rotate.Z( foci.x , foci.y , ellipse.angle );

                        Check.VisualCheck.Point2D( 
                            new Point2D( rt[0] + ellipse.x , rt[1] + ellipse.y ) , undefined , "cyan" 
                        );

                    }

                }
                else {
                    Check.#LOG.ERROR.OBJECT_INVALID("check.visual_check.ellipse" , "ellipse2D");
                    Check.#LOG.HINT.USE_THIS_TYPE_TO_THIS_FUNCTION("check.visual_check.ellipse" , "ellipse2D");
                }

            }

            if( !check_buffer && !check_canvas ){
                Check.#LOG.NO_RESOURCE_FOR_DRAW( "check.visual_check" );
            }

        },

        Curves2D : function(
            curve = new Curve2D( ) , connect_debug_points_with_lines = false 
        ){

            let check_buffer = Check.#RESOURCES.buffer instanceof FrameBuffer;
            let check_canvas = Check.#RESOURCES.canvas;
            let check_type   =  curve instanceof Curve2D ;

            if( check_buffer || check_canvas ){

                if( check_type ){

                    if( connect_debug_points_with_lines ){

                        Draw.Line2D( 
                            new Line2D(curve.a , curve.b , 1 , Check.#RESOURCES.default_line_color ) 
                        );

                        Draw.Line2D( 
                            new Line2D(curve.b , curve.c , 1 , Check.#RESOURCES.default_line_color ) 
                        );

                        Draw.Line2D( 
                            new Line2D(curve.c , curve.d , 1 , Check.#RESOURCES.default_line_color ) 
                        );

                    }

                    Check.VisualCheck.Point2D( curve.a );
                    Check.VisualCheck.Point2D( curve.b );
                    Check.VisualCheck.Point2D( curve.c );
                    Check.VisualCheck.Point2D( curve.d );

                }   

            }

            if( !check_buffer && !check_canvas ){
                Check.#LOG.NO_RESOURCE_FOR_DRAW( "check.visual_check" );
            }

        },

        LongCurve2D : function( longcurve = new LongCurve2D( ) , connect_debug_points_with_lines = false  ){
                
            let check_buffer = Check.#RESOURCES.buffer instanceof FrameBuffer;
            let check_canvas = Check.#RESOURCES.canvas;
            let check_type   = longcurve instanceof LongCurve2D ;

            if( check_buffer || check_canvas ){

                if( check_type ){

                    for( let curve of longcurve.curves ){

                        if( connect_debug_points_with_lines ){

                            Draw.Line2D( 
                                new Line2D(curve.a , curve.b , 1 , Check.#RESOURCES.default_line_color ) 
                            );

                            Draw.Line2D( 
                                new Line2D(curve.b , curve.c , 1 , Check.#RESOURCES.default_line_color ) 
                            );

                            Draw.Line2D( 
                                new Line2D(curve.c , curve.d , 1 , Check.#RESOURCES.default_line_color ) 
                            );

                        }
                        
                        
                        Check.VisualCheck.Point2D( curve.a );
                        Check.VisualCheck.Point2D( curve.b );
                        Check.VisualCheck.Point2D( curve.c );
                        Check.VisualCheck.Point2D( curve.d );

                    }
                    
                }
            }
         
            if( !check_buffer && !check_canvas ){
                Check.#LOG.NO_RESOURCE_FOR_DRAW( "check.visual_check" );
            }

        }
    }
    

}