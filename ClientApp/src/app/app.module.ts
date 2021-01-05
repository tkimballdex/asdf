import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './home/logout.component';
import { ChooseTenantComponent } from './home/tenant.component';
import { MsalGuard } from '@azure/msal-angular';

import { Configuration } from 'msal';
import {
  MsalModule,
  MsalInterceptor,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalService,
  MsalAngularConfiguration
} from '@azure/msal-angular';

import { msalConfig, msalAngularConfig } from './app-config';

import { GridModule } from '@syncfusion/ej2-angular-grids';
import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';
import { DropDownListModule, ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { SidebarModule, MenuAllModule, TreeViewAllModule, MenuModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownButtonModule, SplitButtonModule, ProgressButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faHomeAlt } from '@fortawesome/pro-solid-svg-icons';

import { RoleModule } from './role/module'
import { UserModule } from './user/module'
import { CustomerModule } from './customer/module'
import { SiteModule } from './site/module'
import { LocationModule } from './location/module'

export function MSALConfigFactory(): Configuration {
  return msalConfig;
}

export function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return msalAngularConfig;
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LogoutComponent,
        ChooseTenantComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        RoleModule,
        UserModule,
        CustomerModule,
        SiteModule,
        LocationModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [MsalGuard] },
            { path: 'account/tenant', component: ChooseTenantComponent, canActivate: [MsalGuard] },
            { path: 'account/logout', component: LogoutComponent }
      ]),
        MsalModule,
        SidebarModule, MenuAllModule, DropDownListModule, TreeViewAllModule, ListViewAllModule, MenuModule, 
        DropDownButtonModule, GridModule, ComboBoxModule, SwitchModule, DialogModule, FontAwesomeModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        },
        {
            provide: MSAL_CONFIG,
            useFactory: MSALConfigFactory
        },
        {
            provide: MSAL_CONFIG_ANGULAR,
            useFactory: MSALAngularConfigFactory
        },
        MsalService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faHome, faHomeAlt);
    }
}
