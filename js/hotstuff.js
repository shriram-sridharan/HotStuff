document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	document.getElementById('data').innerHTML = "Device Ready";
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);

	alert("Device is Ready");

}

//What to do when paused
function onPause() {
	alert("paused!");
}

//What to do when resumed
function onResume() {
	// getLoginStatus();
	alert("resume");
}

if (( typeof cordova == 'undefined') && ( typeof Cordova == 'undefined'))
	alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
if ( typeof CDV == 'undefined')
	alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
if ( typeof FB == 'undefined')
	alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

FB.Event.subscribe('auth.login', function(response) {
	alert('auth.login event');
});

FB.Event.subscribe('auth.logout', function(response) {
	alert('auth.logout event');
});

FB.Event.subscribe('auth.sessionChange', function(response) {
	alert('auth.sessionChange event');
});

FB.Event.subscribe('auth.statusChange', function(response) {
	alert('auth.statusChange event');
});

/*function getSession() {
 alert("session: " + JSON.stringify(FB.getSession()));
 }
 */

var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + new Date(position.timestamp)      + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function getLoginStatus() {
	FB.getLoginStatus(function(response) {
		if (response.status == 'connected') {
			var uid = response.authResponse.userID;
			var accessToken = response.authResponse.accessToken;
			FB.api('/me', {
				fields : 'id, username'
			}, function(response) {
				if (response.error) {
					alert(JSON.stringify(response.error));
				} else {
					alert(response.id);
					alert(response.username); 
					alert(accessToken);
					navigator.geolocation.getCurrentPosition(onSuccess, onError);
					var posting = $.post("url", {
						fb_uid : response.id,
						fb_username : response.username,
						fb_accesstoken : accessToken,
						lat : "46.00004",
						lng : "-85.000005",
						what : "shriram is hacking!"
					});
					
					posting.done(function( data ) {
					    if("OK".equals(data))
					    	alert("OK");
					    else
					    	alert("Not OK");
					});
					
					posting.fail(function() {
   						 alert( "failed" );
					});
					
					posting.always(function() {
   						 alert( "finished" );
					});
				}
				alert("Coming here 2");
			});
		} else if (response.status === 'not_authorized') {
			alert('not logged in');
			document.getElementById('shouldLogin').innerHTML = "<button onclick='login()'>Login Using Facebook</button>";
		} else {
			alert("Not connected to FB at all.");
		}
	});
}

function logout() {
	FB.logout(function(response) {
		alert('logged out');
	});
}

function login() {
	FB.init({
		appId : "346598232144666",
		nativeInterface : CDV.FB,
		useCachedDialogs : false
	});

	FB.login(function(response) {

		if (response.session) {
			alert('logged in');
		} else {
			alert('not logged in');
		}
	}, {
		scope : "email"
	});
}

document.addEventListener('deviceready', function() {
	try {
		document.getElementById('data').innerHTML = "Device Ready";
		alert('Device is ready! Make sure you set your app_id below this alert.');
		FB.init({
			appId : "346598232144666",
			nativeInterface : CDV.FB,
			useCachedDialogs : false
		});
		getLoginStatus();
		document.getElementById('data').innerHTML = "";
	} catch (e) {
		alert(e);
	}
}, false);
