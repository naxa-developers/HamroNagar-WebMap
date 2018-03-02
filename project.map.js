var mapapp = {};

mapapp.createConstants = function(){
  //create constants here
  mapapp.API = {
    DETAILS : '/details.php',
  };  
}
//setup variables and getters and setters for the map
mapapp.setupVariables = function(){
  mapapp._apiBaseURL = "";
  mapapp.isShapefileLoaded = false;
  mapapp.setApiURL = function (URL){
    mapapp._apiBaseURL = URL;
  }
  mapapp.getApiURL = function (){
    return mapapp._apiBaseURL;
  }
}

mapapp.createFunctions = function(){
  //function to initialize map and add basemaps
  mapapp.initializeMap = function(divID){
    mapapp.map = L.map(divID).setView([27.70784710660343, 85.3081512451172], 10);

    L.tileLayer('https://api.mapbox.com/styles/v1/banmedo/cjbkm07iu27kp2sqzrxsyteiv/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmFubWVkbyIsImEiOiJhSklqeEZzIn0.rzfSxO3cVUhghA2sJN378A', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapapp.map);
    
    //create a details modal
    var modaltxt = '<div class="modal" id="detail-modal" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content">';
    modaltxt += '<div class="modal-header">';
    modaltxt += '<h5 class="modal-title" id="detail-modal-title"></h5>';
    modaltxt += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modaltxt += '</div>';
    modaltxt += '<div class="modal-body" id="detail-modal-body"></div>';
    modaltxt += '</div></div></div>';
    
    $('body').append(modaltxt);
    
  }
  
  //function to update data obtained after filtering
  //only takes geometry of features, id, title and summary fields of a feature
  mapapp.updateData = function(geoJSON){
    var newLayer = new L.GeoJSON(geoJSON, {
      //style: style,
      onEachFeature : function (feature, layer){
        var popupTxt = '<b>'+ feature.properties.title +'</b><br>'+ feature.properties.summary +
            '<a onClick="mapapp._getDetails('+feature.properties.id+')"> See details... </a>'
        layer.bindPopup(popupTxt);
      }
    });
    newLayer.addTo(mapapp.map);
  }

  //function to show details of a particular feature after fetching it from
  //the database. The details should be in json format in key value pairs
  mapapp.showDetails = function(details){
    $('#detail-modal-title').html(details.title);
    var text = details.summary+'<br>';
    delete details.title;
    delete details.summary;
    text += '<table>';
    for(var key in details){
      text += '<tr><td>'+key+'</td><td>'+details[key]+'</td></tr>';
    }
    text += '</table>';
    $('#detail-modal-body').html(text);
    $('#detail-modal').modal('show');
  }
  
  //function to load the supplied shapefile into the map. The shapefile and its
  //necessary supplementary files need to be bundled in a zip file
  mapapp.loadShapefile = function(zipfile, callback){
    mapapp.isShapefileLoaded = false;
    mapapp.shpfile = new L.Shapefile(zipfile);
    mapapp.shpfile.once('data:loaded', function(){
      mapapp.isShapefileLoaded = true;
      if (callback) callback();  
    });
    mapapp.shpfile.addTo(mapapp.map);
    
  }
  //function to remove current shapefile
  mapapp.removeShapefile = function(){
    mapapp.isShapefileloaded = false;
    mapapp.map.removeLayer(mapapp.shpfile);
    mapapp.shpfile = '';
  }
  //get geojson of shapefile
  mapapp.getGeoJSONofShape = function(){
    if (mapapp.isShapefileLoaded) return mapapp.shpfile.toGeoJSON();
    else return false;
  }
  
  //helper functions
  //setup loading state
  mapapp._loading = function(state){
    mapapp._prompt(state, 'Loading...');
  }
  //setup prompt display or message to user
  mapapp._prompt = function(state, text){
    
  }
  //function to get getails of a particular feature
  mapapp._getDetails = function(featureId){
    $.ajax({
      url: mapapp.getApiURL()+mapapp.API.DETAILS,
      data: {id: featureId},
      method: 'post',
      dataType : 'json',
      success: function(response){
        mapapp.showDetails(response);
      }
    });
  }
  
}

mapapp.init = function(divID){
  //create constants and functions
  mapapp.createConstants();
  mapapp.setupVariables();
  mapapp.createFunctions();
  
  mapapp.initializeMap(divID);
}

mapapp.init('map');