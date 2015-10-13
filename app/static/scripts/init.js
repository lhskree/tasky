var App = App || {};

$(function () {

	$.get('/static/templates.html', function (templates) {

		$("body").append(templates);
		
		// The main application view / controller interface
		var app = new App.View.Application();

	});

});