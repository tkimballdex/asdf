import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './list.component';
import { CustomerEditComponent } from './edit.component';
import { MapComponent } from './map/map.component'
import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule, MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask'

@NgModule({
    declarations: [
        CustomerListComponent,
        CustomerEditComponent,
		MapComponent
    ],
    imports: [
        GridModule, RadioButtonModule, ButtonModule, TextBoxModule, ToolbarModule, TooltipModule, MaskedTextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule,
		TabModule, DatePickerModule, SwitchModule, CommonModule, FormsModule, ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        RouterModule.forChild([
            { path: 'list', component: CustomerListComponent },
            { path: 'add', component: CustomerEditComponent },
            { path: 'edit/:id', component: CustomerEditComponent }
        ])
    ],
    providers: [
        PageService, SortService, EditService, ToolbarService, CommandColumnService, ExcelExportService
    ]
})
export class CustomerModule { }
