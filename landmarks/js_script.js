

function getMyLocation() {
    console.log("in getMyLocation");
// declare myLat and myLng as global variable
// render map first, calln send request later
    init(); //does nothing
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var myLat = position.coords.latitude;
            var myLng = position.coords.longitude;
            var elem = document.getElementById("info");
            //consider making me global
            var me = new google.maps.LatLng(myLat, myLng);
            elem.innerHTML = "<h1>You are in " + myLat + ", " + myLng + "</h1>";
            console.log("You are in " + myLat + "," + myLng);
            getData();
            renderMap();
            dispPeeps();
            dispLand();
            //calcDist();
            polyL();
        });

    } else {
        alert("Unfortunately geolocation is not supported by your web browser.");
    }
}

function getData() {
    var login = "k7okUNPy";
    console.log("in getData");
    request = new XMLHttpRequest();
    request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
    console.log("request posted");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            rawData = request.responseText;
            messages = JSON.parse(rawData);
            console.log("message parsed");
            console.log(messages);
        }
    }
    request.send("login="+ login +"&lat=" + myLat + "&" + "lng=" + myLng);
    console.log("request sent");
}

    function init()
    {
    var myLat = 0;
    var myLng = 0;
    //var messages;
    //map = new google.maps.Map(document.getElementById('map'));
    //marker;
    //infowindow = new google.maps.InfoWindow();
    console.log("init complete");
    }

//consider creating another function
function renderMap()
{
    console.log("in render map");
    
    var myOptions = {
        zoom: 13, // The larger the zoom number, the bigger the zoom
        center: me,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //var me
    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    //var map;
    //var elem = document.getElementById("map");

    console.log("map created");
    
    // Update map and go there...
    map.panTo(me);
    
    // Create a marker; consider removing
    var marker = new google.maps.Marker({
        position: me,
        title: "Here I Am!"
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
        renderMap();

    }

};
//function to display landmarks on map
function dispLand() {
    console.log("in dispLand");
    //var loc_pos = new Array();
    //var loc_pos.lat = new Array ();
    //var loc_pos.lng = new Array ();
    //dist = new Array ();
    //var meLat;
    //var meLng;
    //if (navigator.geolocation) {
      //  navigator.geolocation.getCurrentPosition(function(position) {
        //    meLat = position.coords.latitude;
          //  meLng = position.coords.longitude;
       // });
    //}
    var minDist = 100;
    var minLoc;
    for (var i = 0; i < messages.landmarks.length; i++){
        var peepLat = messages.landmarks[i].geometry.coordinates[1];
        var peepLng = messages.landmarks[i].geometry.coordinates[2];
        var peepLogin = messages.landmarks[i].properties.Location_Name;
        var peep = new google.maps.LatLng(peepLat, peepLng);
        if(calcDist() < minDist) {
            minDist = calcDist();
            minLoc = peepLogin;
        }

        renderMap();
       

    }


};
//function to calculate distance to closest landmark on map

function calcDist() {
    console.log("in calcDist");
    //var latLngMe;
    //var latLngB;
    return google.maps.geometry.spherical.computeDistanceBetween(me, peep);
    //Math.min

};

//function to add polyline between you and map
function polyL() {
    console.log("in polyL");
    //check google maps api for polyline
};
//google.maps.geometry.spherical.computeDistanceBetween(latLngA,latLngB);
