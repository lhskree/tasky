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
		// The parent of the new list is the instance of the App.View.Application
		listView.parentView = this.parentView;
	},

	logout : function () {
		App.View.Applicaiton.unsetAuthToken();
		window.location = "/";
	}

})