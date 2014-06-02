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
	}

	if (pw === '' || pw === null) {
		callback(1);
	}
	var val;
	Game.userEmail = userid + "@fakemail.com";
	var idRef = Game.database.child("userid/"+userid);
	idRef.once('value', val = function(snapshot) {
		if(snapshot.val() === null) {
			//userid doesn't exist, continue to registration
			console.log("userid doesn't exit");
			Game.authRef.createUser(Game.userEmail, pw, function(error, user) {
				if (!error) {
					console.log("Created user " + user.email);
				} else {
					console.log(error);
				}
			});
			//Mark your presence!
			idRef.push("poop");
			/*
			Game.authRef.login('password', {
				email: Game.userEmail,
				password: pw,
				rememberMe: true
			});
			*/
			callback(2);
		} else {
			//userid exists, attempt to login
			console.log("userid exists, attempting to login");
			Game.authRef.login('password', {
				email: Game.userEmail,
				password: pw,
				rememberMe: true
			});
			callback(3);
		}
	});

}