var Asador = (function ($) {

	var APP_ID = "178631135678286";

    var App = {

        loadPage: function () {

        },

        connectWithFB: function () {

        },

        init: function () {

        	FacebookApi.init(APP_ID);

        	console.log(FacebookApi.getLoginStatus());

        	$("#connect-with-facebook").bind("click", function() {
        		FacebookApi.login();
        	});
        }

    };

    return App;

})(jQuery);