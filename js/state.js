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
		display.drawText(1,2, "Press [Enter] to start.");
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


Game.State.lobby = {
	enter: function() {
		console.log("Entered lobby state");
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

