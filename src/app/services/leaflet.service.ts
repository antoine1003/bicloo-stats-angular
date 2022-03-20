import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Station } from '../models/station.interface';
import stationsJson from '../../assets/resources/stations.json';
import { Marker } from 'leaflet';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class LeafletService {
  map: L.Map;
  stations: Station[] = stationsJson;
  markers: Marker[] = [];

  constructor(private dataService: DataService) {}

  initMap(): void {
    this.map = L.map('leaflet', {
      center: [47.20895278409227, -1.5488897416243665],
      zoom: 15,
    });
    const tileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    this.map.addLayer(tileLayer);
    this._loadStations();
  }

  zoomAndOpenPopUp(stationId): void {
    const marker = this.markers.find(
      // @ts-ignore
      (el) => el.options.stationId === stationId
    );
    if (marker) {
      this.map.setView(marker.getLatLng(), 15);
      marker.openPopup();
    }
  }

  private _loadStations(): void {
    const orangeIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    this.stations.forEach((station) => {
      const marker = L.marker([station.lat, station.lon], {
        icon: orangeIcon,
        // @ts-ignore
        stationId: station.station_id,
      })
        .bindPopup(station.name)
        .on('click', (e) => {
          // @ts-ignore
          this.map.setView(e.latlng, 15);
          this.dataService.setStation(
            this.findStationById(e.target.options.stationId)
          );
        });
      this.markers.push(marker);
      marker.addTo(this.map);
    });
  }

  findStationById(stationId: string): Station | null {
    return this.stations.find((el) => el.station_id == stationId);
  }
}
