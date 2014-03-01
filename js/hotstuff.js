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
	function getLoginStatus() {
		FB.getLoginStatus(function(response) {
			if (response.status == 'connected') {
				alert('logged in');
			} else {
				alert('not logged in');
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
			document.getElementById('data').innerHTML = "";
		} catch (e) {
			alert(e);
		}
	}, false); 