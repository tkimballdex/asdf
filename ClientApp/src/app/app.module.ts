import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EmailComponent } from './email/email.component'; 
import { LogoutComponent } from './home/logout.component';
import { ChooseTenantComponent } from './home/tenant.component';
import { MsalGuard } from '@azure/msal-angular';
import { MasterPageComponent } from './shared/master.component';
import { SplashComponent } from './home/splash.component';

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

import { SampleModule } from './sample/module';
import { SampleTestModule } from './samplestest/module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from './dashboard/module';


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
        ChooseTenantComponent,
        EmailComponent,
        MasterPageComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        TextBoxModule,
        DashboardModule,
        SampleModule,
        SampleTestModule,
        RouterModule.forRoot([
            { path: '', component: SplashComponent, pathMatch: 'full' },
            {
                path: 'auth',
                component: MasterPageComponent,
                canActivate: [MsalGuard],
                children: [
                    { path: '', component: HomeComponent },
                    { path: 'account/tenant', component: ChooseTenantComponent },
                    { path: 'customer', loadChildren: () => import('./customer/module').then(m => m.CustomerModule) },
                    { path: 'site', loadChildren: () => import('./site/module').then(m => m.SiteModule) },
                    { path: 'location', loadChildren: () => import('./location/module').then(m => m.LocationModule) },
                    { path: 'vendor', loadChildren: () => import('./vendor/module').then(m => m.VendorModule) },
                    { path: 'testtype', loadChildren: () => import('./testtype/module').then(m => m.TestTypeModule) },
                    { path: 'sample', loadChildren: () => import('./sample/module').then(m => m.SampleModule) },
                    { path: 'sampletest', loadChildren: () => import('./samplestest/module').then(m => m.SampleTestModule) },
                    { path: 'dashboard', loadChildren: () => import('./dashboard/module').then(m => m.DashboardModule) },
                    { path: 'role', loadChildren: () => import('./role/module').then(m => m.RoleModule) },
                    { path: 'user', loadChildren: () => import('./user/module').then(m => m.UserModule) }
                ]
            },
            { path: 'account/logout', component: LogoutComponent }
        ], { relativeLinkResolution: 'legacy' }),
        MsalModule,
        SidebarModule, MenuAllModule, DropDownListModule, TreeViewAllModule, ListViewAllModule, MenuModule,
        DropDownButtonModule, GridModule, ComboBoxModule, SwitchModule, DialogModule, FontAwesomeModule, BrowserAnimationsModule, ToastAllModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
