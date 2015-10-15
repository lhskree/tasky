var App = App || {};
App.Model = App.Model || {};

App.Model.Task = Backbone.Model.extend({

	urlRoot : "/api/tasks",

	idAttribute : "oid",

	defaults : {
		"title" : "Edit the title",
		"parentList" : "",
		"parentOID" : "",
		"description" : " ",
		"owner" : "",
		"members" : [],
		"dateCreated" : new Date(),
		"dateDue" : "",
		"attachments" : [],
		"order" : 0,
		"comments" : [],
	}

});