var App = App || {};
App.View = App.View || {};

App.View.Task = Backbone.View.extend({

	className : "task modal fade",

	initialize : function () {
		this.setId();
		this.$el.attr("id", this.id);
		this.template = Handlebars.compile($("#template-task").html());
	},

	render : function () {
		this.$el.html(this.template(this.model.toJSON()));
		this.$parent.prepend(this.$el);
		console.log(this.$el);
		this.delegateEvents(this.events);
		return this;
	},

	events : {
	},

	setId : function () {
		this.id = this.model.get("oid") || this.model.cid;
	}


})