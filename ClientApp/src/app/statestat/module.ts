import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StateStatListComponent } from './list.component'
import { StateStatEditComponent } from './edit.component'
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
        StateStatListComponent,
        StateStatEditComponent
    ],
    imports: [
        GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule,
		CommonModule, DatePickerModule, SwitchModule, FormsModule, ReactiveFormsModule, NumericTextBoxModule, TabModule,
        RouterModule.forChild([
            { path: 'list', component: StateStatListComponent, canActivate: [MsalGuard] },
            { path: 'add', component: StateStatEditComponent, canActivate: [MsalGuard] },
            { path: 'edit/:id', component: StateStatEditComponent, canActivate: [MsalGuard] },
        ])
    ],
    providers: [
        PageService, SortService, EditService, ToolbarService, CommandColumnService
    ]
})
export class StateStatModule { }
