    
var User =  (function($) {

    var User = {

        auth: null,
        loggedIn: false,
        registered: false,
        fbUser: null,
        country: null,
        city: null,
        hasEmail: false,
        name: null,

      isLoggedInFacebook: function() {
        return this.loggedIn;
      },

      hasEnteredEmail: function() {
        return this.hasEmail;
      },

      loginToFacebook: function() {
        var that = this;
        return FacebookApi
          .login()
          .then(function(authResponse) {
            that.auth = authResponse;
            that.loggedIn = true;
            that.updateTokenToLongLived();
            that.fetchFbUser();
            return authResponse;
          }, function(authResponse) {
            that.loggedIn = false;
            return authResponse;
          });
      },

      getLoginStatus: function() {
        var that = this;
        return FacebookApi
          .getLoginStatus()
          .then(function(authResponse) {
            that.auth = authResponse;
            that.loggedIn = true;
            that.fetchFbUser();
            that.updateTokenToLongLived();
            return authResponse;
          }, function(authResponse) {
            that.loggedIn = false;
            return authResponse;
        });
      },

      updateTokenToLongLived: function() {
        var that = this;
        var auth;
        FacebookApi
          .updateTokenToLongLived()
          .done(function(token) {
            auth = that.get('auth');
            auth.accessToken = token.content;
            that.set('auth', auth);
          });
      },

      fetchFbUser: function() {
        var that = this;
        return FacebookApi
          .getUser()
          .then(function(user) {
            that.set('fbUser', user);
            return user;
          }
        );
      },

      fetchFbUserLocation: function() {
        return this.fetchFbUser().then(function (user) {
          return FacebookApi.getUserLocation(user).then(function(location) {
            return location;
          });
        });
      },

      getName: function() {
        return this.get('fbUser') ? this.get('fbUser').name : null;
      },

      getFBEmail: function() {
        return this.get('fbUser') ? this.get('fbUser').email : null;
      },

      saveUser: function() {
        var fbAuth = this.get('auth');
        var city = this.get('city');
        var data = {
          FacebookUid : fbAuth.userID,
          FacebookAccessToken: fbAuth.accessToken
        };

        if(city) {
          data.City = {
            Id : city
          };
        } else {
          console.error('User cannot be saved without a city');
        }

        return $.ajax({
          url: "",
          data: JSON.stringify(data),
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json'
        });
      },

      getCountry: function() {
        var fbUser;
        var country = this.get('country');
        if (!country) {
          fbUser = this.get('fbUser');
          if (fbUser.location) {
            country = fbUser.location.name.split(',');
            country = country[1].trim();
          } else {
            country = '';
          }

        }
        return country;
      }
  }
   return User;
})(jQuery);