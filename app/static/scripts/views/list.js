var App = App || {};
App.View = App.View || {};

App.View.List = Backbone.View.extend({

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
		"click .tasks__task__title" : "editNewTask",
		"click .task__quickOptions" : "showQuickOptions"
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

	createNewTask : function () {
		console.log("Creating a new task");
		var taskList = this.model.get("tasks");
		taskList.push({
			"title" : ""
		});
		this.render();
		this.delegateEvents(this.events);
	},

	editNewTask : function (e) {
		console.log("Editing the task");
		var $target = $(e.currentTarget);
		if (!($target).attr("data-target")) {
			var task = new App.Model.Task();
			var taskView = new App.View.Task({
				model : task
			});
			$target.attr("data-target", "#" + taskView.id);
			$(taskView.id).modal();
			taskView.$parent = $target.parent();
			// This view doesn't render via init
			//since it needs more information about where it exists in the dom
			taskView.render();
		}
	},

	showQuickOptions : function (e) {
		var $target = $(e.currentTarget);
		$target.siblings(".quickOptions").toggleClass("quickOptions--visible");
	},

	hideQuickOptions : function (e) {
		var $target = $(e.currentTarget);
		$target.siblings(".quickOptions").removeClass("quickOptions--visible");
	}

});