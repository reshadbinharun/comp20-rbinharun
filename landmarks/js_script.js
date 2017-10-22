var myLogin = "k7okUNPy";
var myLat;
var myLng;
var me = new google.maps.LatLng(myLat,myLng);
var request = new XMLHttpRequest();
var messages;
var myOptions = {
    zoom: 13,
    center: me,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
var map;
var marker;
var infoWindow = new google.maps.InfoWindow();
var landmark_icon = {
    url: 'landmark.png',
    scaledSize: new google.maps.Size(20,20)
};
var peep_icon = {
    url: 'bender.png',
    scaledSize: new google.maps.Size(20,20)
};
var peepInfo = [];
var peepInfoWindow = [];
var peep_markers = [];
var peepDist;

function getMyLocation() {
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            renderMap();
            sendReq();
        })
    } else {
        alert("Unfortunately geolocation is not supported by your web browser.");
    }
};
 
function sendReq() {
    request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            rawData = request.responseText;
            messages = JSON.parse(rawData);
            dispPeeps();
            dispLand();
        }
    }
    request.send("login="+ myLogin +"&lat=" + myLat + "&" + "lng=" + myLng);
    console.log("request sent");
            
};


function renderMap()
{
    me = new google.maps.LatLng(myLat,myLng);
    map.panTo(me);
    marker = new google.maps.Marker({
        position: me,
        title: myLogin
    });
    marker.setMap(map);
    // Open info window on click of marker
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(marker.title);
        infowindow.open(map, marker);
    });
};


function dispPeeps() {
    for (var i = 0; i < messages.people.length; i++){
        var peepLat = messages.people[i]["lat"];
        var peepLng = messages.people[i]["lng"];
        var peepLogin = messages.people[i]["login"];
        peepPos = new google.maps.LatLng(peepLat, peepLng);
        peepDist = google.maps.geometry.spherical.computeDistanceBetween(me, peepPos);   
        peepMarkers[i] = new google.maps.Marker({
            position: peepPos,
            title: peepLogin,
            icon: peep_icon
        });
        peepInfo[i] = "User "+peepLogin+"is"+peepDist+"away from you.";
        peepInfoWindow[i] = new google.maps.InfoWindow();
        google.maps.event.addListener(peepMarkers[i], 'click', function(){
            peepInfoWindow[i].setContent(peepInfo[i]);
            peepInfoWindow[i].open(map,peepMarkers[i]);
        });
        peepMarkers[i].setMap(map);
    }
};

//function to display landmarks on map
function dispLand() {
    minDist = 10000;
    minLocName = " ";
    var landLat;
    var landLng;
    minLat;
    minLng;

    for (var i = 0; i < messages.landmarks.length; i++){
        landLat = messages.landmarks[i].geometry.coordinates[0];
        landLng = messages.landmarks[i].geometry.coordinates[1];
        landName = messages.landmarks[i].properties.Location_Name;
        landPos = new google.maps.LatLng(landLat, landLng);
        if(google.maps.geometry.spherical.computeDistanceBetween(me, landPos) < minDist) {
            minDist = google.maps.geometry.spherical.computeDistanceBetween(me, landPos);
            minLocName = landName;
            minLat = landlat;
            minLng = landLng;
        }
        landMarkers[i] = new google.maps.Marker({
            position: landPos,
            title: landname,
            icon: landmark_icon
        });
        landInfo[i] = landName;
        landInfoWindow[i] = new google.maps.InfoWindow();
        google.maps.event.addListener(landMarkers[i], 'click', function(){
            landInfoWindow[i].setContent(landInfo[i]);
            landInfoWindow[i].open(map,landMarkers[i]);
        });
        landmarkers[i].setMap(map);
         var closest = [
            {lat: myLat, lng: myLng},
            {lat: minLat, lng: minLng}
        ];
        var polyL = new google.maps.Polyline({
            path: closest,
            geodesic: true,
            strokeColor: '#008000',
            strokeOpacity: 3.0,
            strokeWeight: 5
        });
        polyL.setMap(map);

    }
};

