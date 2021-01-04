import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocationListComponent } from './list.component'
import { LocationEditComponent } from './edit.component'
import { MsalGuard } from '@azure/msal-angular';

import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';

@NgModule({
    declarations: [
        LocationListComponent,
        LocationEditComponent
    ],
    imports: [
        GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule,
        CommonModule, DatePickerModule, SwitchModule,
        RouterModule.forChild([
            { path: 'location/list', component: LocationListComponent, canActivate: [MsalGuard] },
            { path: 'location/add', component: LocationEditComponent, canActivate: [MsalGuard] },
           { path: 'location/edit/:id', component: LocationEditComponent, canActivate: [MsalGuard] },
        ])
    ],
    providers: [
        PageService, SortService, EditService, ToolbarService, CommandColumnService
    ]
})
export class LocationModule { }
