import { Component, OnInit, OnChanges } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})
export class MapComponentComponent implements OnInit, OnChanges {

  map:any;
  imgCatastroMap:any;
  ultimaCapaSeleccionadaCatastro:string;
  //bounds:any;

  constructor() {
    this.map = null;
   }

   ngOnInit() {
      console.log("Componente mapa iniciado");    

      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: 40.466107, lng: -3.689330}
      });
      
      // Estilos para el mapa
      //var styles = [{"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]}, {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];
      //this.map.set('styles', styles);
  }
  

  ngOnChanges(){}

  muestraCapa():void{
    console.log("Muestro layer");
    this.imgCatastroMap.setMap(this.map);
  }

  ocultaCapa():void{
    console.log("Oculto layer");
    this.imgCatastroMap.setMap(null);
  }

  cargaOverlay(nombreCapaMostrar):void{
    this.ultimaCapaSeleccionadaCatastro = nombreCapaMostrar;
    console.log("Detalle a mostrar catastro: " + this.ultimaCapaSeleccionadaCatastro);

    // Obtengo las coordenadas del mapa 
    var LatLngBounds = this.map.getBounds();

    // Obtengo NorEste y SurEste para el servicio WMS de Catastro
    var ne = LatLngBounds.getNorthEast();
    var sw = LatLngBounds.getSouthWest();

    //Obtengo las medidas actuales del mapa para obtener una imagen del mismo tamaño
    var widthMap = document.getElementById('map').offsetWidth;
    var heightMap = document.getElementById('map').offsetHeight;
    console.log("widthMap: "  + widthMap);

    // Creo un objeto de tipo imagen para alamcenar la imagen obtenida de Catastro
    var imgMap = new Image(); 
    
    // Url de la imagen
    var imgMapURL = "http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?SERVICE=WMS&SRS=EPSG:4326&REQUEST=GETMAP&bbox="+
            sw.lng()+","+
            sw.lat()+","+
            ne.lng()+","+
            ne.lat()+
            "&width="+
            widthMap+"&height="+heightMap+"&format=PNG&transparent=Yes&layers="+
            this.ultimaCapaSeleccionadaCatastro;
        
    // Cargo la imagen
    imgMap.src = imgMapURL;

    // Muestro el loading mientras optenemos la imagen del servidor de Catastro
    document.getElementById('loadingMap').style.display = 'block';

    // Listener de la carga de la imagen
    imgMap.onload = function(){
        // Oculto el loading
        document.getElementById('loadingMap').style.display = 'none';
        
        // Creo el Overlay
        this.imgCatastroMap = new google.maps.GroundOverlay(imgMapURL, this.map.getBounds());

        // Llamo a la función que lo asigna al mapa
        this.muestraCapa();
    }.bind(this);  

    
    ///////////////////  CREO LOS ENVENTOS DEL MAPA /////////////////////
    google.maps.event.addListener(this.map, 'zoom_changed', function(){
      this.ocultaCapa();
      this.cargaOverlay(this.ultimaCapaSeleccionadaCatastro);
      console.log("Zoom cambiado");
    }.bind(this));
    
    google.maps.event.addListener(this.map, 'bounds_changed', function() {
        this.ocultaCapa();
        this.cargaOverlay(this.ultimaCapaSeleccionadaCatastro);
        console.log("Cambio en las coordenadas");
    }.bind(this));
  }

}






