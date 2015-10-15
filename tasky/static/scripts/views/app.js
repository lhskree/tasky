var App = App || {};
App.View = App.View || {};

// The main application controller - not really an associated view, just a lot of upkeep
// for other views
App.View.Application = Backbone.View.extend(
// Instance Methods
{

	initialize : function () {
		if (!App.View.Application.getAuthToken()) {
			var home = new App.View.Home();
			home.parentView = this;
		} else {
			this.checkOldToken(App.View.Application.getAuthToken());
		}
	},

	render : function () {
		return this;
	},

	checkOldToken : function (token) {
		var which = this;
		if (token) {
			$.ajax("/api/auth", {
				method : "POST",
				headers : {
					"Authorization" : "Bearer " + token
					}
				}
			)
			// Previous token was valid, generate the board
			.success(function() {
				which.getBoard();
			}).fail(function (err, jqxhr) {
				console.log(err);
			});
			return true;
		} else {
			return false;
		}
	},

	getBoard : function () {

		$("body").append('<div id="lists"></div>');

		var payload = App.View.Application.getAuthTokenPayload(App.View.Application.getAuthToken());

		var user = new App.Model.User({
			"email" : payload.email
		});

		var userView = new App.Model.User({
			model : user
		});
		userView.parentView = this;

		var navView = new App.View.Nav({
			model : user
		});
		navView.parentView = this;

		this.getLists();

	},

	getLists : function () {
		$.ajax("/api/lists?all=true", {
			method : "GET",
			headers : {
				"Authorization" : App.View.Application.getAuthHeader()
				}
			}
		)
		.success(function (data) {
			if (data.results.length) {
				var $lists = $("#lists");
				data.results.forEach(function (list) {
					var list = new App.Model.List(list);
					var listView = new App.View.List({
						model : list
					});
				});
			}
		})
		.fail(function (err) {
			console.log("Failed to get lists.");
			console.log(err);
		});
	}

},
// Class methods
{
	getAuthToken : function () {
		return window.localStorage.getItem("token") || false;
	},

	setAuthToken : function (token) {
		window.localStorage.setItem("token", token);
	},

	getAuthHeader : function () {
		return "Bearer " + this.getAuthToken();
	},

	unsetAuthToken : function () {
		window.localStorage.removeItem("token");
	},

	getAuthTokenPayload : function () {
		var token = this.getAuthToken();
		var payload = token.split('.')[1];
		return JSON.parse(atob(payload));
	}

});