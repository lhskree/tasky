var App = App || {};

$(function () {

	$.get('/static/templates.html', function (templates) {

		$("body").append(templates);

		// Initial events and handlers
		$("#newList").click(function () {
			console.log("Making a new list");
			var list = new App.Model.List();
			var listView = new App.View.List({
				model : list,
			});
		});

		$.ajax("/api/lists?all=true", { headers : {
			"Authorization" : App.helpers.getAuthHeader()
		}})
			.success(function (data) {
				if (data.results.length) {
					var $lists = $("#lists");
					data.results.forEach(function (list) {
						var list = new App.Model.List(list);
						var listView = new App.View.List({
							model : list
						});
					});
				}
			})
			.fail(function (err) {
				console.log("Failed to get lists.");
				console.log(err);
			})

	});

});