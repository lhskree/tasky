var App = App || {};
App.Model = App.Model || {};

App.Model.Task = Backbone.Model.extend({

	urlRoot : "/api/tasks",

	idAttribute : "oid",

	defaults : {
		"title" : "",
		"description" : "",
		"owner" : "",
		"member" : [],
		"dateCreate" : new Date(),
		"dateDue" : "",
		"attachments" : [],
		"order" : 0,
		"comments" : [],
	}

});