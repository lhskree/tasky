var App = App || {};
App.View = App.View || {};

App.View.Nav = Backbone.View.extend({

	initialize : function () {
		// Compile template and bind to the DOM
		this.template = Handlebars.compile($("#template-nav").html());
		this.$el.html(this.template(this.model.toJSON())); // Maybe make this a real model? a user model will
			// probably be needed later
		$("body").append(this.$el);
		this.render();
	},

	render : function () {
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click #newList" : "createNewList",
		"click #logout" : "logout"
	},

	createNewList : function () {
		var list = new App.Model.List();
		var listView = new App.View.List({
			model : list,
		});
	},

	logout : function () {
		App.helpers.unsetAuthToken();
		window.location = "/";
		// Unset user
		App.user = null;
	}

})