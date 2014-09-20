Game.State = {};

Game.State.mainMenu = {
	currentHorizIndex: 0,
	currentVertIndex: 0,
	vertMax: 2,
	horizMax: [0,0,0],
	enter: function() {
		console.log("Entered mainMenu state");
	},
	
	exit: function() {
		console.log("Exited mainMenu state");
	},
	
	render: function(display) {
		if (this.currentVertIndex === 0) {
			display.drawText(42, 8, Game.util.highlight("Multiplayer Lobby"));
		} else {
			display.drawText(42, 8, "Multiplayer Lobby");
		}
		if (this.currentVertIndex === 1) {
			display.drawText(42, 11, Game.util.highlight("Singleplayer"));
		} else {
			display.drawText(42, 11, "Singleplayer");
		}
		if (this.currentVertIndex === 2) {
			display.drawText(42, 14, Game.util.highlight("Change Password"));
		} else {
			display.drawText(42, 14, "Change Password");
		}
		display.drawText(1,1, "%c{yellow}Treasure");
		display.drawText(39,28, "Press %c{green}[Enter] %c{white}to continue.");

	},

	handleInput: function(type, data) {
		if (type === 'keydown') {
			if (data.keyCode === ROT.VK_LEFT) {
				if (this.currentHorizIndex > 0) {
					this.currentHorizIndex -= 1;
					this.render(Game.getDisplay());
				}
			} else if (data.keyCode === ROT.VK_RIGHT) {
				if (this.currentHorizIndex < this.horizMax[this.currentVertIndex]) {
					this.currentHorizIndex += 1;
					this.render(Game.getDisplay());
				}
			} else if (data.keyCode === ROT.VK_DOWN) {
				if (this.currentVertIndex < this.vertMax) {
					this.currentVertIndex += 1;
					this.currentHorizIndex = 0;
					this.render(Game.getDisplay());
				}
			} else if (data.keyCode === ROT.VK_UP) {
				if (this.currentVertIndex > 0) {
					this.currentVertIndex -= 1;
					this.currentHorizIndex = 0;
					this.render(Game.getDisplay());
				}
			} 
		} else if (type === 'keyup') {
			if (data.keyCode === ROT.VK_RETURN) {
			switch(this.currentVertIndex) {
				case 0: //multiplayer
					Game.switchState(Game.State.lobby);
					break;
				case 1: //single player, not implemented yet
					Game.switchState(Game.State.lobby);
					break;
				case 2: //change pw, not implemented yet
					break;
				default:
					break;
				}
			}
		}
	}
}

Game.State.login = {
	refreshRender: null,

	enter: function() {
		Game.authRef = new FirebaseSimpleLogin(Game.database, function(error, user) {
			if (error) {
				console.log(error);
				switch(error.code) {
					case "INVALID_PASSWORD":
						Game._display.drawText(2,13, "%c{yellow} Incorrect Login %c{black}wwwwwww %c{grey}(if you're trying to register it means the username is taken)", 25);
						break;
					case "INVALID_EMAIL":
						Game._display.drawText(2,13, "%c{yellow} Invalid Username %c{black}www wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",25);
						break;
					case "INVALID_ORIGIN":
						Game._display.drawText(2,13, "%c{yellow} Unauthorized request origin %c{black}www wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",25);
						break;
					case "USER_DENIED":
						Game._display.drawText(2,13, "%c{yellow} Login denied. Are you %c{red}banned? %c{black}www wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",25);
						break;
					default:
						Game._display.drawText(2,13, "%c{yellow}Unknown Error %c{black}www wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",25);
						break;
				}
				return;
			}
			if (user) {
				//Already logged in
				Game.username = user.email.split("@")[0];	
				Game.switchState(Game.State.mainMenu);
			} else {
				//do the login
			}
		});
		Game.userid = new CanvasInput({
			canvas: Game.canvas,
			id: "userid",
			x: 20,
			y: 100,
			width: 200,
			height: 10,
			fontSize: 12,
			fontColor: "#fff",
			backgroundColor: "#111",
			//borderColor: "#444",
			boxShadow: "0px 0px 0px rgba(255, 255, 255, 1)",
		});
		Game.password = new CanvasInput({
			canvas: Game.canvas,
			id: "password",
			x: 20,
			y: 160,
			width: 200,
			height: 10,
			fontSize: 12,
			fontColor: "#fff",
			backgroundColor: "#111",
			boxShadow: "0px 0px 0px rgba(255, 255, 255, 1)",
		});
		this.refreshRender = window.setInterval(this._refreshInputs, 500);
	},

	exit: function() {
		Game.userid.remove();
		Game.userid = null;
		delete Game.userid;

		Game.password.remove();
		Game.password = null;
		delete Game.password;

		window.clearInterval(this.refreshRender);

	},

	render: function(display) {

		display.drawText(1,1, "%c{yellow}Treasure");
		display.drawText(1,3, "Login");
		display.drawText(2,5, "Username");
		display.drawText(2,9, "Password");
		display.drawText(40,3, "%c{red}How to Register");
		display.drawText(40,5, "If you don't have an account, pick a username and password and login with it by pressing %c{green}[Enter]", 30);

	},

	handleInput: function(type, data) {
		if (type === 'keyup') {
			//if [Enter] is pressed, start game
			if (data.keyCode === ROT.VK_RETURN) {
				var authCode = Game.authentication.login(Game.userid._value, Game.password._value, this._handleLogin);
			}
		}
	},

	_refreshInputs: function() {
		if (Game.userid !== undefined && Game.userid !== null && Game.password !== undefined && Game.password !== null) {
			Game.userid.render();
			Game.password.render();
		}
	},

	_handleLogin: function(authCode) {
		switch(authCode) {
			case 0:
				console.log("blank userid");
				Game._display.drawText(2,13, "%c{yellow} Username field is blank %c{black}wwww wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", 25);
				break;
			case 1:
				console.log("blank pw");
				Game._display.drawText(2,13, "%c{yellow} Password field is blank %c{black}wwww wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", 25);
				break;
			case 2:
				console.log("created new account");
				Game.authRef.login('password', {
					email: Game.userEmail,
					password: Game.password._value,
					rememberMe: false
				});
				break;
			case 3:
				console.log("logged in");
				//Game.switchState(Game.State.mainMenu);
				break;
			default:
				console.log("got unknown authCode at _handleLogin: ", authCode);
				break;
		}
	}
}

//Placeholder for seperate registration page
Game.State.register = {
	enter: function() {

	},

	exit: function() {

	},

	render: function(display) {

	},

	handleInput: function(type, data) {

	}
}

Game.State.lobby = {
	//menu: ["Join Public Game", "Join Private Game", "Create Game"],
	currentVertIndex: 0,
	currentHorizIndex: 0,
	horizMax: [0,0,0,0],
	vertMax: 3,
	enter: function() {
		console.log("Entered lobby state");
		//Game.lobbyRef.push('test');
	},

	exit: function() {
		console.log("Exited lobby state");
	},

	render: function(display) {
		display.drawText(1,1, "Lobby");
		if (this.currentVertIndex === 0) {
			display.drawText(42, 8, Game.util.highlight("Continue Last Game"));
		} else {
			display.drawText(42, 8, "Continue Last Game");
		}
		if (this.currentVertIndex === 1) {
			display.drawText(42, 11, Game.util.highlight("Join Public Game"));
		} else  {
			display.drawText(42, 11, "Join Public Game");
		}
		if (this.currentVertIndex === 2) {
			display.drawText(42, 14, Game.util.highlight("Join Private Game"));
		} else {
			display.drawText(42, 14, "Join Private Game");
		}
		if (this.currentVertIndex === 3) {
			display.drawText(42, 17, Game.util.highlight("Create Game"));
		} else {
			display.drawText(42, 17, "Create Game");
		}
		display.drawText(39,28, "Press %c{green}[Enter] %c{white}to continue.");
	},

	handleInput: function(type, data) {
		if (type === 'keydown') {
			if (data.keyCode === ROT.VK_LEFT) {
				if (this.currentHorizIndex > 0) {
					this.currentHorizIndex -= 1;
					this.render(Game.getDisplay());
				}
			} else if (data.keyCode === ROT.VK_RIGHT) {
				if (this.currentHorizIndex < this.horizMax[this.currentVertIndex]) {
					this.currentHorizIndex += 1;
					this.render(Game.getDisplay());
				}
			} else if (data.keyCode === ROT.VK_DOWN) {
				if (this.currentVertIndex < this.vertMax) {
					this.currentVertIndex += 1;
					this.currentHorizIndex = 0;
					this.render(Game.getDisplay());
				}
			} else if (data.keyCode === ROT.VK_UP) {
				if (this.currentVertIndex > 0) {
					this.currentVertIndex -= 1;
					this.currentHorizIndex = 0;
					this.render(Game.getDisplay());
				}
			} 
		} else if (type === 'keyup') {
			if (data.keyCode === ROT.VK_RETURN) {
				switch(this.currentVertIndex) {
					case 0: //Continue last game
						break;
					case 1: //Join public game
						Game.switchState(Game.State.gameList);
						break;
					case 2: //Join private game
						break;
					case 3: //Create game
						Game.switchState(Game.State.createGame);
						break;
					default:
						break;
				}
			} else if (data.keyCode === ROT.VK_ESCAPE) {
				//Pressed escape, TODO: go up one menu // pop from state list (currently hard coded) 
				Game.switchState(Game.State.mainMenu);
			}
		}
	}
}

Game.State.gameList = {
	games: {}, //contains a list of games
	currentIndex: 0,
	enter: function() {
		Game.gameListMetaRef.on('child_added', function(data, prevChild) {
			gameList = Game.State.gameList.games;
			
			gameplay = data.child('gameplay').val();
			hardcore = data.child('hardcore').val();
			publicity = data.child('publicity').val();
			gameID = data.child('gameID').val();
			if (publicity == 1) return; //don't show private games
			var userRef = data.child('userList').ref(); //users
			users = [];
			var newGame = new Game.gameAttributes(publicity, hardcore, gameplay, users, gameID);
			var snapshot = data;
			gameList[snapshot.name()] = newGame;
			console.log(gameList);
			Game.State.gameList.render(Game.getDisplay());
			userRef.on('child_added', function(data, prevChild) {
				gameList[snapshot.name()].addUser(data.val());
				console.log("child added to users list");
				console.log(gameList);
				Game._currentState.render(Game.getDisplay());
				
			});
			userRef.on('child_removed', function(data) {
				gameList[snapshot.name()].removeUser(data.val());
				console.log("child removed from users list");
				console.log(gameList);
				Game.State.gameList.render(Game.getDisplay());
			});

		});

		Game.gameListMetaRef.on('child_removed', function(snapshot) {
			delete Game.State.gameList.games[snapshot.name()];
			Game.getDisplay().clear();
			Game.State.gameList.render(Game.getDisplay());
		});
		console.log("Entered gameList state");
	},

	exit: function() {
		Game.gameListMetaRef.off();
		Game.userRef.off();
		console.log("Exited gameList state");
	},

	render: function(display) {
		display.drawText(1,1, "Public Open Game List");
		counterX = 0;
		counterY = 0;
		for (var key in Game.State.gameList.games) {
			gameAttr = Game.State.gameList.games[key];
			pub = gameAttr.getPublicity(); //TODO: remove this since it's guaranteed to be public

			hardcore = (gameAttr.getHardcore()) ? "yes" : "no";
			gameplay = (gameAttr.getGameplay()) ? "take turns" : "FFA";
			totalUsers = gameAttr.getUserList().length;
			
			gameNum = (counterX*5) + counterY;
			if (((counterX*5) + counterY) == Game.State.gameList.currentIndex) {
				display.drawText(2 + counterX*22, 5 + counterY*4, Game.util.setOptionHighlight("Game #"+gameNum));
				display.drawText(4 + counterX*22, 6 + counterY*4, Game.util.highlight("Hardcore: "+hardcore));
				display.drawText(4 + counterX*22, 7 + counterY*4, Game.util.highlight("Gameplay: "+gameplay));
				display.drawText(4 + counterX*22, 8 + counterY*4, Game.util.highlight("Users: "+totalUsers+"/4"));
			} else {
				display.drawText(2 + counterX*22, 5 + counterY*4, "Game #"+gameNum);
				display.drawText(4 + counterX*22, 6 + counterY*4, "Hardcore: "+hardcore);
				display.drawText(4 + counterX*22, 7 + counterY*4, "Gameplay: "+gameplay);
				display.drawText(4 + counterX*22, 8 + counterY*4, "Users: "+totalUsers+"/4");
			}
			counterY += 1;
			if (counterY == 5) {
				counterY = 0;
				counterX += 1;
			}
		}

	},

	handleInput: function(type, data) {
		if (type === 'keydown') {
			if (data.keyCode === ROT.VK_UP) {
				if (this.currentIndex > 0) {
					this.currentIndex -= 1;
					this.render(Game.getDisplay());
				}
			} else if (data.keyCode === ROT.VK_DOWN) {
				if (this.currentIndex < Object.keys(Game.State.gameList.games).length - 1) {
					this.currentIndex += 1;
					this.render(Game.getDisplay());
				}
			}
		} else if (type === 'keyup') {
			if (data.keyCode === ROT.VK_ESCAPE || data.keyCode === ROT.VK_BACKSPACE) {
				//TODO: pop from current state list instead of hard coding return menu
				Game.switchState(Game.State.lobby);
			} else if (data.keyCode === ROT.VK_RETURN) {
				//selected a game
				metaID = Object.keys(Game.State.gameList.games)[this.currentIndex];
				//get some game attributes from the meta reference
				gameAttr = Game.State.gameList.games[metaID];
				gameID = gameAttr.getGameID();

				//set references
				metaRef = Game.gameListMetaRef.child(metaID);
				Game.currentGameRef = Game.gameListRef.child(gameID);
				//let the world know we entered the game
				metaUserRef = metaRef.child('userList');
				Game.currentGameUsersRef = Game.currentGameRef.child('userList');
				
				Game.currentGameUsersRef.push(Game.username);
				metaUserRef.push(Game.username);

				Game.currentGameUsersRef.onDisconnect().remove();
				metaUserRef.onDisconnect().remove();

				//set current map
				
				Game.currentGameRef.child('world').on('value', function(snap) {
					console.log(snap.val());
					Game.world = snap.val();
					Game.currentMap = Game.world.dungeon;
					Game.Map._createPlayerOnMap(Game.currentMap);
					Game.switchState(Game.State.play);
				});
				
				
				
			}
		}

	}
}

Game.State.createGame = {
	currentHorizIndex: [0,0,0,0],
	currentVertIndex: 0,
	horizMax: [1,1,1,0],
	vertMax: 3,

	enter: function() {
		console.log("Entered createGame state");
	},

	exit: function() {
		console.log("Exited createGame state");

	},

	render: function(display) {
		display.drawText(1,1, "Create Game");
		display.drawText(4, 4, "Game Publicity:");
		display.drawText(4, 6, "Hardcore:");
		display.drawText(4, 8, "Gameplay:");
		if (this.currentHorizIndex[0] === 0) {
			display.drawText(23, 4, "%c{black}%b{lightgrey}PUBLIC");
		} else {
			display.drawText(23, 4, "PUBLIC");
		}

		if (this.currentHorizIndex[0] === 1) {
			display.drawText(35, 4, "%c{black}%b{lightgrey}PRIVATE");
		} else {
			display.drawText(35, 4, "PRIVATE");
		}

		if (this.currentHorizIndex[1] === 0) {
			display.drawText(23,6, "%c{black}%b{lightgrey}NO");
		} else {
			display.drawText(23,6, "NO");
		}

		if (this.currentHorizIndex[1] === 1) {
			display.drawText(35,6, "%c{black}%b{lightgrey}YES");
		} else {
			display.drawText(35,6, "YES");
		}

		if (this.currentHorizIndex[2] === 0) {
			display.drawText(23,8, Game.util.highlight("FFA"));
		} else {
			display.drawText(23,8, "FFA");
		}

		if (this.currentHorizIndex[2] === 1) {
			display.drawText(35,8, Game.util.highlight("TAKE TURNS"));
		} else {
			display.drawText(35,8, "TAKE TURNS");
		}

		if (this.currentVertIndex === 3) {
			display.drawText(4, 13, Game.util.highlight("START"));
		} else {
			display.drawText(4, 13, "START");
		}

	},

	handleInput: function(type, data) {
		if (type === 'keydown') {
			if (data.keyCode === ROT.VK_LEFT) {
				if (this.currentHorizIndex[this.currentVertIndex] > 0) {
					this.currentHorizIndex[this.currentVertIndex] -= 1;
					this.render(Game.getDisplay());
				}
			} else if (data.keyCode === ROT.VK_RIGHT) {
				if (this.currentHorizIndex[this.currentVertIndex] < this.horizMax[this.currentVertIndex]) {
					this.currentHorizIndex[this.currentVertIndex] += 1;
					this.render(Game.getDisplay());
				}
			} else if (data.keyCode === ROT.VK_DOWN) {
				if (this.currentVertIndex < this.vertMax) {
					this.currentVertIndex += 1;
					this.render(Game.getDisplay());
				}
			} else if (data.keyCode === ROT.VK_UP) {
				if (this.currentVertIndex > 0) {
					this.currentVertIndex -= 1;
					this.render(Game.getDisplay());
				}
			} 
		} else if (type === 'keyup') {
			if (data.keyCode === ROT.VK_RETURN) {
				if (this.currentVertIndex === 3) {
					Game.currentGameRef = Game.gameListRef.push({"publicity":this.currentHorizIndex[0], "hardcore":this.currentHorizIndex[1], "gameplay":this.currentHorizIndex[2]});
					metaRef = Game.gameListMetaRef.push({"gameID":Game.currentGameRef.name(), "publicity":this.currentHorizIndex[0], "hardcore":this.currentHorizIndex[1], "gameplay":this.currentHorizIndex[2]});

					metaUserRef = metaRef.child('userList');
					Game.currentGameUsersRef = Game.currentGameRef.child('userList');
					
					Game.currentGameUsersRef.push(Game.username);
					metaUserRef.push(Game.username);

					Game.currentGameUsersRef.onDisconnect().remove();
					metaUserRef.onDisconnect().remove();
					//generating the world
					Game.world = new Game.World();

					//set the current map
					Game.currentMap = Game.world.dungeon;


					Game.currentGameRef.update({"world":Game.world});
					Game.switchState(Game.State.play);
				}
			} else if (data.keyCode === ROT.VK_ESCAPE || data.keyCode === ROT.VK_BACKSPACE) {
				//TODO: pop from current state list instead of hard coding return menu
				Game.switchState(Game.State.lobby);
		}
		}

	}
}


Game.State.play = {
	_map: null,

	enter: function() {
		console.log("Entered play state");
		//var mapList = Game.Map.generateCellularMap(80,24);
		this._map = Game.currentMap;
		Game.currentGameUsersRef.on("child_added", function(data, prevChild) {
			console.log(data)
			//gameList[snapshot.name()].addUser(data.val());
			//console.log("child added to users list");
			//console.log(gameList);
			//Game.State.gameList.render(Game.getDisplay());
		});
		Game.currentGameUsersRef.on('child_removed', function(data) {
			//gameList[snapshot.name()].removeUser(data.val());
			//console.log("child removed from users list");
			//console.log(gameList);
			//Game.State.gameList.render(Game.getDisplay());
		});
	},

	exit: function() {
		console.log("Exited play state");
	},

	render: function(display) {
		Game.Map.drawWholeMap(this._map);
		Game.player._draw();
		for (var player in Game.world.players) {

		}
	},

	handleInput: function(type, data) {
		if (type === 'keydown') {
			Game.player.handleEvent(data);
		}
	}
}


Game.State.lose = {

};


