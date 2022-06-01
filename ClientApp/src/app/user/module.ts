import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './list.component'
import { UserEditComponent } from './edit.component'
import { MsalGuard } from '@azure/msal-angular';

import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxMaskModule } from 'ngx-mask'

@NgModule({
    declarations: [
        UserListComponent,
        UserEditComponent
    ],
    imports: [
        GridModule, RadioButtonModule, ButtonModule, TextBoxModule, CheckBoxModule, ToastAllModule,
        DropDownListModule, CommonModule,
        NgxMaskModule.forRoot(),
        RouterModule.forChild([
            { path: 'list', component: UserListComponent, canActivate: [MsalGuard] },
            { path: 'add', component: UserEditComponent, canActivate: [MsalGuard] },
           { path: 'edit/:id', component: UserEditComponent, canActivate: [MsalGuard] },
        ])
    ],
    providers: [
        PageService, SortService, EditService, ToolbarService, CommandColumnService
    ]
})
export class UserModule { }
