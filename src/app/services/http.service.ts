import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataResponse } from '../models/data-response.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  BASE_URL: string;
  constructor(private http: HttpClient) {
    this.BASE_URL = isDevMode()
      ? 'http://localhost:8000'
      : 'https://api-bicloo-stats.adautry.fr';
  }

  getDataForStationIdAndDate(stationId, date): Observable<DataResponse> {
    return this.http.get<DataResponse>(
      `${this.BASE_URL}/get.php?station_id=${stationId}&dayOfWeek=${date}`
    );
  }
}
