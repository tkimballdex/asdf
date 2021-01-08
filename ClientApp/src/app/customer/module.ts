import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './list.component';
import { CustomerEditComponent } from './edit.component';
import { MsalGuard } from '@azure/msal-angular';

import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';

@NgModule({
    declarations: [
        CustomerListComponent,
        CustomerEditComponent
    ],
    imports: [
        GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule, 
        TabModule, DatePickerModule, SwitchModule, CommonModule,
        RouterModule.forChild([
            { path: 'customer/list', component: CustomerListComponent, canActivate: [MsalGuard] },
            { path: 'customer/add', component: CustomerEditComponent, canActivate: [MsalGuard] },
           { path: 'customer/edit/:id', component: CustomerEditComponent, canActivate: [MsalGuard] },
        ])
    ],
    providers: [
        PageService, SortService, EditService, ToolbarService, CommandColumnService, ExcelExportService
    ]
})
export class CustomerModule { }
