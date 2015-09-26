var App = App || {};

App.Router = Backbone.Router.extend({

	routes : {

		"" : "home",

	},

	home : function () {
		console.log("Hello from the homepage!");
		var home = new App.View.Home();
	}

});