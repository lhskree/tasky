var App = App || {};
App.View = App.View || {};

App.View.Home = Backbone.View.extend({

	initialize : function () {
		_.bindAll(this, "render");
		this.template = Handlebars.compile($("#template-list").html());
		this.render();
	},

	render : function () {
		this.$el = $("#lists");
		this.$el.html(this.template();
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click #newGroup" : "createNewGroup"
	},

	createNewGroup : function () {
		console.log("Making a new group . . .");
	}

});