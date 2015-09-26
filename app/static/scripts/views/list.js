var App = App || {};
App.View = App.View || {};

App.View.List = Backbone.View.extend({

	initialize : function () {
		_.bindAll(this, "render");
		this.template = Handlebars.compile($("#template-list").html())
		this.render();
	},

	render : function () {
		this.$el = $("#lists");
		this.$el.append(this.template(this.model.toJSON()));
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click .list__options__save" : "saveList",
		"click .list__options__close" : "hideListOptions",
		"click .tasks__new" : "createNewTask"
	},

	saveList : function () {
		console.log("Saving the group . . .");
	},

	hideListOptions : function () {

	},

	createNewTask : function () {
		
	}

});