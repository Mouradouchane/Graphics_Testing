
export class point{
    constructor(x = 0 , y = 0 , z = 0 , w = 1){

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        this.copy = () => {
            return new point(this.x, this.y , this.z , this.w);
        }
    }
}