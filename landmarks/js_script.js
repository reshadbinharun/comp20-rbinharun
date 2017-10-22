

function getMyLocation() {
    console.log("in getMyLocation");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            login = "k7okUNPy";
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            var elem = document.getElementById("info");
            me = new google.maps.LatLng(myLat, myLng);
            elem.innerHTML = "<h1>You are in " + myLat + ", " + myLng + "</h1>";
            console.log("You are in " + myLat + "," + myLng);
            var request = new XMLHttpRequest();
            request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
            console.log("request posted");
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.onreadystatechange = function() {
                if (request.readyState == 4 && request.status == 200) {
                    rawData = request.responseText;
                    messages = JSON.parse(rawData);
                    console.log("message parsed");
                    console.log(messages);
                    renderMap_me();
                    getData();
                    dispPeeps();
                    dispLand();
                    polyL();
                }
            }
    request.send("login="+ login +"&lat=" + myLat + "&" + "lng=" + myLng);
    console.log("request sent");
            
        });

    } else {
        alert("Unfortunately geolocation is not supported by your web browser.");
    }
}

function getData() {
    console.log("in getData");
   
}

function renderMap_me()
{
    console.log("in render map");
    
    var myOptions = {
        zoom: 13, // The larger the zoom number, the bigger the zoom
        center: me,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    //var map;
    //var elem = document.getElementById("map");
    console.log("map created");
    map.panTo(me);
    var marker = new google.maps.Marker({
        position: me,
        title: login
        //icon key value pair, 3 different types of markers
    });
    marker.setMap(map);
        
    // Open info window on click of marker
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(marker.title);
        infowindow.open(map, marker);
    });
    console.log("map render complete");
};

function renderMap(mark)
{
    console.log("in render map");
    
    var myOptions = {
        zoom: 13, // The larger the zoom number, the bigger the zoom
        //center: me,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    //var map;
    //var elem = document.getElementById("map");
    console.log("map created");
  
    // Update map and go there...
    //map.panTo(me);
    
    // Create a marker; consider removing
    var marker = new google.maps.Marker({
        position: mark,
        title: login
        //icon key value pair, 3 different types of markers
    });
    marker.setMap(map);
        
    // Open info window on click of marker
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(marker.title);
        infowindow.open(map, marker);
    });
    console.log("map render complete");
};
//function to display people on map
function dispPeeps() {
    console.log("in dispPeeps");
        for (var i = 0; i < messages.people.length; i++){
            var myLat = messages.people[i].lat;
            var myLng = messages.people[i].lng;
            var login = messages.people[i].login;
            var mark = new google.maps.LatLng(myLat, myLng);
            renderMap(mark);

        }

};
//function to display landmarks on map
function dispLand() {
    console.log("in dispLand");
    minDist = 100;
    minLoc = 0;
    for (var i = 0; i < messages.landmarks.length; i++){
        var myLat = messages.landmarks[i].geometry.coordinates[1];
        var myLng = messages.landmarks[i].geometry.coordinates[2];
        var login = messages.landmarks[i].properties.Location_Name;
        var mark = new google.maps.LatLng(myLat, myLng);
        if(calcDist(me, mark) < minDist) {
            minDist = calcDist(me, mark);
            minLoc = login;
        }

        renderMap(mark);
       

    }


};

function calcDist(me, mark) {
    console.log("in calcDist");
    return google.maps.geometry.spherical.computeDistanceBetween(me, mark);

};

//function to add polyline between you and map
function polyL() {
    console.log("in polyL");
    //check google maps api for polyline
};
//google.maps.geometry.spherical.computeDistanceBetween(latLngA,latLngB);
