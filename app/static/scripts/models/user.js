var App = App || {};
App.Model = App.Model || {};

App.Model.User = Backbone.Model.extend({

	urlRoot : "/api/user",

	idAttribute : "oid"

});