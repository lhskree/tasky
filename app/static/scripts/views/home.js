var App = App || {};
App.View = App.View || {};

App.View.Home = Backbone.View.extend({

	initialize : function () {
		// Compile template and bind to the DOM
		this.template = Handlebars.compile($("#template-home").html());
		this.$el.html(this.template());
		$("body").append(this.$el);
		this.render();
	},

	render : function () {
		this.delegateEvents(this.events);
		return this;
	},

	event : {
		"click .showLogin" : "showLogin"
	},

	showLogin : function () {

	}

});