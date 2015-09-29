var App = App || {};
App.View = App.View || {};

App.View.List = Backbone.View.extend({

	className : "list",

	initialize : function () {
		_.bindAll(this, "render");
		this.template = Handlebars.compile($("#template-list").html())
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.attr({
			"data-order" : this.model.get("order"),
			"data-oid" : this.model.get("oid")
		});
		$("#lists").prepend(this.$el);
	},

	render : function () {
		this.$el.html(this.template(this.model.toJSON()));
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click .list__title" : "showListOptions",
		"click .list__options__close" : "hideListOptions",
		"click .list__options__save" : "saveList",
		"click .list__options__delete" : "deleteList",
		"click .tasks__new" : "createNewTask",
		"click .task__quickOptions" : "showQuickOptions",
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
		this.hideListOptions();
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

	createNewTask : function (e) {
		console.log("Creating a new task");
		var task = new App.Model.Task();
		var taskList = this.model.get("tasks");
		taskList.push({
			"title" : "",
			"modal-target" : "#" + task.cid
		});
		this.model.set(taskList);
		// Re-render the list
		this.render();
		// Create the modal view
		var taskView = new App.View.Task({
			model : task,
		});
		// Assign the client-id to the view until the model is saved
		taskView.$el.attr("id", task.cid);
	},

	showQuickOptions : function (e) {
		var $target = $(e.currentTarget);
		$target.siblings(".quickOptions").toggleClass("quickOptions--visible");
	},

	hideQuickOptions : function (e) {
		var $target = $(e.currentTarget);
		$target.siblings(".quickOptions").removeClass("quickOptions--visible");
	},

});