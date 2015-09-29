var App = App || {};
App.Model = App.Model || {};

App.Model.List = Backbone.Model.extend({

	urlRoot : "/api/lists",

	idAttribute : "oid",

	defaults : {
		"title" : "",
		"order" : 0,
		"tasks" : [],
	}

});