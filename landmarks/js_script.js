
		myLat = 0;
			myLng = 0;
			function getMyLocation() {
				//console.log("Hit Me One");
				if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
					//console.log("Hit Me Two");
					navigator.geolocation.getCurrentPosition(function(position) {
							//console.log("Hit Me Three");
							myLat = position.coords.latitude;
							myLng = position.coords.longitude;
							elem = document.getElementById("info");
							elem.innerHTML = "<h1>You are in " + myLat + ", " + myLng + "</h1>";
						});
					//console.log("Hit Me Four");
				}
				else {
					alert("Unfortunately geolocation is not supported by your web browser.");
				}
			}

		function loadMessages() {
		//console.log("hello..");
		//Step 1: Make an instance of XMLhttp request
		request = new XMLHttpRequest();
		
		//Step 2: 
		//Request.open("HTTP VERB", "URL", true/*whether it is asynchronous*/);
		request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);

		//Generating header information for http post header
		request.setRequestHeader("Content-type","x-www-form-urlencoded");
		
		//Step 3: Setup callback on what to do when response is received
		request.onreadystatechange = function() {
				//gets called everytime there is a change in status of request
				//Step 3A: get the response text if and only if the readyState is 4
				if (request.readyState == 4 && request.status == 200) {
				
					//Step 5: Do something with the response data i.e. the JSON
					rawData = request.responseText;
					messages =JSON.parse(rawData);
					/*output ="";
					for (count = 0; count < messages.length; count ++) {
						output = output + "<p>" + messages[count].content + "=>" +messages[count].username +"</li>";
						}
					document.getElementByID("messages").innerHTML = messages;
					console.log(rawData);
					}
				document.getElementById.innerHTML = rawData;
				if (rawData != null){
					messages = JSON.parse(rawData);
					//console.log(messages);
				}*/
			}
		
		//Step 4: Fire off the request
		request.send("login=YOURLOGIN&lat=myLat&lng=myLng");
	}

	//Code to calculate distance to landmarks
	//google.maps.geometry.spherical.computeDistanceBetween(latLngA,latLngB);