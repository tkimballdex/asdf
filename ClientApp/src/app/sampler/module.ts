import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SamplerListComponent } from './list.component';
import { SamplerEditComponent } from './edit.component';
import { MsalGuard } from '@azure/msal-angular';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';

@NgModule({
	declarations: [
		SamplerListComponent,
		SamplerEditComponent
	],
	imports: [
		MatFormFieldModule, MatInputModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatButtonToggleModule, MatSelectModule, MatTabsModule, MatDialogModule, FormsModule, ReactiveFormsModule,
		GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToolbarModule, TooltipModule, ToastAllModule, DropDownListModule,
		TabModule, DatePickerModule, SwitchModule, NumericTextBoxModule, MatButtonToggleModule, CommonModule,
		RouterModule.forChild([
			{ path: 'list', component: SamplerListComponent, canActivate: [MsalGuard] },
			{ path: 'add', component: SamplerEditComponent, canActivate: [MsalGuard] },
			{ path: 'edit/:id', component: SamplerEditComponent, canActivate: [MsalGuard] },
		])
	],
	providers: [
		PageService, SortService, EditService, ToolbarService, CommandColumnService, ExcelExportService
	]
})
export class SamplerModule { }
