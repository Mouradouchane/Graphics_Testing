
export class rgb{

    constructor( red = 255, green = 255 , blue = 255) {

        this.red = red;
        this.green = red;
        this.blue = red;

        this.to_string = () => {
            return `rgb(${ this.red},${ this.green },${ this.blue})`;
        }
    }


}