import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EmailComponent } from './email/email.component'; 
import { SmsComponent } from './sms/sms.component'; 
import { ChooseTenantComponent } from './home/tenant.component';
import { MasterPageComponent } from './shared/master.component';
import { SplashComponent } from './home/splash.component';

import { MsalModule, MsalGuard, MsalInterceptor } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

import { GridModule } from '@syncfusion/ej2-angular-grids';
import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';
import { DropDownListModule, ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { SidebarModule, MenuAllModule, TreeViewAllModule, MenuModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownButtonModule, SplitButtonModule, ProgressButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faHomeAlt } from '@fortawesome/pro-solid-svg-icons';

import { SampleModule } from './sample/module';
import { SampleTestModule } from './samplestest/module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		ChooseTenantComponent,
		EmailComponent,
		SmsComponent,
		MasterPageComponent,
		SplashComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		TextBoxModule,
		SampleModule,
		SampleTestModule,
		MsalModule.forRoot(new PublicClientApplication({
			auth: {
				clientId: 'f490d12b-d438-4910-b4bb-3feda316339b',
				authority: 'https://interomeb2c.b2clogin.com/interomeb2c.onmicrosoft.com/B2C_1_CustomerPortalLogin',
				redirectUri: window.location.origin + '/auth',
				knownAuthorities: ['interomeb2c.b2clogin.com']
			},
			cache: {
				cacheLocation: 'localStorage',
				storeAuthStateInCookie: isIE,
			}
		}), {
			interactionType: InteractionType.Redirect,
			authRequest: {
				scopes: [environment.scope]
			}
		}, {
			interactionType: InteractionType.Redirect,
			protectedResourceMap: new Map([
				[environment.webApi, [environment.scope]]
			])
		}),
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
					{ path: 'newsArticle', loadChildren: () => import('./newsArticle/module').then(m => m.NewsArticleModule) },
					{ path: 'vendor', loadChildren: () => import('./vendor/module').then(m => m.VendorModule) },
					{ path: 'testtype', loadChildren: () => import('./testtype/module').then(m => m.TestTypeModule) },
					{ path: 'sample', loadChildren: () => import('./sample/module').then(m => m.SampleModule) },
					{ path: 'sampler', loadChildren: () => import('./sampler/module').then(m => m.SamplerModule) },
					{ path: 'sampletest', loadChildren: () => import('./samplestest/module').then(m => m.SampleTestModule) },
					{ path: 'dashboard', loadChildren: () => import('./dashboard/module').then(m => m.DashboardModule) },
					{ path: 'role', loadChildren: () => import('./role/module').then(m => m.RoleModule) },
					{ path: 'user', loadChildren: () => import('./user/module').then(m => m.UserModule) }
				]
			}
		], { relativeLinkResolution: 'legacy' }),
		MsalModule,
		SidebarModule, MenuAllModule, DropDownListModule, TreeViewAllModule, ListViewAllModule, MenuModule, DashboardLayoutModule,
		DropDownButtonModule, GridModule, ComboBoxModule, SwitchModule, DialogModule, FontAwesomeModule, BrowserAnimationsModule, ToastAllModule
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: MsalInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faHome, faHomeAlt);
    }
}
