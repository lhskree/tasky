var App = App || {};
App.View = App.View || {};

// The model for this view will be the user that's logged in
App.View.Nav = Backbone.View.extend({

	initialize : function () {
		// Compile template and bind to the DOM
		this.template = Handlebars.compile($("#template-nav").html());
		this.$el.html(this.template(this.model.toJSON())); // Maybe make this a real model? a user model will
			// probably be needed later
		$("body").append(this.$el);

		// Bind changes
		this.model.on('change', this.syncModel, this);
		this.model.on('change', this.render, this);
		this.render();
	},

	render : function () {
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click #newList" : "createNewList",
		"click #logout" : "logout",
		"click #editDisplayName" : "editDisplayName",
		"click #editDisplayName .close" : "closeDisplayName",
		"click #editDisplayName .save" : "validateDisplayName"
	},

	syncModel : function () {
		this.model.save(
			this.model.toJSON(),
			{

				headers : {
					"Authorization" : App.View.Application.getAuthHeader()
				},

				success : function (model, response, options) {
					console.log("Synced user (from the nav)");
				},

				error : function (model, response, options) {
					console.log("Error syncing list");
				},
			}
		);
	},

	createNewList : function () {
		var list = new App.Model.List();
		var listView = new App.View.List({
			model : list,
		});
		// The parent of the new list is the instance of the App.View.Application
		listView.parentView = this.parentView;
	},

	logout : function () {
		App.View.Applicaiton.unsetAuthToken();
		window.location = "/";
	},

	editDisplayName : function () {
		$("#editDisplayName").hide();
		$("#editDisplayName .editor").addClass('editor--show');
	},

	closeDisplayName : function () {
		$("#editDisplayName").show();
		$("#editDisplayName .editor").removeClass('editor--show');
	}

})