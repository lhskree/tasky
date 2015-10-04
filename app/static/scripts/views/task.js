var App = App || {};
App.View = App.View || {};

App.View.Task = Backbone.View.extend({

	className : "fade modal",

	initialize : function () {

		// Compile template and bind to the DOM but don't show it immediately
		this.template = Handlebars.compile($("#template-task").html());
		this.$el.attr("id", this.model.get("oid") || this.model.cid);
		this.$el.html((this.template(this.model.toJSON())));
		this.$el.modal({show:false});
		$("body").append(this.$el);

		// Render, sync, and update parent on certain changes
		this.model.on('change', this.render, this);
		this.model.on('change', this.syncModel, this);
		this.model.on('change:title change:oid', this.updateParent, this);
	},

	render : function () {
		this.$el.html(this.template(this.model.toJSON()));
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click .modal-title h3" : "editTaskTitle",
		"click .modal-title .save" : "validateTitle",
		"click .modal-title .close" : "closeTaskTitle",
		"click .modal-description p" : "editTaskDescription",
		"click .modal-description .edit" : "editTaskDescription",
		"click .modal-description .save" : "validateDescription",
		"click .modal-description .close" : "closeTaskDescription"
	},

	syncModel : function () {
		this.model.save(
			this.model.toJSON(),
			{
				success : function (model, response, options) {
					// console.log("Task model synced");
				},

				error : function (model, response, options) {
					console.log("Error updating task");
				},
			}
		);
	},

	editTaskTitle : function () {
		this.$el.find(".modal-title h3").hide();
		this.$el.find(".modal-title .editor").show();
	},

	editTaskDescription : function () {
		this.$el.find(".modal-description p").hide();
		this.$el.find(".modal-description .editor").show();
	},

	validateTitle : function () {
		var $title = this.$el.find(".modal-title input");
		// TODO Validation
		if ($title.val()) {
			this.model.set("title", $title.val());
		} else {
			// Let the user know to enter a title or hide the options
		}
		this.closeTaskTitle();
	},

	closeTaskTitle : function () {
		this.$el.find(".modal-title h3").show();
		this.$el.find(".modal-title .editor").hide();
	},

	closeTaskDescription : function () {
		this.$el.find(".modal-description p").show();
		this.$el.find(".modal-description .editor").hide();
	},

	validateDescription : function () {
		var $description = this.$el.find(".modal-description .description");
		// TODO validation
		if ($description.val()) {
			this.model.set("description", $description.val());
		} else {
			// Let the user know to enter a title or hide the options
		}
	},

	updateParent : function () {
		var tasks = this.model.parent.get("tasks");
		var idx = _.findIndex(tasks, {
			"title" : this.model.previous("title"),
			"oid" : this.model.previous("oid") || this.model.cid
		});
		tasks[idx] = {
			"title" : this.model.get("title"),
			"oid" : this.model.get("oid") || this.model.cid,
			"unsaved" : this.model.isNew()
		};
		this.model.parent.set("tasks", tasks);
		this.model.parent.trigger('change', this.model.parent);
	}


})