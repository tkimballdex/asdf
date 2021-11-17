import { Component, ViewEncapsulation, Inject, ViewChild, OnInit } from '@angular/core';
import { SidebarComponent, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { MsalService } from '@azure/msal-angular';
import { Router } from "@angular/router";
import { AppService, EventQueueService, AppEvent, AppEventType } from './../shared/app.service';
import { EmailComponent } from './../email/email.component';
import { SmsComponent } from './../sms/sms.component';
import { TenantService } from './tenant.service';

@Component({
    selector: 'master-page',
    templateUrl: './master.component.html'
})
export class MasterPageComponent implements OnInit {  
    @ViewChild('sidebarMenuInstance') public sidebarMenuInstance: SidebarComponent;
	@ViewChild('contactSidebar') public contactSidebar: SidebarComponent;
    @ViewChild('emailComponent') public emailComponent: EmailComponent;
	@ViewChild('smsComponent') public smsComponent: SmsComponent;

    public sidebarwidth: string = '180px';
    public mediaQuery: string = ('(min-width: 3200px)');
    public target: string = '.main-content';
    public dockSize: string = '70px';
    public enableDock: boolean = true;
    public isOpen: boolean = false;
    public username: string;
    public sidebardisplaysize = '180px';
	public AccountMenuItem: ItemModel[];
	public contactSidebarName: string;
    //-------------------------------------------------------------------------------------
    constructor(private authService: MsalService, private router: Router, public appService: AppService, public tenant: TenantService, private eventQueue: EventQueueService) {
		console.dir(this.authService.instance.getActiveAccount());

        this.AccountMenuItem = [
            {
                id: 'account',
                text: 'My Account'
            },
            {
                id: 'tenant',
                text: 'Switch Tenant'
            },
            {
                separator: true
            }
        ];

		if (this.authService.instance.getActiveAccount() != null) {
            this.AccountMenuItem.push({ id: 'logout', text: 'Sign out' });
        }
        else {
            this.AccountMenuItem.push({ id: 'login', text: 'Log In' });
        };
    }
    //-------------------------------------------------------------------------------------
	async ngOnInit() {
		this.username = this.appService.userName;
		this.eventQueue.on(AppEventType.SendEmail).subscribe((event) => this.openEmailSidebar(event));
		this.eventQueue.on(AppEventType.SendSms).subscribe((event) => this.openSmsSidebar(event));
		await this.setupMenu();
	}

	private async setupMenu() {
		var privileges = await this.appService.getPrivileges();

		if (privileges == null) {
			console.dir('ERROR: Unable to read privileges');
			return;
		}

		this.menuItems = [
			{
				text: 'Home',
				iconCss: 'fal fa-home-alt',
				id: '/auth'
			},
			{
				text: 'Dashboard',
				iconCss: 'fal fa-tachometer-alt',
				id: '/auth/dashboard'
			}
		];

		var sampleMenu: MenuItemModel[] = [];		

		if (privileges.samples.read) {
			sampleMenu.push({ id: '/auth/sample/list', text: 'Samples' });			
			sampleMenu.push({ id: '/auth/sampletest/list', text: 'Tests' });
			sampleMenu.push({ id: '/auth/countystat/list', text: 'County Stats' });
			sampleMenu.push({ id: '/auth/statestat/list', text: 'State Stats' });
			sampleMenu.push({ id: '/auth/sampletest/import', text: 'Import Tests' });
		}

		if (sampleMenu.length > 0) {
			this.menuItems.push({
				text: 'Samples',
				iconCss: 'fal fa-vial',
				items: sampleMenu
			});
		}

		var manageMenu: MenuItemModel[] = [];

		if (privileges.customers.read) {
			manageMenu.push({ id: '/auth/customer/list', text: 'Customers' });
		}		

		if (privileges.sites.read) {
			manageMenu.push({ id: '/auth/site/list', text: 'Sites' });
		}

		if (privileges.locations.read) {
			manageMenu.push({ id: '/auth/location/list', text: 'Locations' });
		}

		if (privileges.locations.read) {
			manageMenu.push({ id: '/auth/sampler/list', text: 'Samplers' });
		}

		if (privileges.vendors.read) {
			manageMenu.push({ id: '/auth/vendor/list', text: 'Vendors' });
		}

		if (privileges.testTypes.read) {
			manageMenu.push({ id: '/auth/testtype/list', text: 'Test Types' });
		}
		if (privileges.newsArticles.read) {
			manageMenu.push({ id: '/auth/newsArticle/list', text: 'News Articles' });
		}

		if (manageMenu.length > 0) {
			this.menuItems.push({
				text: 'Manage',
				iconCss: 'fal fa-cubes',
				items: manageMenu
			});
		}

		var dataMenu: MenuItemModel[] = [];

		if (privileges.states.read) {
			dataMenu.push({ id: '/auth/state/list', text: 'States' });
		}

		if (privileges.counties.read) {
			dataMenu.push({ id: '/auth/county/list', text: 'Counties' });
		}

		if (privileges.postalCodes.read) {
			dataMenu.push({ id: '/auth/postalcode/list', text: 'Postal Codes' });
		}


		if (dataMenu.length > 0) {
			this.menuItems.push({
				text: 'Data',
				iconCss: 'fal fa-database',
				items: dataMenu
			});
		}

		var settingsMenu: MenuItemModel[] = [];

		if (privileges.manageUsers.read) {
			settingsMenu.push({ id: '/auth/user/list', text: 'Users' });
		}

		if (privileges.manageRoles.read) {
			settingsMenu.push({ id: '/auth/role/list', text: 'Roles' });
		}

		if (privileges.manageRoles.read) {
			settingsMenu.push({ id: '/auth/tenant/list', text: 'Tenants' });
		}

		if (settingsMenu.length > 0) {
			this.menuItems.push({
				text: 'Settings',
				iconCss: 'fal fa-cog',
				items: settingsMenu
			});
		}		
    }
    //-------------------------------------------------------------------------------------
    public openEmailSidebar(data) {
        this.emailComponent.setList(data.payload);
		this.contactSidebar.show();
		this.contactSidebarName = 'email';
    }
	//-------------------------------------------------------------------------------------
	public openSmsSidebar(data) {
		this.smsComponent.setList(data.payload);
		this.contactSidebar.show();
		this.contactSidebarName = 'sms';
	}
   //-------------------------------------------------------------------------------------
	public closeContactSidebar() {
		this.contactSidebar.hide();
	}
   //-------------------------------------------------------------------------------------
    public selectMainMenu(args: MenuEventArgs): void {
        if (args.item.id) {
            this.router.navigate([args.item.id]);
        }
    }
    //-------------------------------------------------------------------------------------
    public selectAccountMenu(args: MenuEventArgs): void {
		if (args.item.id == 'logout') {
			this.authService.logout({ postLogoutRedirectUri: window.location.origin });
		}
        else if (args.item.id == 'login') {
            this.authService.loginPopup().toPromise().then(() => {
                this.router.navigate(['/auth']);
                setTimeout(() => window.location.reload(), 500);
            });
        }
        else if (args.item.id == 'tenant') {
            this.router.navigate(['/auth/account/tenant']);
        }
    }
    //-------------------------------------------------------------------------------------
	public menuItems: MenuItemModel[];
    //-------------------------------------------------------------------------------------
    openClick() {
        this.sidebarMenuInstance.toggle();
        this.sidebardisplaysize = this.sidebarMenuInstance.isOpen ? this.sidebarwidth : this.dockSize;
    }
    //-------------------------------------------------------------------------------------
    created() {
        this.sidebarMenuInstance.toggle();
        this.sidebardisplaysize = this.dockSize;
    }

	createdContactSidebar() {
		this.contactSidebar.toggle();
    }
    //-------------------------------------------------------------------------------------
}
