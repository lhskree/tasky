var App = App || {};

$(function () {

	$.get('/static/templates.html', function (templates) {

		$("body").append(templates);
		
		var router = new App.Router;

		Backbone.history.start();

	});

});