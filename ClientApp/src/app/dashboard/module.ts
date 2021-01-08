import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component'
import { RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { GridModule } from '@syncfusion/ej2-angular-grids';

import { AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService} from '@syncfusion/ej2-angular-charts';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { ColumnSeriesService, AreaSeriesService, } from '@syncfusion/ej2-angular-charts';

import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { PieSeriesService, AccumulationDataLabelService } from '@syncfusion/ej2-angular-charts';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    GridModule,
    AccumulationChartModule,
    RouterModule.forChild([
      { path: 'dashboard', component: DashboardComponent, canActivate: [MsalGuard] },
  ])
  ],
  providers: [ ColumnSeriesService, AreaSeriesService, PageService, SortService, FilterService, GroupService,
    PieSeriesService, AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService]
})
export class DashboardModule { }
