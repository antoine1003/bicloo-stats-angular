import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Marker } from 'leaflet';
import { Station } from '../../models/station.interface';
import { LeafletService } from '../../services/leaflet.service';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
})
export class LeafletComponent implements OnInit {
  constructor(private leafletService: LeafletService) {}

  ngOnInit(): void {
    this.leafletService.initMap();
  }
}
