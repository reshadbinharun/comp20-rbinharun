var myLogin = "k7okUNPy";
var myLat = 0;
var myLng = 0;
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
var infowindow = new google.maps.InfoWindow();
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
var peepMarkers = [];
var peepDist;
var landInfo = [];
var landInfoWindow = [];
var landMarkers = [];
var landDist;
var landDetails;
var minDist = 10000;
var minLocName;


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
            
};


function renderMap()
{
    me = new google.maps.LatLng(myLat,myLng);
    map.panTo(me);
    marker = new google.maps.Marker({
        position: me,
        title: myLogin
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
        peepInfo[i] = "User "+peepLogin+" is "+ (peepDist*0.000621371).toFixed(2) +" mi away from you.";
        peepInfoWindow[i] = new google.maps.InfoWindow();
    }
    for (var i = 0; i < peepMarkers.length; i++){
        google.maps.event.addListener(peepMarkers[i], 'click', (function(i){
            return function(){
                peepInfoWindow[i].setContent(peepInfo[i]);
                peepInfoWindow[i].open(map,peepMarkers[i]);
            }
        })(i));
        peepMarkers[i].setMap(map);
    }
};

function dispLand() {
    var landLat;
    var landLng;
    var minLat;
    var minLng;

    for (var i = 0; i < messages.landmarks.length; i++){
        var landLat = messages.landmarks[i].geometry.coordinates[1];
        var landLng = messages.landmarks[i].geometry.coordinates[0];
        var landName = messages.landmarks[i].properties.Location_Name;
        var landDetails = messages.landmarks[i].properties.Details;
        landPos = new google.maps.LatLng(landLat, landLng);
        if(google.maps.geometry.spherical.computeDistanceBetween(me, landPos) < minDist) {
            minDist = google.maps.geometry.spherical.computeDistanceBetween(me, landPos);
            minLocName = landName;
            minLat = landLat;
            minLng = landLng;
        }
        landMarkers[i] = new google.maps.Marker({
            position: landPos,
            title: landName,
            icon: landmark_icon
        });
        landInfo[i] = landName + ": " + landDetails+ " ";
        landInfoWindow[i] = new google.maps.InfoWindow();
        landMarkers[i].setMap(map);
        var closest = [
            {lat: myLat, lng: myLng},
            {lat: minLat, lng: minLng}
        ];
        var polyL = new google.maps.Polyline({
            path: closest,
            geodesic: true,
            strokeColor: '#008000',
            strokeOpacity: 3.0,
            strokeWeight: 2
        });
        polyL.setMap(map);

    }
    for (var i = 0; i < landMarkers.length; i++){
        google.maps.event.addListener(landMarkers[i], 'click', (function(i){
            return function(){
                landInfoWindow[i].setContent(landInfo[i]);
                landInfoWindow[i].open(map,landMarkers[i]);
            }
        })(i));
        landMarkers[i].setMap(map);
    }
    myMark();
};

function myMark() {
    marker.setMap(map);
    var info_window_content = marker.title + " Your closest landmark is:" + minLocName + ". It is " + (minDist*0.000621371).toFixed(2) + "mi away."; 
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(info_window_content);
        infowindow.open(map, marker);
    });
};
