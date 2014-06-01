
var Game = {
	_display: null,
	_currentState: null,
	engine: null,
	player: null,
	treasure: null,
	map: {},

	init: function() {
		//ROT.DEFAULT_WIDTH = 100;
		//ROT.DEFAULT_HEIGHT = 50;
		this._display = new ROT.Display({width: 80, height: 24});
		var game = this; //questionable

		//We only want the active State to handle input
		var bindEventToState = function(event) {
			window.addEventListener(event, function(e) {
				if (game._currentState !== null) {
					game._currentState.handleInput(event, e);
				}
			});
		}

		//Bind keyboard inputs
		bindEventToState('keydown');
	    bindEventToState('keyup');
	    bindEventToState('keypress');

	},

	getDisplay: function() {
		return this._display;
	},

	switchState: function(state) {
		//Notify previous state about switch
		if (this._currentState !== null) {
			this._currentState.exit();
		}

		//Clear display
		this.getDisplay().clear();

		//Set current state & render
		this._currentState = state;
		if (!this._currentState !== null) {
			this._currentState.enter();
			this._currentState.render(this._display);
		}
	}
};


window.onload = function() {
	//Check if rot.js works on browser
	if (!ROT.isSupported()) {
		alert("This game isn't compatible with your browser");
	} else {
		//run initialization stuff
		Game.init();
		//Add the game to the HTML canvas
		document.body.appendChild(Game.getDisplay().getContainer());
		
		//Generate the map
		Game.generateMap();
		Game.switchState(Game.State.mainMenu);

		//Starts the scheduler engine
		var scheduler = new ROT.Scheduler.Simple();
		scheduler.add(this.player, true);
		this.engine = new ROT.Engine(scheduler);
		this.engine.start();
	}
};


Game.generateMap = function() {
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
		this.map[key] = String.fromCharCode(183);
		//this.map[key] = " ";
	}
	digger.create(digCallback.bind(this));
	this._generateBoxes(freeCells);
	this._createPlayer(freeCells);
	//this.drawWholeMap();
};



Game._generateBoxes = function(freeCells) {
	for (var i=0; i<10; i++) {
		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
		var key = freeCells.splice(index, 1)[0];
		this.map[key] = "*";

		if(i == 0) {
			this.treasure = key;
		}
	}
};

Game.drawWholeMap = function() {
	for (var key in this.map) {
		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		this.getDisplay().draw(x, y, this.map[key]);
	}
};




var Player = function(x, y) {
	this._x = x;
	this._y = y;
	this._draw();
}

Player.prototype._draw = function() {
	Game.getDisplay().draw(this._x, this._y, "@", "#ff0");
}

Player.prototype._checkBox = function() {
	var key = this._x + "," + this._y;
	if (Game.map[key] != "*") {
		Game.getDisplay().draw(this._x, this._y - 2, "There is no chest here.");
	} else if (key == Game.treasure) {
		Game.getDisplay().draw(this._x, this._y - 2, "You found treasure.");
	} else {
		Game.getDisplay().draw(this._x, this._y - 2, "Nothing in this chest.");
	}
}

Player.prototype.act = function() {
	//Game.engine.lock();
	//waiting for the user to input something
	//window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {
	var keyMap = {};
	keyMap[ROT.VK_UP] = 0;
	keyMap[ROT.VK_RIGHT] = 1;
	keyMap[ROT.VK_LEFT] = 3;
	keyMap[ROT.VK_DOWN] = 2;

	var code = e.keyCode;
	if (code == ROT.VK_SPACE) {
		this._checkBox();
		return;
	}

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

	Game.getDisplay().draw(this._x, this._y, Game.map[this._x + ",", + this._y]);
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


