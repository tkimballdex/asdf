import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

import { icon, Marker } from 'leaflet';
import * as turf from '@turf/turf';
import * as geojson from 'geojson';


@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  //capitals: string = '/assets/data/usa-capitals.geojson';

  constructor(private http: HttpClient) {
  
  }
  makeCapitalMarkers(map: L.Map): void {

    var drawnItems = new L.FeatureGroup();
    


    var circle = L.circle([33.80563, -116.16132], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
  }).addTo(map);



  var polyTest=L.polygon([[33.70563, -117.16132],[33.70563, -111.16132],[34.70563, -113.16132]],{
    color:'transparent',
    fillColor: 'Blue',
    fillOpacity: 0.25,
  
  },
  );

  var polyTest1=L.polygon([[33.70563, -115.66132],[33.70563, -110.16132],[35.70563, -113.16132]],{
color:'transparent',
    fillColor: 'Blue',
    fillOpacity: 0.25,
  }
  );



 polyTest.addTo(drawnItems);
 polyTest1.addTo(drawnItems);

var item1 = turf.union(polyTest.toGeoJSON(),polyTest1.toGeoJSON());

var AnotherItem= L.geoJSON(item1).addTo(map).setStyle({color:'red', fillColor:'Transparent'});

 //drawnItems.setStyle({color:'red'});
 drawnItems.addTo(map);
// polyTest3.addTo(map);
 
 
  }
}