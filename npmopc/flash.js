var async = require("async")

var Socket = require("net").Socket
var socket = new Socket()
socket.setNoDelay()
socket.connect(7890)

var createOPCStream = require("opc")
var stream = createOPCStream()
stream.pipe(socket)

// config for size of display:
const WIDTH = 13
const HEIGHT = 50

var createStrand = require("opc/strand")
var strand = createStrand(WIDTH*HEIGHT)
var columns = []
var i = 0

for (var width = WIDTH; width >= 0; width--) {
	columns.push(strand.slice(HEIGHT*i, HEIGHT*(width+1)))
};

//
// ^^The columns Array contains parts of the strand.
// Can set specific pixels through x/y axis as such:
// columns[i].setPixel row, red, green, blue
// This is great.
//

// config options for user, defaults?
var colors = [[240,50,50],[102,102,51],[204,0,204]]
var fill = 50
var speed = 50


function filler(done){
	async.waterfall([
		function(done){
			mod = [0,0,0]
			colors[0].forEach(function(color, index){
				d = Math.random() - .5
				mod[index] = parseInt(c + 123*d)
				// mod[index] = (mod[index] > 255) ? 255 : 0;
			})
			done(null, mod)
		},
		function(mod, done){
			var y = 0
			while(y < HEIGHT){
				var x = 0
				while (x < WIDTH){
					if (Math.random()*100 < fill){
						columns[x].setPixel(i, mod[0],mod[1],mod[2])
						x++
					}
				}
				y++
			}
			done()
		},
		function(done){
			console.log(strand.buffer)
			stream.writePixels(0, strand.buffer, done);
		},
		function(done) {
			console.log("Refresh")
			done();
		},
		done], console.error)
}

setInterval(filler, 1000)
