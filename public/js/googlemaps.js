var GOOGLE_MAPS_URL = "https://maps.google.com/?";

function createGoogleMap(location, title)
{
    // set some default map details, initial center point, zoom and style
    var latLon = new google.maps.LatLng(location.lat, location.lon);

    var mapOptions = {
        center: latLon,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // setup map marker
    var marker = new google.maps.Marker({
        position: latLon,
        title: title
    });
    
    // create the map and reference the div#map-canvas container
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    // show marker
    marker.setMap(map);
}