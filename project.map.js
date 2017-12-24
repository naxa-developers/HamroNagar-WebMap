var mapapp = {};

mapapp.createConstants = function(){
  //create constants here
  
}

mapapp.createFunctions = function(){
  //function to initialize map and add basemaps
  mapapp.initializeMap = function(){
    mapapp.map = L.map('map').setView([27.70784710660343, 85.3081512451172], 10);

    L.tileLayer('https://api.mapbox.com/styles/v1/banmedo/cjbkm07iu27kp2sqzrxsyteiv/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmFubWVkbyIsImEiOiJhSklqeEZzIn0.rzfSxO3cVUhghA2sJN378A', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapapp.map);
  }
  
  //function tp update data obtained after filtering
  //only takes geometry of features, title and summary fields of features
  mapapp.updateData = function(geoJSON){

  }

  //function to show details of a particular feature after fetching it from
  //the database.
  mapapp.showDetails = function(details){

  }
}

mapapp.init = function(){
  //create constants and functions
  mapapp.createFunctions();
  
  mapapp.initializeMap();
}

mapapp.init();