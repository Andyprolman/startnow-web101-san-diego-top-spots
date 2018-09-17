if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      console.log(pos);
    })
}; 

// populates table
$(document).ready(function() {
    $.getJSON('data.json',function(data){
      $.each(data, function(i, item){
         var location = ('https://www.google.com/maps?q=' + item.location);
        $('table').append("<tr><td>" + item.name + "</td><td>" + item.description + "</td><td>" + location + "</td></tr>");
        
        
        
      })
        
        initMap();
        definePopupClass();
    })

    

    
});

// displays map
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 33.09745, lng: -116.99572},
        zoom: 8
    });
    // adds markers
    $.getJSON('data.json',function(data){
        $.each(data, function(i, data){
            var latitude = data.location[0];
            var longitude = data.location[1];
            var location = {lat: latitude, lng: longitude};
            var contentString = data.name + ': ' + data.description;
            
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById('right-panel'));

            var infowindow = new google.maps.InfoWindow({
                content: contentString,
            
              });
              
            var marker = new google.maps.Marker({
                position: location,
                map: map
        
        
            }) // adds infowindow to marker
            marker.addListener('click', function() {
                infowindow.open(map, marker);
                
            });

            // gets geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                  var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  }
                  var userDestination = {
                    lat: marker.getPosition().lat(),
                    lng: marker.getPosition().lng()
                }
                  //console.log(pos);
                  

                  // adds map/ directions to marker
                  marker.addListener('click', function() {
                    directionsService.route({
                        
                    
                        origin: pos,
                        destination: userDestination, 
                        travelMode: 'DRIVING'
                        

                        // displays directions 
                    }, 
                    
                    function(response, status) {
                        if (status === 'OK') {
                            directionsDisplay.setDirections(response);
                            console.log('hello');
                            distance (pos.lat, pos.lng, userDestination.lat, userDestination.lng, "K");
                        } else {
                            window.alert('Directions request failed due to ' + status);
                        }
                        
                    });

                    function distance(lat1, lon1, lat2, lon2, unit) {
                        // var lat1 = pos.lat;
                        // var lon1 = pos.lng;
                        // var lat2 = userDestination.lat;
                        // var lon2 = userDestination.lng;
                        var radlat1 = Math.PI * lat1/180
                        var radlat2 = Math.PI * lat2/180
                        var theta = lon1-lon2
                        var radtheta = Math.PI * theta/180
                        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                        if (dist > 1) {
                            dist = 1;
                        }
                        dist = Math.acos(dist)
                        dist = dist * 180/Math.PI
                        dist = dist * 60 * 1.1515
                        if (unit=="K") { dist = dist * 1.609344 }
                        if (unit=="N") { dist = dist * 0.8684 }
                        console.log(dist);
                    }
                    
                });



                })
            }; 
            

            
            
            
        
        })

        
    
    });

    
}






    





