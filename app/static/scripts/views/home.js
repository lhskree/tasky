var App = App || {};
App.View = App.View || {};

App.View.Home = Backbone.View.extend({

	initialize : function () {
		// Compile template and bind to the DOM
		this.template = Handlebars.compile($("#template-home").html());
		this.$el.html(this.template());
		$("body").append(this.$el);
		this.render();
	},

	render : function () {
		this.delegateEvents(this.events);
		return this;
	},

	events : {
		"click #showLogin" : "showLogin",
		"click #login button[type='submit']" : "validateLogin",
		"click #newUser button[type='submit']" : "validateNewUser"
	},

	showLogin : function () {
		$("#login").show();
	},

	validateNewUser : function (e) {
		e.preventDefault();
		if ($("#signupEmail").val() && $("#signupPass1").val()) {
			if ($("#signupPass1").val() == $("#signupPass2").val()) {
				console.log("TACOCOCOC");
				$.ajax("/api/user", {
					method : "POST",
					contentType : "application/json",
					data : JSON.stringify({
						"signupEmail" : $("#signupEmail").val(),
						"signupPass1" : $("#signupPass1").val(),
						"signupPass2" : $("#signupPass2").val()
					})
				})
				.success(function (data) {
					console.log(data);
				})
				.fail(function (jqxhr) {
					console.log(jqxhr);
				});
			}
		}
	},

	validateLogin : function () {

	}

});