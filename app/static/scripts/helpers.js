var App = App || {};
App.helpers = {};

/*********************
This section contains various application helper functions
*********************/

App.storage = window.localStorage;

App.helpers.getAuthToken = function () {
	return App.storage.getItem("token") || false;
}

App.helpers.setAuthToken = function (token) {
	App.storage.setItem("token", token);
	return true;
}

App.helpers.getAuthHeader = function () {
	return "Bearer " + App.helpers.getAuthToken();
}

App.helpers.unsetAuthToken = function () {
	App.storage.removeItem("token");
	return true;
}