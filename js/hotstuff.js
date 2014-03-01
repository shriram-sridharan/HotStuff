document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	document.getElementById('data').innerHTML = "Device Ready";
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);

	// alert("Device is Ready");

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
	// alert('auth.login event');
});

FB.Event.subscribe('auth.logout', function(response) {
	alert('auth.logout event');
});

FB.Event.subscribe('auth.sessionChange', function(response) {
	alert('auth.sessionChange event');
});

FB.Event.subscribe('auth.statusChange', function(response) {
	// alert('auth.statusChange event');
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
var headerWithButton = "<h1>Chk't Out</h1><button onclick='#post'></button>";

function getLoginStatus() {
	FB.getLoginStatus(function(response) {
		if (response.status == 'connected') {
			accessToken = response.authResponse.accessToken;
			document.getElementById('recommend').innerHTML = "<input type = 'text' id='what'> </input> <button class='btn btn-success' onclick='post()'>Recommend</button>";
		} else if (response.status === 'not_authorized') {
			alert('Not logged in');
			
			document.getElementById('shouldLogin').innerHTML = "<button onclick='login()'>Login Using Facebook</button>";
		} else {
			alert("Not connected to FB at all.");
		}
	});
}

var latitude = 0, longitude = 0;
function getloc() {
	navigator.geolocation.getCurrentPosition(function(position) {
		newlatitude = position.coords.latitude;
		newlongitude = position.coords.longitude;

		var R = 6371;
		// km
		var x1 = newlatitude - latitude;
		var dLat = x1 * Math.PI / 180;
		var x2 = newlongitude - longitude;
		var dLon = x2 * Math.PI / 180;
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(latitude * Math.PI / 180) * Math.cos(newlatitude * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		// alert(d);

		if (d > 10) {
			// alert('New Position = Latitude: ' + position.coords.latitude + '\n' + 'Longitude: ' + position.coords.longitude + '\n');
			latitude = newlatitude;
			longitude = newlongitude;
			get();
		}
	}, onError, {
		maximumAge : 3000
	});
}

function post() {
	FB.api('/me', {
		fields : 'id, username'
	}, function(response) {
		if (response.error) {
			alert(JSON.stringify(response.error));
		} else {
			// alert(response.id);
			// alert(response.username);
			// alert(accessToken);
// 
			// alert('Latitude: ' + latitude + '\n' + 'Longitude: ' + longitude + '\n');
			// alert($("#what").val());
			var jsoninput = {};
			jsoninput.fb_uid = response.id;
			jsoninput.fb_username = response.username;
			jsoninput.fb_accesstoken = accessToken;
			jsoninput.lat = ''+latitude;
			jsoninput.lng = ''+longitude;
			jsoninput.what = $("#what").val();
			// alert(JSON.stringify(jsoninput, "", ""));
			var posting = $.post("http://ec2-54-201-190-159.us-west-2.compute.amazonaws.com/reco-post", 
			JSON.stringify(jsoninput, "", ""), 
			function(data) {
				if (data != "OK")
					alert("Recommendation Not Successful. Please try again later!");
			});

			posting.fail(function() {
				alert("failed");
			});

			posting.always(function() {
				// alert("finished");
			});
		}
	});
}

function get() {
	FB.api('/me', {
		fields : 'id, username'
	}, function(response) {
		if (response.error) {
			alert(JSON.stringify(response.error));
		} else {
			// alert(response.id);
			// alert(response.username);
			// alert(accessToken);
			// alert('Get Latitude: ' + latitude + '\n' + 'Longitude: ' + longitude + '\n');
			var jsoninput = {};
			jsoninput.fb_uid = response.id;
			jsoninput.fb_username = response.username;
			jsoninput.fb_accesstoken = accessToken;
			jsoninput.lat = ''+latitude;
			jsoninput.lng = ''+longitude;
			// alert(JSON.stringify(jsoninput, "", ""));
			var getting = $.post("http://ec2-54-201-190-159.us-west-2.compute.amazonaws.com/get-recos", 
			JSON.stringify(jsoninput, "", ""), 
			function(data) {
				document.getElementById('shouldLogin').innerHTML = data;
			});

			getting.fail(function() {
				alert("get failed");
			});

			getting.always(function() {
				// alert("get finished");
			});
		}
		// alert("Coming here Get");
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
		// alert('Device is ready! Getting GeoLocation.');
		window.setInterval(getloc, 10000);
		FB.init({
			appId : "346598232144666",
			nativeInterface : CDV.FB,
			useCachedDialogs : false
		});
		document.getElementById('data').innerHTML = "";
		getLoginStatus();
	} catch (e) {
		alert(e);
	}
}, false);
