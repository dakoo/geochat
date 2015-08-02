/* Default values */
var current_position = {
    latitude: 51.508742,
    longitude:-0.120850
};
var current_boundary = {
    x1:-0.12445,
    y1: 51.506,
    x2:-0.11725,
    y2: 51.5114
};
var current_zoom_level = 16;

function initialize() {
    var geocoder = new google.maps.Geocoder();
    var input = (document.getElementById('pac-input'));

    if(!navigator.geolocation){
        drawMap();
    };
    function success(new_position){
        current_position.latitude = new_position.coords.latitude;
        current_position.longitude = new_position.coords.longitude;
        updateBoundary(
            new_position.coords.longitude - 0.0036,
            new_position.coords.latitude - 0.003,
            new_position.coords.longitude + 0.0036,
            new_position.coords.latitude + 0.003);
        drawMap();
    };
    function error(){
        drawMap();
    };
    navigator.geolocation.getCurrentPosition(success, error);
    function drawMap() {
        /*center_position*/
        var center = new google.maps.LatLng(current_position.latitude, current_position.longitude);

        /* map */
        var mapOptions = {
            center: center,
            zoom: current_zoom_level,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        var user_marker = new google.maps.Marker({
            position: center,
            map:map,
            draggable: true,
            animation: google.maps.Animation.DROP
        });

        /*rectangle boundary*/
        var rectangle = new google.maps.Rectangle({
            map: map,
            strokeColor: "#FF565A",
            strokeOpacity: 0.3,
            strokeWeight: 1,
            fillColor: "#FFB89B",
            fillOpacity: 0.2,
            editable: true,
            draggable: true,
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(current_boundary.y1, current_boundary.x1),
                new google.maps.LatLng(current_boundary.y2, current_boundary.x2))
        });

        /*infowindow for geocode*/
        geocoder.geocode({'location': center}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    var infowindow = new google.maps.InfoWindow({
                        content: results[1].formatted_address
                    });
                    infowindow.open(map, user_marker);
                    setTimeout(function () { infowindow.close();}, '1000');
                }
            }
        });

        /* place searchbox */
        var autocomplete = new google.maps.places.Autocomplete(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        autocomplete.bindTo('bounds', map);
        autocomplete.setTypes([]);

        /*marker event listener */
        google.maps.event.addListener(user_marker, 'dragend', function () {
            updateUserPosition(user_marker.getPosition().lat(), user_marker.getPosition().lng());
            drawMap();
        });

        /*boundary event listener*/
        google.maps.event.addListener(rectangle, 'bounds_changed', function () {
            updateBoundary(rectangle.getBounds().getSouthWest().lng(),rectangle.getBounds().getSouthWest().lat(),
               rectangle.getBounds().getNorthEast().lng(), rectangle.getBounds().getNorthEast().lat());
        });

        /* searchbox event listener*/
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("We cann't find the place");
                return;
            }
            if (place.geometry.location){
                updateUserPosition(place.geometry.location.lat(), place.geometry.location.lng());
                drawMap();
            } else if(place.geometry.viewport){
                updateUserPosition(place.geometry.viewport.getBounds().getCenter().lat(), place.geometry.viewport.getBounds().getCenter().lng());
                drawMap();
            } else {
                window.alert("We cann't find the place");
                return;
            }
        });
        /* zoom event listener */
        google.maps.event.addListener(map, 'zoom_changed', function() {
            updateZoomLevel(map.getZoom());
        });
    }; //end of drawmap

    function updateUserPosition(latitude, longitude){
        var dx1 = current_position.longitude - current_boundary.x1;
        var dy1 = current_position.latitude - current_boundary.y1;
        var dx2 = current_position.longitude - current_boundary.x2;
        var dy2 = current_position.latitude - current_boundary.y2;
        /* update position */
        current_position.latitude = latitude;
        current_position.longitude = longitude;
        /* update boundary */
        updateBoundary(current_position.longitude - dx1,current_position.latitude - dy1,
            current_position.longitude - dx2, current_position.latitude - dy2);
        //TODO update user information of server
    }
    function updateBoundary(x1, y1,x2, y2){
        current_boundary.x1 = x1;
        current_boundary.y1 = y1;
        current_boundary.x2 = x2;
        current_boundary.y2 = y2;
        //TODO update user information of server
    }
    function updateZoomLevel(zoom_level){
        current_zoom_level = zoom_level;
    }
}; //end of initialize

google.maps.event.addDomListener(window, 'load', initialize);
