var App = App || {};
App.View = App.View || {};

App.View.Task = Backbone.View.extend({

	className : "fade modal",

	initialize : function () {
		this.template = Handlebars.compile($("#template-task").html());
		this.$el.html((this.template(this.model.toJSON())));
		this.$el.modal({show:false});
		$("body").append(this.$el);
	},

	render : function () {
		this.setElement(this.template(this.model.toJSON()));
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
							this.render();
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
			this.model.set("title", $title.val());
			if (this.model.hasChanged()) {
				this.model.save(
					this.model.toJSON(),
					{
						success : function (model, response, options) {
							console.log("Success updating task");
							this.render();
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
		this.hideListOptions();
	}


})