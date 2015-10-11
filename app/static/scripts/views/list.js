var App = App || {};
App.View = App.View || {};

App.View.List = Backbone.View.extend({

	className : "list",

	initialize : function () {
		// Create and render template, append to the DOM
		this.template = Handlebars.compile($("#template-list").html())
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.attr({
			"data-order" : this.model.get("order"),
			"data-oid" : this.model.get("oid")
		});
		$("#lists").prepend(this.$el);

		// Load and render subviews, if applicable
		this.loadTasks();

		// Bind render on change
		this.model.on('change', this.render, this);
		this.model.on('change', this.syncModel, this);
	},

	render : function () {
		this.$el.html(this.template(this.model.toJSON()));
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click .list__title" : "showListOptions",
		"click .list__options__close" : "hideListOptions",
		"click .list__options__save" : "validateTitle",
		"click .list__options__delete" : "deleteList",
		"click .tasks__new" : "createNewTask",
		"click .task__quickOptions" : "showQuickOptions",
		"click #logout" : "logout"
	},

	validateTitle : function () {
		console.log("Validating new title");
		var $title = this.$el.find(".list__title");
		if ($title.val()) {
			this.model.set("title", $title.val())
		} else {
			// Let the user know to enter a title or hide the options
			console.log("Empty title.");
		}
		this.hideListOptions();
	},

	syncModel : function () {
		this.model.save(
			this.model.toJSON(),
			{
				success : function (model, response, options) {
					console.log("Synced list");
					console.log(model.toJSON());
				},

				error : function (model, response, options) {
					console.log("Error syncing list");
				},
			}
		);
	},

	showListOptions : function () {
		this.$el.find(".list__options").show();
	},

	hideListOptions : function () {
		this.$el.find(".list__options").hide();
	},

	deleteList : function () {
		this.model.destroy();
		this.remove();
	},

	createNewTask : function (e) {
		var task = new App.Model.Task({
			// Parent title used in task template
			parentList : this.model.get("title"),
			// Use either the id from the server or the client id (the model must then be saved)
			parentOID : this.model.id || this.model.cid,
			title : "Edit the title"
			// This tells loadTasks to ignore this unsaved task if the page is closed and reopened
		});

		// Add this new task to this model's list of tasks
		var tasks = this.model.get("tasks");
		tasks.push({
			"title" : "Edit the title",
			"oid" : task.cid,
			unsaved : true
		});
		this.model.set("tasks", tasks);
		this.model.trigger('change', this.model);

		// Syncing at this point will save a new task with the unsaved flag,
		// which will be ignored by loadTasks
		if (this.model.isNew()) this.syncModel();

		// Bind parent model to child model (for updating the parent from the child)
		task.parent = this.model;

		// Create the task's view
		var taskView = new App.View.Task({
			model : task,
		});
	},

	logout : function () {
		App.helpers.unsetAuthToken();
		window.location = "/";
	},

	loadTasks : function () {
		var taskList = this.model.get("tasks");
		var which = this;
		taskList.forEach(function (t) {
			// Only load tasks that have been saved, otherwise they won't have
			// a proper oid in mongo
			if (!t.unsaved) {
				var task = new App.Model.Task({
					"oid" : t.oid
				});
				task.fetch({
					success : function () {
						task.parent = which.model;
						// Create the modal view
						var taskView = new App.View.Task({
							model : task,
						});
					},

					error : function(err) {
						console.log(err);
					}
				});
			} else {
				// Generate another blank, generic task view
				var task = new App.Model.Task({
					parentList : which.model.get("title"),
					parentOID : which.model.id,
					title : "Edit the title"
				});
				task.parent = which.model;
				var taskView = new App.View.Task({
					model : task,
				});
			}
		});
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