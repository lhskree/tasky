var App = App || {};

$(function () {

	$.get('/static/templates.html', function (templates) {

		$("body").append(templates);
		var home = new App.View.Home();

		var token = App.helpers.getAuthToken() || false;
		if (token) {
			$.ajax("/api/auth", {
				method : "POST",
				headers : {
					"Authorization" : "Bearer " + token
					}
				}
			)
			.success(function() {
				App.helpers.getBoard();
				// Get rid of the home view
				home.remove();
			}).fail(function (err, jqxhr) {
				console.log(err);
			});
		}

	});

});