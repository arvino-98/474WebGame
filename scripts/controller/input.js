
function Input(){
    this.keyHandler = new keyPressEvent();
    
    function keyPressEvent(){
        document.addEventListener("keydown", KeyHandler);
        document.addEventListener("keyup", KeyHandler);

        const key_handler = {
            w: false,
            a: false,
            s: false,
            d: false,
            space : false,
            shift : false,
        };

        function KeyHandler(event) {
            const state = event.type === "keydown"

            if(event.keyCode == 87){ // w
                //console.log('pressed w');
                key_handler.w = state;
            } 
            else if(event.keyCode == 65){ // a
                //console.log('pressed a');
                key_handler.a = state;
            } 
            else if(event.keyCode == 83){ // s
                //console.log('pressed s');
                key_handler.s = state;
            } 
            else if(event.keyCode == 68){ // d
                //console.log('pressed d');
                key_handler.d = state;
            }
            else if(event.keyCode == 32){ // space
                //console.log('pressed space');
                key_handler.space = state;
            }  
            else if(event.keyCode == 16){ // shift
                //console.log('pressed shift');
                key_handler.shift = state;
            }  

            //event.preventDefault(); // tells the program to ignore the default behavior of the keys
        }

        return key_handler;
    }
}
