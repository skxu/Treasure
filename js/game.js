
var Game = {
	_display: null,
	_currentState: null,
	engine: null,
	player: null,
	treasure: null,
	database: null,
	onlineUsersRef: null,
	userRef: null,
	connectedRef: null
	map: {},

	init: function() {
		//ROT.DEFAULT_WIDTH = 100;
		//ROT.DEFAULT_HEIGHT = 50;
		this._display = new ROT.Display({width: 80, height: 24});
		var game = this; //questionable

		//Set reference to database
		this.database = new Firebase('https://treasure.firebaseio.com');

		//Connect to login server
		this.onlineUsersRef = this.database.child('users');
		this.userRef = onlineUsersRef.push();

		//Add ourself to the online user list when we are connected
		this.connectedRef = this.database.child('.info/connected');
		connectedRef.on("value", function(snap) {
			if (snap.val()) {
				userRef.set(true);

				//Remove ourself when we disconnect
				userRef.onDisconnect().remove();
			}
		});

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
		Game.engine = new ROT.Engine(scheduler);
		Game.engine.start();
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


Game._createPlayer = function(freeCells) {
	var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
	var key = freeCells.splice(index, 1)[0];
	var parts = key.split(",");
	var x = parseInt(parts[0]);
	var y = parseInt(parts[1]);
	this.player = new Player(x, y);
};


