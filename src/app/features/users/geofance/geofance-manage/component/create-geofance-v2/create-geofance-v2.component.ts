import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { GoefanceListComponent } from '../goefance-list/goefance-list.component';
import * as L from 'leaflet';
import { GeoSearchControl, GoogleProvider, OpenStreetMapProvider } from 'leaflet-geosearch';

@Component({
  selector: 'app-create-geofance-v2',
  templateUrl: './create-geofance-v2.component.html',
  styleUrls: ['./create-geofance-v2.component.scss']
})
export class CreateGeofanceV2Component {
  @ViewChild('geofanceDetails', { static: true }) geolist!: GoefanceListComponent;

  map: L.Map | any;
  polygon: L.Polygon | null = null;
  drawControl: any;
  drawnFeatures = new L.FeatureGroup();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
    }
  }

  async initializeMap(): Promise<void> {
    try {
      const L = await import('leaflet');
      const LeafletDraw = await import('leaflet-draw');
      const { GeoSearchControl } = await import('leaflet-geosearch');
  
      // Initialize the map
      this.map = L.map('geomap', {
        center: [20.29573, 85.82476],
        zoom: 5,
        zoomControl: true,
      });
  
      const osmLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 21,
        }
      );
  
      const satelliteLayer = L.tileLayer(
        'https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
        {
          attribution: 'Imagery © <a href="http://maps.google.com">Google</a>',
          maxZoom: 21,
        }
      );
  
      const googleLayer = L.tileLayer(
        'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        {
          maxZoom: 21,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: '&copy; Google Maps',
        }
      ).addTo(this.map);
  
      const baseMaps = {
        "Google Map": googleLayer,
        "OpenStreetMap": osmLayer,
        "Satellite": satelliteLayer
      };
  
      L.control.layers(baseMaps).addTo(this.map);
  
      this.map.addLayer(this.drawnFeatures);
  
      this.drawControl = new (L.Control.Draw as any)({
        position: 'topright',
        draw: {
          polyline: false,
          polygon: true,
          rectangle: false,
          circle: true,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: this.drawnFeatures,
          remove: true,
        },
      });
  
      class GoogleProvider {
        async search({ query }: { query: string }): Promise<any[]> {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=AIzaSyDVNTVuyZa1hjyStBTPnsWPExRH1e7I_0Y`
            );
            const data = await response.json();
  
            return data.results.map((result: any) => ({
              label: result.formatted_address,
              x: result.geometry.location.lng,
              y: result.geometry.location.lat,
            }));
          } catch (error) {
            console.error('Geocoding error:', error);
            return [];
          }
        }
      }
  
      const provider = new GoogleProvider();
      this.map.addControl(new (GeoSearchControl as any)({
        provider,
        style: 'bar',
        marker: {
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            shadowSize: [41, 41]
          }),
        }
      }));
  
      this.map.addControl(this.drawControl);
  
      this.map.on('draw:created', (e: any) => {
        this.clearMap();
        const layer = e.layer;
        this.drawnFeatures.clearLayers();
        this.drawnFeatures.addLayer(layer);
        this.updateShapeDetails(layer, e.layerType, 'Add');
      });
  
      this.map.on('draw:edited', (e: any) => {
        e.layers.eachLayer((layer: any) => {
          if (layer instanceof L.Circle) {
            this.updateShapeDetails(layer, 'circle', 'Update');
          } else if (layer instanceof L.Rectangle) {
            this.updateShapeDetails(layer, 'rectangle', 'Update');
          } else if (layer instanceof L.Polygon) {
            this.updateShapeDetails(layer, 'polygon', 'Update');
          }
        });
      });
  
      this.map.on('draw:deleted', (e: any) => {
        e.layers.eachLayer((layer: any) => {
          this.handleRemovedLayer(layer);
        });
      });
    } catch (error) {
      console.error('Failed to initialize the map:', error);
    }
  }
  

  handleRemovedLayer(layer: any): void {
    let removedShapeDetails = null;

    if (layer instanceof L.Circle) {
      const center = layer.getLatLng();
      const radius = layer.getRadius();
      removedShapeDetails = {
        type: 'circle',
        center: center,
        radius: radius,
      };
      this.geolist?.setData("", 0, 1);


    } else if (layer instanceof L.Rectangle || layer instanceof L.Polygon) {
      const latLngs = layer.getLatLngs();
      removedShapeDetails = {
        type: layer instanceof L.Rectangle ? 'rectangle' : 'polygon',
        points: latLngs,
      };
      this.geolist?.setData("", 0, 1);

    }

    console.log('Removed Layer Details:', removedShapeDetails);

  }

  confirm(event: any) {
    this.clearMap();

    if (!event || event == null) {
      if (this.drawControl) {
        this.map.removeControl(this.drawControl);
      }
      this.drawControl = new (L.Control.Draw as any)({
        position: 'topright',
        draw: {
          polyline: false,
          polygon: true,
          rectangle: false,
          circle: true,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: this.drawnFeatures,
          remove: true,
        },
      });

      this.map.addControl(this.drawControl);
      return;
    }

    if (!this.drawnFeatures) {
      this.drawnFeatures = new L.FeatureGroup();
      this.map.addLayer(this.drawnFeatures);
    }

    if (event.GeomType == 1) {
      const latLngs = event.Points.map((coord: any) => [coord.Lat, coord.Lng]);
      this.polygon = L.polygon(latLngs, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
      }).addTo(this.drawnFeatures);
      this.map.fitBounds(this.polygon.getBounds());
      this.updateShapeDetails(this.polygon, 'polygon', 'Update');
    }
    else if (event.GeomType == 2) {
      const center = event.Points[0];
      const radius = event.Radius;
      const circle = L.circle([center.Lat, center.Lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: radius,
      }).addTo(this.drawnFeatures);
      this.map.fitBounds(circle.getBounds());
      this.updateShapeDetails(circle, 'circle', 'Update');
    }
    this.addDrawControl();
  }

  addDrawControl() {
    if (this.drawControl) {
      this.map.removeControl(this.drawControl);
    }

    this.drawControl = new (L.Control.Draw as any)({
      position: 'topright',
      draw: false,
      edit: {
        featureGroup: this.drawnFeatures,
        remove: false,
      },
    });

    this.map.addControl(this.drawControl);
    this.map.on('draw:edited', (e: any) => {
      e.layers.eachLayer((layer: any) => {
        if (layer instanceof L.Circle) {
          this.updateShapeDetails(layer, 'circle', 'Update');
        } else if (layer instanceof L.Rectangle) {
          this.updateShapeDetails(layer, 'rectangle', 'Update');
        } else if (layer instanceof L.Polygon) {
          this.updateShapeDetails(layer, 'polygon', 'Update');
        }
      });
    });
  }


  clearMap() {
    this.drawnFeatures.clearLayers();
    if (this.polygon) {
      this.map.removeLayer(this.polygon);
      this.polygon = null;
    }
  }

  updateShapeDetails(layer: any, type: string, action: string) {
    if (type === 'circle') {
      const radius = layer.getRadius();
      const center = layer.getLatLng();
      this.geolist?.setData(center, radius, 2);
    } else if (type === 'rectangle') {
      const bounds = layer.getBounds();
      const sw = bounds.getSouthWest();
      const se = bounds.getSouthEast();
      const nw = bounds.getNorthWest();
      const ne = bounds.getNorthEast();
      const polygonCoordinates: any = [sw, se, ne, nw, sw];
      this.geolist?.setData(polygonCoordinates, 0, 1);
    } else if (type === 'polygon') {
      const latlngs = layer.getLatLngs()[0];
      const coordinates = latlngs;
      coordinates.push(latlngs[0])
      this.geolist?.setData(coordinates, 0, 1);
    }
  }

}
