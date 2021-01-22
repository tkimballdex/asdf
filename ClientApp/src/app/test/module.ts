import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { EditComponent } from './edit.component';
import { RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';

@NgModule({
  declarations: [ListComponent, EditComponent],
  imports: [GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule,
    CommonModule, DatePickerModule, SwitchModule,
    TextBoxModule,
    CommonModule,
    RouterModule.forRoot([
        {path: 'test/list', component: ListComponent, canActivate:[MsalGuard]},
        {path: 'test/edit/:id', component: EditComponent, canActivate:[MsalGuard]},
        {path: 'test/add', component: EditComponent, canActivate:[MsalGuard]}
    ])
  ]
})
export class TestModule { }
