import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { economicsdataListComponent } from './list.component'
import { MsalGuard } from '@azure/msal-angular';

import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        economicsdataListComponent,
    ],
    imports: [
        GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule,
		CommonModule, DatePickerModule, SwitchModule, FormsModule, ReactiveFormsModule, GoogleMapsModule,
        RouterModule.forChild([
            { path: 'list', component: economicsdataListComponent, canActivate: [MsalGuard] }
        ])
    ],
    providers: [
        PageService, SortService, EditService, ToolbarService, CommandColumnService
    ]
})
export class economicsdataModule { }
