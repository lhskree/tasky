var App = App || {};
App.helpers = {};

/*********************
This section contains various application helper functions
*********************/

App.storage = window.localStorage;

App.helpers.getAuthToken = function () {
	return App.storage.getItem("token") || false;
}

App.helpers.setAuthToken = function (token) {
	App.storage.setItem("token", token);
	return true;
}

App.helpers.getAuthHeader = function () {
	return "Bearer " + App.helpers.getAuthToken();
}

App.helpers.unsetAuthToken = function () {
	App.storage.removeItem("token");
	return true;
}

App.helpers.getAuthTokenPayload = function () {
	var token = this.getAuthToken();
	var payload = token.split('.')[1];
	return JSON.parse(atob(payload));
}

App.helpers.setUser = function () {
	var payload = this.getAuthTokenPayload();
	App.user = payload['email'];
}

App.helpers.getBoard = function () {

	$("body").append('<div id="lists"></div>');

	// Make the navigation
	// This should be passed a user model later with information about the logged-in user
	this.setUser();
	var user = new App.Model.User({
		"user" : App.user
	})
	var nav = new App.View.Nav({
		model : user
	});

	$.ajax("/api/lists?all=true", {
		method : "GET",
		headers : {
			"Authorization" : App.helpers.getAuthHeader()
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