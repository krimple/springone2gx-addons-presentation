$(function() {
	$("#preso").bind("showoff:loaded", function (event) {

		$("body").append('<div id="copyright">&copy; 2012 SpringOne 2GX. All rights reserved. Do not distribute without permission.</div>')
		$("#footer").hide();
		
		$(".cover").bind("showoff:show", function (event) {
			$("#footer").hide();
			$("#copyright").show();
		});

		$(".cover").bind("showoff:next", function (event) {
			$("#footer").show();
			$("#copyright").hide();
		});
	});
});
