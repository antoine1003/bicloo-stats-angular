import { Component, OnInit } from '@angular/core';
import { Chart, ChartItem, registerables } from 'chart.js';
import { LeafletService } from '../../services/leaflet.service';
import { Station } from '../../models/station.interface';
import { ChartService } from '../../services/chart.service';
import { HttpService } from '../../services/http.service';
import { combineLatest, debounce, debounceTime } from 'rxjs';
import { DataResponse } from '../../models/data-response.interface';
import { DataService } from '../../services/data.service';
import { merge } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  chart: Chart;
  constructor(
    private dataService: DataService,
    private chartService: ChartService,
    private httpService: HttpService,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {
    Chart.register(...registerables);
    combineLatest([
      this.dataService.stationClicked$,
      this.dataService.dayClicked$,
    ])
      .pipe(debounceTime(500))
      .subscribe(([station, day]) => {
        if (station) {
          this.httpService
            .getDataForStationIdAndDate(station.station_id, day)
            .subscribe((dataResponse) => {
              this._buildChartsForValues(dataResponse);
            });
        }
      });
  }

  private _buildChartsForValues(dataResponse: DataResponse) {
    if (!dataResponse.data || dataResponse.data.length === 0) {
      this.messageService.warning(
        "Il n'y a pas de données pour cette station et ce jour..."
      );
      return;
    }
    const labels = dataResponse.data.map((el) => `${el.hour}h`);

    if (this.chart) {
      this._updateData(dataResponse);
    } else {
      const legendTotal = 'Nombre total de vélos.';
      const totalBike = dataResponse.data[0].nb_total;
      const colors = dataResponse.data.map(() =>
        ChartComponent._dynamicColors()
      );
      const data = {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            data: dataResponse.data.map((el) => parseInt(el.nb_available)),
            borderWidth: 1,
            backgroundColor: colors,
          },
          {
            type: 'line',
            data: dataResponse.data.map((el) =>
              Math.round(Number(el.nb_total))
            ),
            borderWidth: 1,
            borderColor: 'red',
            pointRadius: 0,
            label: legendTotal,
          },
        ],
      };
      const config = {
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Vélos disponible.',
              },
              max: Math.round(Number(totalBike)) + 5,
            },
          },
          plugins: {
            title: {
              display: true,
            },
            legend: {
              display: true,
              labels: {
                filter: function (item) {
                  if (!item.text) return false;
                  return item.text.includes(legendTotal);
                },
              },
            },
          },
        },
      };
      this.chart = new Chart(
        document.getElementById('myChart') as ChartItem,
        // @ts-ignore
        config
      );
    }
  }

  private _updateData(json): void {
    const colors = json.data.map(() => ChartComponent._dynamicColors());
    const totalBike = json.data[0].nb_total;
    const labels = json.data.map((el) => `${el.hour}h`);
    // Dataset des valeurs
    // Dataset du nb de vélo max
    this.chart.data.datasets[0].data = json.data.map((el) =>
      parseInt(el.nb_available)
    );
    this.chart.data.datasets[0].backgroundColor = colors;
    this.chart.data.datasets[1].data = json.data.map(() =>
      Math.round(totalBike)
    );
    this.chart.data.labels = labels;
    this.chart.options.scales['y'].max = Math.round(totalBike) + 5;
    this.chart.update();
  }

  private static _dynamicColors(): string {
    return (
      'hsl(' +
      360 * Math.random() +
      ',' +
      (25 + 70 * Math.random()) +
      '%,' +
      (85 + 10 * Math.random()) +
      '%)'
    );
  }
}
