var App = App || {};
App.View = App.View || {};

App.View.Home = Backbone.View.extend({

	initialize : function () {
		_.bindAll(this, "render");
		this.template = Handlebars.compile($("#template-home").html());
		this.render();
		this.fetchLists();
	},

	render : function () {
		this.$el = $("#out");
		this.$el.html(this.template())
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click #newList" : "createNewList"
	},

	createNewList : function () {
		console.log("Making a new list");
		var list = new App.Model.List();
		var listView = new App.View.List({
			model : list
		});
	},

	fetchLists : function () {
		console.log("Showing all lists");
		$.get('api/lists?all=true')
			.success(function (data) {
				data.results.forEach(function (result) {
					var list = new App.Model.List(result);
					var listView = new App.View.List({
						model : list
					});
				});
			})
			.fail(function (err) {
				console.log(err + "::failed to fetch lists");
			});
	}

});