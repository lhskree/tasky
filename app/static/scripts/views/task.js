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
		this.model.on('change', this.updateParent, this);
		console.log(this.model.parent);
		$("body").append(this.$el);
	},

	render : function () {
		this.$el.html(this.template(this.model.toJSON()));
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click .modal-task__title h3" : "editTaskTitle",
		"click .title__edit .edit__save" : "saveTaskTitle",
		"click .title__edit .edit__close" : "closeTaskTitle",
		"click .description__edit .edit__save" : "saveTaskDescription",
	},

	editTaskTitle : function () {
		this.$el.find(".modal-task__title h3").hide();
		this.$el.find(".title__edit").show();
		this.$el.find(".title__edit input").focus();
	},

	saveTaskTitle : function () {
		console.log("Saving the title");
		var $title = this.$el.find(".modal-task__title input");
		// TODO Validation
		if ($title.val()) {
			this.model.set("title", $title.val());
			if (this.model.hasChanged()) {
				this.model.save(
					this.model.toJSON(),
					{
						success : function (model, response, options) {
							console.log("Success updating task");
						},

						error : function (model, response, options) {
							console.log("Error updating task");
						},
					}
				);
			}
		} else {
			// Let the user know to enter a title or hide the options
		}
		this.closeTaskTitle();
	},

	closeTaskTitle : function () {
		this.$el.find(".modal-task__title h3").show();
		this.$el.find(".title__edit").hide();
	},

	saveTaskDescription : function () {
		var $description = this.$el.find(".modal-task__description");
		// TODO validation
		if ($description.val()) {
			this.model.set("description", $description.val());
			if (this.model.hasChanged()) {
				this.model.save(
					this.model.toJSON(),
					{
						success : function (model, response, options) {
							console.log("Success updating task");
						},

						error : function (model, response, options) {
							console.log("Error updating task");
						},
					}
				);
			}
		} else {
			// Let the user know to enter a title or hide the options
		}
	},

	updateParent : function () {
		console.log("update");
		console.log(this.model.toJSON());
		var taskList = this.model.parent.get("taskList");		
		taskList = _.remove(taskList, {
			"title" : this.model.previous("title"),
			"oid" : this.model.previous("oid")
		});
		taskList.push({
			"title" : this.model.get("title"),
			"oid" : this.model.get("oid")
		})
		this.model.parent.set("taskList", taskList);
	}


})