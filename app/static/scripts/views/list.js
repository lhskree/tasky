var App = App || {};
App.View = App.View || {};

App.View.List = Backbone.View.extend({

	className : "list",

	initialize : function () {
		_.bindAll(this, "render");
		this.template = Handlebars.compile($("#template-list").html())
		this.render();
	},

	render : function () {
		this.$el.html(this.template(this.model.toJSON()));
		$("#lists").prepend(this.$el);
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click .list__title" : "showListOptions",
		"click .list__options__close" : "hideListOptions",
		"click .list__options__save" : "saveList",
		"click .list__options__delete" : "deleteList",
		"click .tasks__new" : "createNewTask",
		"focusout .list__title" : "hideListOptions"
	},

	saveList : function () {
		console.log("Saving the group");
		var $title = this.$el.find(".list__title");
		if ($title.val()) {
			this.model.set("title", $title.val());
			if (this.model.hasChanged()) {
				this.model.save(
					this.model.toJSON(),
					{
						success : function (model, response, options) {
							console.log("Success updating list")
						},

						error : function (model, response, options) {
							console.log("Error updating list");
						},
					}
				);
			}
		} else {
			// Let the user know to enter a title or hide the options
		}
	},

	showListOptions : function () {
		this.$el.find(".list__options").show();
	},

	hideListOptions : function () {
		this.$el.find(".list__options").hide();
	},

	deleteList : function () {
		this.model.destroy();
		this.$el.remove();
	},

	createNewTask : function () {
		console.log("Creating a new task");
	}

});