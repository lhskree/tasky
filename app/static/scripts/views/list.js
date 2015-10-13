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
		this.childViews = [];
		this.loadTasks();

		// Bind render on change
		this.model.on('change', this.render, this);
		this.model.on('change', this.updateChildren, this);
		this.model.on('change', this.syncModel, this);
	},

	render : function () {
		this.$el.html(this.template(this.model.toJSON()));
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click .list__title .title" : "showListOptions",
		"click .list__title .save" : "validateTitle",
		"click .list__title .close" : "hideListOptions",
		"click .tasks__new" : "createNewTask",
		"click .task__quickOptions" : "showQuickOptions"
	},

	validateTitle : function () {
		console.log("Validating new title");
		var $title = this.$el.find(".list__title input");
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

				headers : {
					"Authorization" : App.View.Application.getAuthHeader()
				},

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
		this.$el.find(".list__title .title").hide();
		this.$el.find(".list__title .editor").addClass("editor--show");
	},

	hideListOptions : function () {
		this.$el.find(".list__title .title").show();
		this.$el.find(".list__title .editor").removeClass("editor--show");
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
			"title" : task.get("title"),
			"oid" : task.cid,
		});
		// This won't trigger a change in the list model,
		// which is good since the new task model hasn't been synced;
		// we don't want it saved, yet!
		this.model.set("tasks", tasks);
		// We do, however, want it rendered
		this.render();

		// Create the task's view
		var taskView = new App.View.Task({
			model : task,
		});
		// Bind parent / children views for updating subviews
		taskView.parentView = this;
		this.childViews.push(taskView);
	},

	// Iterates over children (task models) and updates their title
	updateChildren : function () {
		var title = this.model.get("title");
		_.each(this.children, function (child) {
			child.set("parentList", title);
		});
	},

	loadTasks : function () {
		var taskList = this.model.get("tasks");
		var which = this;
		taskList.forEach(function (t) {
			// Only load tasks that have been saved, otherwise they won't have
			// a proper oid in mongo
			var task = new App.Model.Task({
				"oid" : t.oid
			});
			task.fetch({
				success : function () {
					// Create the modal view
					var taskView = new App.View.Task({
						model : task,
					});
					which.childViews.push(taskView);
					task.parentView = which;
				},
				error : function(err) {
					console.log(err);
				}
			});
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