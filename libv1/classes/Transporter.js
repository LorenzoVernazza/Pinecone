function printStream(stream, ...stuff){
    stream.write(...stuff);
}
function printFunction(func, ...stuff){
    func(...stuff);
}

class Transporter {
	constructor(transporter, config){    
        if (transporter instanceof Stream) {
            this.print = (value, ) => {
                transporter.write()
            }
        } else if (typeof transporter === 'function'){
            this.print = (value, ) => {
                transporter(value, )
            }
        }
		
    }
    print(){

    }
}
