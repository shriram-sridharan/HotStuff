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

// onError Callback receives a PositionError object
//
function onError(error) {
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

var accessToken;

function getLoginStatus() {
	FB.getLoginStatus(function(response) {
		if (response.status == 'connected') {
			accessToken = response.authResponse.accessToken;
			document.getElementById('shouldLogin').innerHTML = "<input type = 'text' id='what'> </input> <button onclick='post()'>Recommend</button>";
		} else if (response.status === 'not_authorized') {
			alert('not logged in');
			document.getElementById('shouldLogin').innerHTML = "<button onclick='login()'>Login Using Facebook</button>";
		} else {
			alert("Not connected to FB at all.");
		}
	});
}


function post() {
	FB.api('/me', {
		fields : 'id, username'
	}, function(response) {
		if (response.error) {
			alert(JSON.stringify(response.error));
		} else {
			alert(response.id);
			alert(response.username);
			alert(accessToken);

			var latitude = 0, longitude = 0;

			navigator.geolocation.getCurrentPosition(function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				alert('Latitude: ' + position.coords.latitude + '\n' + 'Longitude: ' + position.coords.longitude + '\n');
			}, onError);

			alert($('what'));

			var posting = $.post("url", {
				fb_uid : response.id,
				fb_username : response.username,
				fb_accesstoken : accessToken,
				lat : latitude,
				lng : longitude,
				what : $('#what')
			});

			posting.done(function(data) {
				if ("OK".equals(data))
					alert("OK");
				else
					alert("Not OK");
			});

			posting.fail(function() {
				alert("failed");
			});

			posting.always(function() {
				alert("finished");
			});
		}
		alert("Coming here 2");
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
