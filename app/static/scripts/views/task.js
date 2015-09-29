var App = App || {};
App.View = App.View || {};

App.View.Task = Backbone.View.extend({

	className : "fade modal",

	initialize : function () {
		this.template = Handlebars.compile($("#template-task").html());
		this.$el.html((this.template(this.model.toJSON())));
		$("body").append(this.$el);
	},

	render : function () {
		this.setElement(this.template(this.model.toJSON()));
		// Initialize the modal
		this.$el.modal({show:false});
		this.delegateEvents(this.events);
		return this;
	},

	events : {
	},


})