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
	enter: function() {
		Game.authRef = new FirebaseSimpleLogin(Game.database, function(error, user) {
			if (error) {
				alert(error);
				return;
			}
			if (user) {
				//Already logged in				
				//Game.switchState(Game.State.mainMenu);
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
		
	},

	exit: function() {
		Game.userid.remove();
		Game.userid = null;
		delete Game.userid;

		Game.password.remove();
		Game.password = null;
		delete Game.password;
	},

	render: function(display) {
		display.drawText(1,1, "%c{yellow}Treasure");
		display.drawText(1,3, "Login");
		display.drawText(2,5, "Username");
		display.drawText(2,9, "Password");
		display.drawText(40,3, "If you don't have an account,");
		display.drawText(40,4, "pick a username and password");
		display.drawText(40,5, "and login with it by pressing");
		display.drawText(40,6, "%c{green}[Enter]");

	},

	handleInput: function(type, data) {
		Game.userid.render();
		Game.password.render();
		if (type === 'keyup') {
			//if [Enter] is pressed, start game
			if (data.keyCode === ROT.VK_RETURN) {
				var authCode = Game.authentication.login(Game.userid._value, Game.password._value, this._handleLogin);
			}
		}
	},

	_handleLogin: function(authCode) {
		switch(authCode) {
			case 0:
				console.log("blank userid");
				break;
			case 1:
				console.log("blank pw");
				break;
			case 2:
				console.log("created new account");
				break;
			case 3:
				console.log("logged in");
				Game.switchState(Game.State.mainMenu);
				break;
			default:
				console.log(authCode);
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
	enter: function() {
		console.log("Entered play state");
	},

	exit: function() {
		console.log("Exited play state");
	},

	render: function(display) {
		Game.drawWholeMap();
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

