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

App.helpers.getBoard = function () {
	// This should probably be it's own naviagtion . . .
	var newList = $('<button id="newList">Add a New Task Group</button>')
	.addClass('btn btn-primary col-lg-2');
	var logout = $('<button id="logout">Logout</button>')
	.addClass('btn btn-link col-lg-2');
	$("body")
	.append(newList)
	.append(logout)
	.append('<div id="lists"></div>');

	// Initial events and handlers
	$("#newList").click(function () {
		var list = new App.Model.List();
		var listView = new App.View.List({
			model : list,
		});
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