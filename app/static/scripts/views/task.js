var App = App || {};
App.View = App.View || {};

App.View.Task = Backbone.View.extend({

	initialize : function () {
		this.template = Handlebars.compile($("#template-task").html());
		this.render();
	},

	render : function () {
		this.setElement(this.template(this.model.toJSON()));
		$("body").append(this.$el);
		// Initialize the modal
		this.$el.modal({show:false});
		this.delegateEvents(this.events);
		return this;
	},

	events : {
	},


})