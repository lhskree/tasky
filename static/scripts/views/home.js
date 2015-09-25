var App = App || {};
App.View = App.View || {};

App.View.Home = Backbone.View.extend({

	initialize : function () {
		_.bindAll(this, "render");
		this.template = _.template($("#template-home").html());
		this.render();
	},

	render : function () {
		this.$el = $("#out");
		this.$el.html(this.template())
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