import { Component, ViewEncapsulation } from '@angular/core';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { data } from './datasource';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
    public cellSpacing: number[] = [10, 10];
  
    public allowDragging: boolean = false;
    public chartData: Object[] = [
      { month: 'Jan', sales: 35 }, { month: 'Feb', sales: 28 },
      { month: 'Mar', sales: 34 }, { month: 'Apr', sales: 32 },
      { month: 'May', sales: 40 }, { month: 'Jun', sales: 32 },
      { month: 'Jul', sales: 35 }, { month: 'Aug', sales: 55 },
      { month: 'Sep', sales: 38 }, { month: 'Oct', sales: 30 },
      { month: 'Nov', sales: 25 }, { month: 'Dec', sales: 32 }
    ];
    public primaryXAxis: Object = {
        valueType: 'Category'
    }
    public lineData: any[] = [
     { x: 2013, y: 28 }, { x: 2014, y: 25 },{ x: 2015, y: 26 }, { x: 2016, y: 27 },
    { x: 2017, y: 32 }, { x: 2018, y: 35 }
    ];
    public piechart: any[] = [{ x: 'TypeScript', y: 13, text: 'TS 13%' }, { x: 'React', y: 12.5, text: 'Reat 12.5%' },{ x: 'MVC', y: 12, text: 'MVC 12%' },{ x: 'Core', y: 12.5, text: 'Core 12.5%' },{ x: 'Vue', y: 10, text: 'Vue 10%' },{ x: 'Angular', y: 40, text: 'Angular 40%' }];
    public piechart1: any[] = [
     { 'x': 'Chrome', y: 37, text: '37%' },
     { 'x': 'UC Browser', y: 17, text: '17%' },
     { 'x': 'iPhone', y: 19, text: '19%' },
     { 'x': 'Others', y: 4, text: '4%' },
     { 'x': 'Opera', y: 11, text: '11%' },
     { 'x': 'Android', y: 12, text: '12%' }
     ];
     public legendSettings: Object = {
        visible: false
    };
}
