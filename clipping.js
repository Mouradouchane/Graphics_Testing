
import {point} from "./point.js"
import {triangle, triangle as trig} from "./triangle.js"


export function xy_check( NDC , triangle = new triangle() ){
    let names = ['a' , 'b' , 'c'];

    // object contain all check result
    let check_obj = {
        a : 0,
        b : 0,
        c : 0,
        case : 0
    }

    for(let p = 0 ; p < names.length ; p += 1){

        // check for x
        if( triangle[ names[p] ].x < NDC.l){
            check_obj[names[p]] += 2;
            check_obj.case += 1;
        } 
        if( triangle[ names[p] ].x > NDC.r){
            check_obj[names[p]] += 8;
            check_obj.case += 1;
        } 

        // check for y
        if( triangle[ names[p] ].y < NDC.t){
            check_obj[names[p]] += 1;
            check_obj.case += 1;
        } 
        if( triangle[ names[p] ].y > NDC.b){
            check_obj[names[p]] += 4;
            check_obj.case += 1;
        } 
        
        if(check_obj[names[p]] != 0){
            console.warn("bottom" , names[p] , check_obj[names[p]]);
            console.warn("case" , check_obj.case);
        } 
    }

    return check_obj;
}

export function xy_clipping( NDC , trig = new triangle() , check_obj = {} ){
        //debugger
        let inp1 = null;
        let inp2 = null;

        let names = ['a' , 'b' , 'c'];
        let new_points = [];

        // if all outside
        if(check_obj.case == 3){

            // if all outside in same side
            if(check_obj.a == check_obj.b && check_obj.b == check_obj.c) return null;
            // if all outside but in different side's , that's mean we need clipping 
            else{

            }

        } 
        // if all inside , don't clip the tirangle 
        if(check_obj.case == 0) return trig;

        // if tow points outside and one inside
        if(check_obj.case == 2){
            // name of inside point 
            let inp = check_obj.a == 0 ? "a" : check_obj.b == 0 ? "b" : "c";
  
            for(let i = 0 ; i < names.length ; i += 1){
                if(names[i] == inp) continue;
                else{

                    let new_point = new point(0,0,0,1);

                    // we need left clip
                    if(check_obj[names[i]] == 2){
                        // slope
                        let m = (trig[inp].y - trig[names[i]].y ) / (trig[inp].x - trig[names[i]].x);

                        // calculate new y position of new point
                        let new_y = -(m * trig[inp].x) + trig[inp].y ;

                        new_point.y = new_y;
                        new_point.z = trig[names[i].z];

                        new_points.push( new_point );
                    }

                }
            }

            new_points.push( trig[names[inp]]);
        }

        // if one point outside and tow inside
        if(check_obj.case == 1){
            inp1 = check_obj.a == 0 ? "a" : check_obj.b == 0 ? "b" : "c";
            inp2 = check_obj.c == 0 ? "c" : "b";

            for(let i = 0 ; i < names.length ; i += 1){

                // outside point
                if(names[i] != inp1 && names[i] != inp2){

                    let new_point1 = new point(0,0,0,1);
                    let new_point2 = new point(0,0,0,1);

                    // we need left clip
                    if(check_obj[names[i]] == 2){

                        // slope
                        let m1 = (trig[inp1].y - trig[names[i]].y ) / (trig[inp1].x - trig[names[i]].x);
                        let m2 = (trig[inp2].y - trig[names[i]].y ) / (trig[inp2].x - trig[names[i]].x);
                        
                        //debugger

                        // calculate new y position of new point
                        let new_y1 = -(m1 * trig[inp1].x) + trig[inp1].y;
                        let new_y2 = -(m2 * trig[inp2].x) + trig[inp2].y;

                        new_point1.y = new_y1;
                        new_point2.y = new_y2;

                        new_point1.z = trig[inp1].z;
                        new_point2.z = trig[inp2].z;

                        new_points.push( new_point1 );
                        new_points.push( new_point2 );

                        break;
                    }

                }

            }

            new_points.push( trig[inp1] );
            new_points.push( trig[inp2] );
        }

        //debugger
        // connect points & made triangles

        if(new_points.length == 3){
            return triangle(...new_points);
        }

        if(new_points.length == 4){
            let new_triangles = [
                new triangle( new_points[0] , new_points[1] , new_points[2]),
                new triangle( new_points[2] , new_points[3] , new_points[0]),

            ];

            return new_triangles;
        }
}