import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { data } from './datasource';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  public data1: Object = [
    { text: 'Emily', id: '01' },
    { text: 'Emma', id: '02' },
    { text: 'Sophia', id: '03' },
    { text: 'Sofia', id: '04' },
    { text: 'Victoria', id: '05' },
    { text: 'Zoe', id: '06' },
    { text: 'Laura Callahan', id: '06' },
    { text: 'Sophia', id: '06' },
    { text: 'Abigail', id: '06' },
    { text: 'Natalie', id: '06' },
    { text: 'Lily', id: '06' }];

    
    public fields: Object = { text: 'text', id:'id' };

  public data: object[];
  public pageSettings: PageSettingsModel;
  public primaryXAxis: Object;
  public chartData: Object[];
  public title: string;
  public primaryYAxis: Object;

  constructor() { }

  ngOnInit(): void {
    this.chartData = [
      { x: 1, y: 7 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 14 }, { x: 5, y: 1 }, { x: 6, y: 10 },
      { x: 7, y: 8 }, { x: 8, y: 6 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 16 }, { x: 12, y: 6 },
      { x: 13, y: 14 }, { x: 14, y: 7 }, { x: 15, y: 5 }, { x: 16, y: 2 }, { x: 17, y: 14 }, { x: 18, y: 7 },
      { x: 19, y: 7 }, { x: 20, y: 10 }];
          this.title = 'England - Run Rate';
          this.data = data;
          this.pageSettings = { pageSize: 6 };
}

}
