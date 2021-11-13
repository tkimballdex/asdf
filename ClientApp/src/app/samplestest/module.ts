import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SampleTestListComponent } from './list.component';
import { SampleTestEditComponent } from './edit.component';
import { SampleTestImportComponent } from './import.component';
import { MsalGuard } from '@azure/msal-angular';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';

@NgModule({
	declarations: [
		SampleTestListComponent,
		SampleTestEditComponent,
		SampleTestImportComponent
	],
	imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatButtonToggleModule, MatSelectModule, FormsModule, ReactiveFormsModule,
		GridModule, RadioButtonModule, ButtonModule, TextBoxModule, UploaderModule, CheckBoxModule, ToastAllModule, DropDownListModule,
		TabModule, DatePickerModule, SwitchModule, NumericTextBoxModule, MatButtonToggleModule, CommonModule,
		RouterModule.forChild([
			{ path: 'list', component: SampleTestListComponent, canActivate: [MsalGuard] },
			{ path: 'add/:sampleId', component: SampleTestEditComponent, canActivate: [MsalGuard] },
			{ path: 'add', component: SampleTestEditComponent, canActivate: [MsalGuard] },
			{ path: 'edit/:id', component: SampleTestEditComponent, canActivate: [MsalGuard] },
			{ path: 'import', component: SampleTestImportComponent, canActivate: [MsalGuard] },
		])
	],
	providers: [
		PageService, SortService, EditService, ToolbarService, CommandColumnService, ExcelExportService
	]
})
export class SampleTestModule { }
