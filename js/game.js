
var Game = {
	_display: null,
	_currentState: null,
	userid: null, //username field
	username: null,
	userEmail: null, //email, used only for firebase auth
	password: null,
	canvas: null, //ctx canvas
	engine: null, //scheduler engine
	player: null, //player.js
	treasure: null, //placeholder
	database: null, // treasure.firebaseio.com
	useridRef:null, //check if username already taken
	onlineUsersRef: null, //online users, at /users
	userRef: null, //reference to us within /users
	connectedRef: null, // uses /.info/connected to check for connections
	lobbyRef: null, //users hanging around in the lobby
	gameListRef: null, //list of public games
	gameListMetaRef: null, //list of public game metadata
	currentGameRef: null, //your own game
	currentGameUsersRef: null, //users in your game, including you
	//userRef: null,
	authRef: null,  //reference to authentication server
	mapRef: null,
	map: {},
	currentMap: {},
	world: {},
	width: 100,
	height: 30,

	init: function() {
		//ROT.DEFAULT_WIDTH = 100;
		//ROT.DEFAULT_HEIGHT = 50;
		this._display = new ROT.Display({width: this.width, height: this.height});
		var game = this; //keep track of state

		//Set reference to database
		this.database = new Firebase('https://treasure.firebaseio.com');

		//Set more references
		this.lobbyRef = this.database.child('lobby');
		this.useridRef = this.database.child('userid');
		//placeholder login authentication server
		this.gameListRef = this.database.child('gameList');
		this.gameListMetaRef = this.database.child('gameListMeta');
		
		//Connect to users
		this.onlineUsersRef = this.database.child('users');
		this.userRef = this.onlineUsersRef.push();

		//Add ourself to the online user list when we are connected
		this.connectedRef = this.database.child('.info/connected');
		this.connectedRef.on("value", function(snap) {
			if (snap.val()) {
				Game.userRef.set(true);

				//Remove ourself when we disconnect
				Game.userRef.onDisconnect().remove();
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

	switchState: function(state, param) {
		//Notify previous state about switch
		if (this._currentState !== null) {
			this._currentState.exit();
		}

		//Clear display
		this.getDisplay().clear();

		//Set current state & render
		this._currentState = state;
		if (!this._currentState !== null) {
			if (param !== undefined) {
				this._currentState.enter(param);
			} else {
				this._currentState.enter();
			}
			this._currentState.render(this._display);
		}
	}
};


window.onload = function() {
	//Check if rot.js works on browser
	if (!ROT.isSupported()) {
		alert("This game isn't compatible with your browser");
	} else {

		//prevent backspace navigation
		$(document).unbind('keydown').bind('keydown', function (event) {
		    var doPrevent = false;
		    if (event.keyCode === 8) {
		        var d = event.srcElement || event.target;
		        if ((d.tagName.toUpperCase() === 'INPUT' && 
		             (
		                 d.type.toUpperCase() === 'TEXT' ||
		                 d.type.toUpperCase() === 'PASSWORD' || 
		                 d.type.toUpperCase() === 'FILE' || 
		                 d.type.toUpperCase() === 'EMAIL' || 
		                 d.type.toUpperCase() === 'SEARCH' || 
		                 d.type.toUpperCase() === 'DATE' )
		             ) || 
		             d.tagName.toUpperCase() === 'TEXTAREA') {
		            doPrevent = d.readOnly || d.disabled;
		        }
		        else {
		            doPrevent = true;
		        }
		    }

		    if (doPrevent) {
		        event.preventDefault();
		    }
		});


		//run initialization stuff
		Game.init();
		//Add the game to the HTML canvas
		document.getElementById('canvasDiv').appendChild(Game.getDisplay().getContainer());
		Game.canvas = document.getElementsByTagName('canvas')[0];

		//Center canvas
		var style = Game.canvas.style;
		style.marginLeft = "auto";
		style.marginRight = "auto";
		//Generate the map
		//Game.generateMap();
		Game.switchState(Game.State.login);

		//Starts the scheduler engine
		var scheduler = new ROT.Scheduler.Simple();
		scheduler.add(this.player, true);
		Game.engine = new ROT.Engine(scheduler);
		Game.engine.start();
	}
};

