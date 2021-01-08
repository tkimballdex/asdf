import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VendorsListComponent } from './list.component';
import { VendorsEditComponent } from './edit.component';
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
        VendorsListComponent,
        VendorsEditComponent
    ],
    imports: [
        GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule, 
        TabModule, DatePickerModule, SwitchModule, CommonModule,
        RouterModule.forChild([
            { path: 'vendor/list', component: VendorsListComponent, canActivate: [MsalGuard] },
            { path: 'vendor/add', component: VendorsEditComponent, canActivate: [MsalGuard] },
           { path: 'vendor/edit/:id', component: VendorsEditComponent, canActivate: [MsalGuard] },
        ])
    ],
    providers: [
        PageService, SortService, EditService, ToolbarService, CommandColumnService, ExcelExportService
    ]
})
export class VendorsModule { }
