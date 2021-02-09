import { NgModule, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerHomeComponent } from './home.component';
import { CustomerListComponent } from './list.component';
import { CustomerEditComponent } from './edit.component';
import { MsalGuard } from '@azure/msal-angular';
import { MapComponent } from './map/map.component'
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
        CustomerHomeComponent,
        CustomerListComponent,
        CustomerEditComponent,
        MapComponent
    ],
    imports: [
        GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule,
        TabModule, DatePickerModule, SwitchModule, CommonModule,
        RouterModule.forChild([
            {
                path: 'customer',
                component: CustomerHomeComponent,
                canActivate: [MsalGuard],
                children: [
                    { path: 'list', component: CustomerListComponent },
                    { path: 'add', component: CustomerEditComponent },
                    { path: 'edit/:id', component: CustomerEditComponent }
                ]
            }
        ])
    ],
    providers: [
        PageService, SortService, EditService, ToolbarService, CommandColumnService, ExcelExportService
    ]
})
export class CustomerModule { }
