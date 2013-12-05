 
var FacebookApi =  (function($) {

    var FacebookApi = {

      extendedPermissions: 'read_stream, read_friendlists, offline_access, publish_stream, email, publish_actions, user_location, user_birthday, friends_location, friends_birthday',
      isLogged: false,
      user: null,
      accessToken: null,
      userId: null,

      setLoginInfo: function(authResponse) {
        this.userId = authResponse ? authResponse.userID : null;
        this.accessToken = authResponse ? authResponse.accessToken : null;
      },

      getLoginStatus: function() {
        var promiseOnGetStatus = $.Deferred();
        var that = this;

        FB.getLoginStatus(function(response) {
          that.setLoginInfo(response.authResponse);
          that.isLogged = response.status === 'connected';
          if (that.isLogged) {
            promiseOnGetStatus.resolve(response.authResponse);
          } else {
            promiseOnGetStatus.reject(response.authResponse);
          }
        });
        return promiseOnGetStatus;
      },

      login: function() {
        var promiseOnLogin = $.Deferred();
        var permissions = this.extendedPermissions;
        var that = this;

        FB.login(function(response) {
          that.setLoginInfo(response.authResponse);
          that.isLogged = response.status === 'connected';
          if (that.isLogged) {
            promiseOnLogin.resolve(response.authResponse);
          } else {
            promiseOnLogin.reject(response.authResponse);
          }
        }, {
          scope: permissions
        });

        return promiseOnLogin;
      },

      getUser : function() {
        var promiseOnGetUser = $.Deferred();

        FB.api('/me', function(user) {
          if (!user || user.error) {
            promiseOnGetUser.reject();
          } else {
            this.user = user;
            promiseOnGetUser.resolve(user);
          }
        });

        return promiseOnGetUser;
      },

      getUserLocation : function(user) {
        var promiseOnGetUserLocation = $.Deferred();

        FB.api(
          {
              method: 'fql.query',
              query: 'SELECT current_location FROM user WHERE uid = ' + user.id
          },
          function(data) {
            if (!data[0] || !data[0]['current_location']) {
              promiseOnGetUserLocation.reject();
            } else {
              promiseOnGetUserLocation.resolve(data[0]['current_location']);
            }
          }
        );

        return promiseOnGetUserLocation;
      },

      openFacebookDialog: function(options) {
        var promiseOnFbDialog = $.Deferred();
        FB.ui({
          method: options.method,
          link: options.href || options.link,
          to: options.to || null,
          picture: options.picture,
          name: options.name,
          caption: options.caption,
          description: options.description
        }, function(response) {
          promiseOnFbDialog.resolve(response);
        });

        return promiseOnFbDialog;
      },

      init: function (APP_ID) {
        FB.init({
          appId: APP_ID,
          status: true,
          cookie: true,
          xfbml: true
        });
      }
    }
    return FacebookApi;
  })(jQuery);