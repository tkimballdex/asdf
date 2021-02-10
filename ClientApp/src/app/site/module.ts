import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteListComponent } from './list.component';
import { SiteEditComponent } from './edit.component';
import { MsalGuard } from '@azure/msal-angular';

import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';

@NgModule({
    declarations: [
        SiteListComponent,
        SiteEditComponent
    ],
    imports: [
        GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule,
        DropDownListModule, DatePickerModule, TabModule, SwitchModule, CommonModule,
        RouterModule.forChild([
            { path: 'list', component: SiteListComponent },
            { path: 'add/:customerId', component: SiteEditComponent },
           { path: 'edit/:id', component: SiteEditComponent },
        ])
    ],
    providers: [
        PageService, SortService, EditService, ToolbarService, CommandColumnService
    ]
})
export class SiteModule { }
