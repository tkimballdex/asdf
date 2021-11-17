import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { CountystatListComponent } from './list.component'
import { CountystatEditComponent } from './edit.component'
import { MsalGuard } from '@azure/msal-angular';

import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { TabModule } from '@syncfusion/ej2-angular-navigations';

@NgModule({
    declarations: [
        CountystatListComponent,
        CountystatEditComponent
    ],
    imports: [
        GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule,
		CommonModule, DatePickerModule, SwitchModule, FormsModule, ReactiveFormsModule, GoogleMapsModule, NumericTextBoxModule, TabModule,
        RouterModule.forChild([
            { path: 'list', component: CountystatListComponent, canActivate: [MsalGuard] },
            { path: 'add', component: CountystatEditComponent, canActivate: [MsalGuard] },
            { path: 'edit/:id', component: CountystatEditComponent, canActivate: [MsalGuard] },
        ])
    ],
    providers: [
        PageService, SortService, EditService, ToolbarService, CommandColumnService
    ]
})
export class CountystatModule { }
