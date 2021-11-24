import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestTypeListComponent } from './list.component';
import { TestTypeEditComponent } from './edit.component';
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
  declarations: [
    TestTypeListComponent, 
    TestTypeEditComponent],
  imports: [GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule, DropDownListModule,
    CommonModule, DatePickerModule, SwitchModule,
    TextBoxModule,
    CommonModule,
    RouterModule.forChild([
        {path: 'list', component: TestTypeListComponent, canActivate:[MsalGuard]},        
        { path: 'add', component: TestTypeEditComponent, canActivate: [MsalGuard] },
        { path: 'edit/:id', component: TestTypeEditComponent, canActivate: [MsalGuard] }
    ])
  ]
})
export class TestTypeModule { }
