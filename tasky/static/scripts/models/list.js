var App = App || {};
App.Model = App.Model || {};

App.Model.List = Backbone.Model.extend({

	urlRoot : "/api/lists",

	idAttribute : "oid",

	defaults : {
		"title" : "Click to Edit",
		"order" : 0,
		"tasks" : [],
	}

});