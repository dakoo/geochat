/* Default values */
var current_position = {
    latitude: 51.508742,
    longitude:-0.120850
}
var current_zoom_level = 16;
var current_radius=300;

function initialize() {
    var geocoder = new google.maps.Geocoder();
    var input = (document.getElementById('pac-input'));

    if(!navigator.geolocation){
        drawMap(current_position.latitude, current_position.longitude);
    };
    function success(new_position){
        drawMap(new_position.coords.latitude, new_position.coords.longitude);
    };
    function error(){
        drawMap(current_position.latitude, current_position.longitude);
    };
    navigator.geolocation.getCurrentPosition(success, error);
    function drawMap(latitude, longitude) {
        /*center_position*/
        current_position.latitude = latitude;
        current_position.longitude = longitude;
        var center = new google.maps.LatLng(latitude, longitude);

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
            draggable: true,
            animation: google.maps.Animation.DROP
        });
        user_marker.setMap(map);

        /*circle*/
        var circle = new google.maps.Circle({
            center: center,
            radius: current_radius,
            strokeColor: "#FF565A",
            strokeOpacity: 0.3,
            strokeWeight: 1,
            fillColor: "#FFB89B",
            fillOpacity: 0.2
        });
        circle.setMap(map);

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

        /*marker event listener */
        google.maps.event.addListener(user_marker, 'dragend', function () {
            current_zoom_level = map.getZoom();
            drawMap(user_marker.getPosition().lat(), user_marker.getPosition().lng());
        });

        /* place search */
        var autocomplete = new google.maps.places.Autocomplete(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        autocomplete.bindTo('bounds', map);
        autocomplete.setTypes([]);

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("We cann't find the place");
                return;
            }
            if (place.geometry.location){
                drawMap(place.geometry.location.lat(), place.geometry.location.lng());
            } else if(place.geometry.viewport){
                drawMap(place.geometry.viewport.getBounds().getCenter().lat(), place.geometry.viewport.getBounds().getCenter().lng());
            } else {
                window.alert("We cann't find the place");
                return;
            }
        });
    }; //end of drawmap
}; //end of initialize

google.maps.event.addDomListener(window, 'load', initialize);
