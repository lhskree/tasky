var App = App || {};
App.Model = App.Model || {};

App.Model.List = Backbone.Model.extend({

	urlRoot : "/api/lists",

	defaults : {
		"title" : "Click to Change the Title",
		"order" : 0,
		"tasks" : [],
		"oid" : false
	}

})