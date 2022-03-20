import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  selectedDay = '0';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  onDayChanged($event: any) {
    this.dataService.setDay($event);
  }
}
