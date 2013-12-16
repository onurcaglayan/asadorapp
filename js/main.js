var Asador = (function ($, User) {

	var APP_ID = "178631135678286";

    var App = {

        loadPage: function () {
        	this.init();
        },

        getLoginStatus: function() {
	        var that = this;
	        return FacebookApi
	          .getLoginStatus()
	          .then(function(authResponse) {
	            that.set('auth', authResponse);
	            that.set('loggedIn', true);
	            that.fetchFbUser();
	            that.updateTokenToLongLived();
	            return authResponse;
	          }, function(authResponse) {
	            that.set('loggedIn', false);
	            return authResponse;
	        });
	     },

        init: function () {

        	var that = this;

        	FacebookApi.init(APP_ID);

        	$("#connect-with-facebook").bind("click", function() {
        		User.loginToFacebook()
		          	.done(that.setThePageByUserStatus)
	          	  	.fail(that.somethingWrong);
        	});


        	var loginDeferred = User.getLoginStatus();

        	loginDeferred
	          	.done(that.setThePageByUserStatus)
	          	.fail(that.somethingWrong);
        },

        setThePageByUserStatus: function() {
	        var that = this;
	       
	       	if(User.get('isLogged')) {
	       		$("#public").hide();
	       		$("#logged").show();
	       	}
	       	else {
	       		$("#logged").hide();
	       		$("#public").show();
	       	}
	      },


        somethingWrong: function() {
        	//TODO: change this with model dialog user friendly form.
        	alert("something wrong!");
      	}
    };

    return App;

})(jQuery, User);