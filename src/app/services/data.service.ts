import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Station } from '../models/station.interface';
import { StationDay } from '../models/station-day.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private stationClicked = new Subject<Station>();
  private dayClicked = new BehaviorSubject<string>('0');

  stationClicked$ = this.stationClicked.asObservable();
  dayClicked$ = this.dayClicked.asObservable();
  constructor() {}

  setStation(station: Station): void {
    this.stationClicked.next(station);
  }

  setDay(day: string): void {
    this.dayClicked.next(day);
  }
}
