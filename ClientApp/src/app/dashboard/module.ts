import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { DashboardComponent } from './dashboard.component';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { RouterModule } from '@angular/router';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { ButtonModule  } from '@syncfusion/ej2-angular-buttons';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { ChartAllModule } from '@syncfusion/ej2-angular-charts';
import { DropDownListModule, ListBoxAllModule, CheckBoxSelectionService, ComboBoxModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';

import { AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService} from '@syncfusion/ej2-angular-charts';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { ColumnSeriesService, AreaSeriesService, } from '@syncfusion/ej2-angular-charts';

import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { PieSeriesService, AccumulationDataLabelService, TooltipService, ExportService } from '@syncfusion/ej2-angular-charts';
import { SliderModule } from '@syncfusion/ej2-angular-inputs';


@NgModule({
	declarations: [
		DashboardComponent,
	],
	imports: [
		CommonModule,
		GoogleMapsModule,
		ChartModule,
		GridModule,
		ChartAllModule,
		ListViewModule,
		DropDownListModule,
		ComboBoxModule, 
		MultiSelectModule,
		ListBoxAllModule,
		DatePickerModule,
		DateRangePickerModule,
		ButtonModule,
		TextBoxModule,
		DashboardLayoutModule,
		TabModule,
		ToastAllModule,
		AccumulationChartModule,
		ChartAllModule,
		SliderModule,
		RouterModule.forChild([
			{ path: '', component: DashboardComponent },
		])
	],
	providers: [ColumnSeriesService, AreaSeriesService, PageService, SortService, FilterService, GroupService, CheckBoxSelectionService, ExportService,
		PieSeriesService, AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService, TooltipService ]
})
export class DashboardModule { }
