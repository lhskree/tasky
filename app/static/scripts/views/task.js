var App = App || {};
App.View = App.View || {};

App.View.Task = Backbone.View.extend({

	className : "fade modal",

	initialize : function () {
		this.template = Handlebars.compile($("#template-task").html());
		this.$el.attr("id", this.model.cid);
		this.$el.html((this.template(this.model.toJSON())));
		this.$el.modal({show:false});
		this.model.on('change', this.render, this);
		this.model.on('change:title change:oid', this.updateParent, this);
		$("body").append(this.$el);
	},

	render : function () {
		this.$el.html(this.template(this.model.toJSON()));
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click .modal-task__title h3" : "editTaskTitle",
		"click .title__edit .edit__save" : "validateTitle",
		"click .title__edit .edit__close" : "closeTaskTitle",
		"click .description__edit .edit__save" : "saveTaskDescription",
	},

	syncModel : function () {
		this.model.save(
			this.model.toJSON(),
			{
				success : function (model, response, options) {
					console.log("Success updating task");
					console.log(model.toJSON());
				},

				error : function (model, response, options) {
					console.log("Error updating task");
				},
			}
		);
	},

	editTaskTitle : function () {
		this.$el.find(".modal-task__title h3").hide();
		this.$el.find(".title__edit").show();
		this.$el.find(".title__edit input").focus();
	},

	validateTitle : function () {
		console.log("Saving the title");
		var $title = this.$el.find(".modal-task__title input");
		// TODO Validation
		if ($title.val()) {
			this.model.set("title", $title.val());
			this.syncModel();
		} else {
			// Let the user know to enter a title or hide the options
		}
		this.closeTaskTitle();
	},

	closeTaskTitle : function () {
		this.$el.find(".modal-task__title h3").show();
		this.$el.find(".title__edit").hide();
	},

	validateDescription : function () {
		var $description = this.$el.find(".modal-task__description");
		// TODO validation
		if ($description.val()) {
			this.model.set("description", $description.val());
			this.syncModel();
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