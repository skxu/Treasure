
var Game = {
	display: null,
	engine: null,
	player: null,
	map: {},

	init: function() {
		ROT.DEFAULT_WIDTH = 100;
		ROT.DEFAULT_HEIGHT = 50;
		this.display = new ROT.Display();
		document.body.appendChild(this.display.getContainer());
		this._generateMap();

		var scheduler = new ROT.Scheduler.Simple();
		scheduler.add(this.player, true);
		this.engine = new ROT.Engine(scheduler);
		this.engine.start();


	}
}




Game._generateMap = function() {
	var digger = new ROT.Map.Digger();
	var freeCells = [];

	var digCallback = function(x, y, value) {
		if (value) { 
			var key = x + "," + y;
			this.map[key] = "#";
			return;
		}
		var key = x + "," + y;
		freeCells.push(key);
		//this.map[key] = String.fromCharCode(183);
		this.map[key] = " ";
	}
	digger.create(digCallback.bind(this));
	this._generateBoxes(freeCells);
	this._drawWholeMap();
	this._createPlayer(freeCells);
};


Game._generateBoxes = function(freeCells) {
	for (var i=0; i<10; i++) {
		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
		var key = freeCells.splice(index, 1)[0];
		this.map[key] = "*";
	}
};

Game._drawWholeMap = function() {
	for (var key in this.map) {
		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		this.display.draw(x, y, this.map[key]);
	}
};

var Player = function(x, y) {
	this._x = x;
	this._y = y;
	this._draw();
}

Player.prototype._draw = function() {
	Game.display.draw(this._x, this._y, "@", "#ff0");
}

Player.prototype.act = function() {
	Game.engine.lock();
	//waiting for the user to input something
	window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {
	var keyMap = {};
	keyMap[ROT.VK_UP] = 0;
	keyMap[ROT.VK_RIGHT] = 1;
	keyMap[ROT.VK_LEFT] = 3;
	keyMap[ROT.VK_DOWN] = 2;

	var code = e.keyCode;

	//Only take valid keys
	if (!(code in keyMap)) {
		return;
	}

	//Get the change in x, y after input
	var diff = ROT.DIRS[4][keyMap[code]];
	var newX = this._x + diff[0];
	var newY = this._y + diff[1];

	var newKey = newX + "," + newY;
	if (!(newKey in Game.map)) { return; }

	Game.display.draw(this._x, this._y, Game.map[this._x + ",", + this._y]);
	this._x = newX;
	this._y = newY;
	this._draw();
	window.removeEventListener("keydown", this);
	Game.engine.unlock();

}

Game._createPlayer = function(freeCells) {
	var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
	var key = freeCells.splice(index, 1)[0];
	var parts = key.split(",");
	var x = parseInt(parts[0]);
	var y = parseInt(parts[1]);
	this.player = new Player(x, y);
};


