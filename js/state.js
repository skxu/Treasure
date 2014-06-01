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
		Game.userid = new CanvasInput({
			canvas: Game.canvas,
			id: "userid",
			x: 20,
			y: 100,
			width: 200,
			height: 10,
			fontSize: 12,
			fontColor: "#fff",
			backgroundColor: "#000",
		});
	},

	exit: function() {
		Game.userid.remove();
		Game.userid = null;
		delete Game.userid;
	},

	render: function(display) {
		display.drawText(1,3, "Login");
		display.drawText(40,3, "Register");

	},

	handleInput: function(type, data) {
		Game.userid.render();
		if (type === 'keyup') {
			//if [Enter] is pressed, start game
			if (data.keyCode === ROT.VK_RETURN) {
				Game.switchState(Game.State.mainMenu);
			}
		}
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

