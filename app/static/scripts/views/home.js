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
		"click #showNewUser" : "showNewUser",
		"click #login button[type='submit']" : "validateLogin",
		"click #newUser button[type='submit']" : "validateNewUser",
		"click #emailExists" : "showLogin",
		"click #signupMessage .login" : "showLogin"
	},

	showNewUser : function (e) {
		e.preventDefault();
		$("#newUser").slideDown('slow');
		$("#login").slideUp('slow');
	},

	showLogin : function (e) {
		e.preventDefault();
		$("#emailExists").hide();
		$("#passwordMismatch").hide();
		$("#login").slideDown('slow');
		$("#newUser").slideUp('slow');
	},

	validateNewUser : function (e) {
		e.preventDefault();
		var which = this;
		if ($("#signupEmail").val() && $("#signupPass1").val()) {
			if ($("#signupPass1").val() == $("#signupPass2").val()) {
				$.ajax("/api/user", {
					method : "POST",
					contentType : "application/json",
					data : JSON.stringify({
						signupEmail : $("#signupEmail").val(),
						signupPass1 : $("#signupPass1").val(),
						signupPass2 : $("#signupPass2").val()
					})
				})
				.success(function (response) {
					if (response.err) {
						switch (response.typ) {
							case("EmailExists"):
								$("#emailExists").show();
								break;
							case("PasswordMismatch"):
								$("passwordMismatch").show();
								break;
							case("MongoWriteError"):
								// Handle in ui?
								break;
							default:
								// Shouldn't ever get here
						}
					}
					if (response.token) {
						App.helpers.setAuthToken(response.token);
						App.helpers.getBoard();
						App.helpers.setUser();
						// Destroy this view
						which.remove();
					}
				})
				.fail(function (jqxhr) {
					console.log(jqxhr);
				});
			// Passwords don't match
			} else {
				$("#passwordMismatch").show();
			}
		// Invalid email address
		} else {
			$("#invalidEmail").show();
		}
	},

	validateLogin : function (e) {
		e.preventDefault();
		var which = this;
		if ($("#loginEmail").val() && $("#loginPass").val()) {
			$.ajax("/api/login", {
				method : "POST",
				contentType : "application/json",
				data : JSON.stringify({
					email : $("#loginEmail").val(),
					password : $("#loginPass").val()
				})
			})
			.success(function (response) {
				if (response.err) {
					switch (response.typ) {
						default:
							break;
					}
				}
				if (response.token) {
					App.helpers.setAuthToken(response.token);
					App.helpers.getBoard();
					App.helpers.setUser();
					// Destroy this view
					which.remove();
				}
			})
			.fail(function (jqxhr) {
				if (jqxhr.status == 401) {
					$("#invalidLogin").show();
				}
			})
		}
	}

});