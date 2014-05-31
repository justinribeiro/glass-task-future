var helper = {
  /**
  * Stores some state for later.
  */
  state: $("meta[name='glass-daily-card-state']").attr('content'),
  
  /**
  * Hides the sign-in button and connects the server-side app after
  * the user successfully signs in.
  *
  * @param {Object} authResult An Object which contains the access token and
  *   other authentication information.
  */
  onSignInCallback: function(authResult) {
    $('#authResult').html('Auth Result:<br/>');
    for (var field in authResult) {
      $('#authResult').append(' ' + field + ': ' + authResult[field] + '<br/>');
    }

    if (authResult['access_token']) {

      // The user is signed in
      this.authResult = authResult;
      helper.connectServer();

      // After we load the Google+ API, render the profile data from Google+.
      gapi.client.load('plus','v1',this.renderProfile);

    } else if (authResult['error']) {

      // There was an error, which means the user is not signed in.
      // As an example, you can troubleshoot by writing to the console:
      console.log('There was an error: ' + authResult['error']);
      $('#authResult').append('Logged out');
      $('#authOps').hide('slow');
      $('#gConnect').show();
    }

    console.log('authResult', authResult);
  },
  /**
  * Retrieves and renders the authenticated user's Google+ profile.
  */
  renderProfile: function() {
    var request = gapi.client.plus.people.get( {'userId' : 'me'} );
    request.execute( function(profile) {

      $('#gplus-displayName').empty();
      $("#gplus-tagline").empty();
      $("#gplus-url").empty();

      if (profile.error) {
        $('#profile').append(profile.error);
        return;
      }

      // Cheap trick; override the api's default 50px profile size
      $("#gplus-profile-picture").attr("src", profile.image.url + "&sz=200");

      $("#gplus-displayName").html(profile.displayName);
      $("#gplus-tagline").html(profile.tagline);
      $("#gplus-url").attr("href", profile.url).text(profile.url);

    });

    $('#authOps').show('slow');
    $('#gConnect').hide();
  },
  /**
  * Calls the server endpoint to disconnect the app for the user.
  */
  disconnectServer: function() {
    // Revoke the server tokens
    $.ajax({
      type: 'POST',
      url: "//" + window.location.host + '/disconnect',
      async: false,
      success: function(result) {
        console.log('revoke response: ' + result);
        $('#authOps').hide();
        
        $('#gplus-displayName').empty();
        $("#gplus-tagline").empty();
        $("#gplus-url").empty();

        $('#authResult').empty();
        $('#gConnect').show();
      },
      error: function(e) {
        console.log(e);
      }
    });
  },
  /**
  * Calls the server endpoint to connect the app for the user. The client
  * sends the one-time authorization code to the server and the server
  * exchanges the code for its own tokens to use for offline API access.
  * For more information, see:
  *   https://developers.google.com/+/web/signin/server-side-flow
  */
  connectServer: function() {
    console.log(this.authResult.code);
    $.ajax({
      type: 'POST',
      url: "//" + window.location.host + '/connect?state=' + this.state,
      contentType: 'application/octet-stream; charset=utf-8',
      success: function(result) {
        console.log(result);
      },
      processData: false,
      data: this.authResult.code
    });
  }
};

$(document).ready(function() {
  $('#disconnect').click(helper.disconnectServer);
});

/**
* Calls the helper method that handles the authentication flow.
*
* @param {Object} authResult An Object which contains the access token and
*   other authentication information.
*/
function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult);
}
