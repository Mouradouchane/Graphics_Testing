import { RGBA } from "./color.js";

// normal buffer with no specification's
export class buffer{

    static #LOGS = {

        invalid : (param_name) => {
            console.error(`invalid parameter ${param_name} .`);
        },
        def_value : (param_name) => {
            console.warn(`because the passed parameter ${param_name} invalid the default value gonna replace it .`);
        }

    }

    constructor( buffer_width = 1 , buffer_height = 1 ){

        this.#width  = 1;
        this.#height = 1;
        this.#buffer = undefined;
        this.#length = {
            x : undefined , y : undefined
        };

        if( buffer_width > 0 ) this.#width = new Number(buffer_width);
        else {

            buffer.#LOGS.invalid();
            buffer.#LOGS.def_value();

        }

        if( buffer_height > 0 ) this.#height = new Number(buffer_height);
        else {
            
            buffer.#LOGS.invalid();
            buffer.#LOGS.def_value();

        }
        
        // update buffer length
        this.#length.x = this.#width  - 1;
        this.#length.y = this.#height - 1;

        // allocated 2D buffer
        this.#buffer = new Array(this.#height);

        for(let y = 0; y < this.#height ; y += 1 ){
            this.#buffer[y] = new Array( this.#width );
        }

    }

}