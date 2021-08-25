import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { RouterModule } from '@angular/router';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { ButtonModule  } from '@syncfusion/ej2-angular-buttons';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { ChartAllModule } from '@syncfusion/ej2-angular-charts';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule } from '@syncfusion/ej2-angular-navigations';

import { AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService} from '@syncfusion/ej2-angular-charts';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { ColumnSeriesService, AreaSeriesService, } from '@syncfusion/ej2-angular-charts';

import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { PieSeriesService, AccumulationDataLabelService } from '@syncfusion/ej2-angular-charts';


@NgModule({
	declarations: [
		DashboardComponent,
	],
	imports: [
		CommonModule,
		ChartModule,
		GridModule,
		ChartAllModule,
		ListViewModule,
		DropDownListModule,
		DatePickerModule,
		ButtonModule,
		TextBoxModule,
		DashboardLayoutModule,
		TabModule,
		AccumulationChartModule,
		ChartAllModule,
		RouterModule.forChild([
			{ path: '', component: DashboardComponent },
		])
	],
	providers: [ColumnSeriesService, AreaSeriesService, PageService, SortService, FilterService, GroupService,
		PieSeriesService, AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService]
})
export class DashboardModule { }
