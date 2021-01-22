import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestListComponent } from './testlist.component';
import { TestEditComponent } from './testedit.component';
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
  declarations: [TestListComponent, TestEditComponent],
  imports: [GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule,
    CommonModule, DatePickerModule, SwitchModule,
    TextBoxModule,
    CommonModule,
    RouterModule.forRoot([
        {path: 'test/list', component: TestListComponent, canActivate:[MsalGuard]},
        {path: 'test/edit/:id', component: TestEditComponent, canActivate:[MsalGuard]},
        {path: 'test/add', component: TestEditComponent, canActivate:[MsalGuard]}
    ])
  ]
})
export class TestModule { }
