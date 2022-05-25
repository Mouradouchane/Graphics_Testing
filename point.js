
export class point{
    constructor(x = 0 , y = 0 , z = 0 , w = 1){

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        this.scalar = ( size = 1 , x , y , z ) => {
            this.x *= size;
            this.y *= size;
            this.z *= size;

            this.x += x;
            this.y += y;
            this.z += z;
        }
    }
}