// =============== FPS ===============

export class fps{
    constructor(max_fps_in_sec = 1000/40){

        this.max = max_fps_in_sec;
        this.sec = 0;
        this.fpms = 0;
        this.draw = true;

        this.fram_calc_interval = null;
        
        this.start_calc_frames =() => {
            this.draw = true;
            
            this.fram_calc_interval = setInterval(() => {
            
                this.sec = this.fpms;
                this.fpms = 0;
                     
            }, 1000);

        } 
            
         
        this.stop_calc_frames = () => {
            this.draw = false;
            clearInterval(this.fram_calc_interval);
        }
    }

} 