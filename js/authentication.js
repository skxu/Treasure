Game.authentication = {};


//Attempts registration and/or login
//Returns the following status codes
/* 
	0 - userid blank/null
	1 - pw blank/null
	2 - created new account + logged in
	3 - logged in
	4 - incorrect login // userid exists
*/
Game.authentication.login = function(userid, pw, callback) {
	if (userid === '' || userid === null) {
		callback(0);
		return;
	}

	if (pw === '' || pw === null) {
		callback(1);
		return;
	}
	var val;
	//firebase requires to login via email, so just temporarily converting usernames to IDs
	Game.userEmail = userid + "@fakemail.com";
	var idRef = Game.database.child("userid/"+userid);
	idRef.once('value', val = function(snapshot) {
		if(snapshot.val() === null) {
			//userid doesn't exist, continue to registration
			console.log("userid doesn't exit");
			Game.authRef.createUser(Game.userEmail, pw, function(error, user) {
				if (!error) {
					console.log("Created user " + user.email);
					callback(2);
				} else {
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
				}
			});
			//Mark your presence! (basically claim userid as taken so others can't register with it)
			idRef.push("poop");
			
		} else {
			//userid exists, attempt to login
			console.log("userid exists, attempting to login");
			Game.authRef.login('password', {
				email: Game.userEmail,
				password: pw,
				rememberMe: false
			});
		}
	});

}