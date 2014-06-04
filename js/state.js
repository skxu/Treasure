Game.State = {};

Game.State.mainMenu = {
	enter: function() {
		console.log("Entered mainMenu state");
	},
	
	exit: function() {
		console.log("Exited mainMenu state");
	},
	
	render: function(display) {
		display.drawText(1,1, "%c{yellow}Treasure");
		display.drawText(1,2, "Placeholder for mainMenu");
		display.drawText(1,3, "Press %c{green}[Enter] %c{white}to continue.");
		display.drawText(1,4, "%c{grey}Multiplayer Lobby (placeholder)");
		display.drawText(1,5, "%c{grey}Singleplayer (placeholder)");
		display.drawText(1,6, "%c{grey}Change password (placeholder)");

	},

	handleInput: function(type, data) {
		if (type === 'keyup') {
			//if [Enter] is pressed, start game
			if (data.keyCode === ROT.VK_RETURN) {
				Game.switchState(Game.State.lobby);
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
	enter: function() {
		Game.lobbyRef.push('test');
	},

	exit: function() {
		console.log("Exited lobby state");
	},

	render: function(display) {
		display.drawText(1,1, "Lobby");
		display.drawText(1,2, "Placeholder for lobby");
		display.drawText(1,3, "Press %c{green}[Enter] %c{white}to continue.");
		display.drawText(1,4, "%c{grey}Join Public Game");
		display.drawText(1,5, "%c{grey}Join Private Game");
		display.drawText(1,6, "%c{grey}Create Game");
	},

	handleInput: function(type, data) {
		if (type === 'keyup') {
			if (data.keyCode === ROT.VK_RETURN) {
				Game.switchState(Game.State.play);
			}
		}
	}
}



Game.State.play = {
	_map: null,

	enter: function() {
		console.log("Entered play state");
		var mapList = Game.Map.generateCellularMap(80,24);
		console.log(mapList);
		this._map = new Game.Map(mapList[1]);
	},

	exit: function() {
		console.log("Exited play state");
	},

	render: function(display) {
		Game.Map.drawWholeMap(this._map);
		Game.player._draw();
	},

	handleInput: function(type, data) {
		if (type === 'keydown') {
			Game.player.handleEvent(data);
		}
	}
}


Game.State.lose = {

};
Game.State.newGame = {

};

