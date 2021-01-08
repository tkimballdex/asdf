import { Component, ViewEncapsulation, Inject, ViewChild, OnInit } from '@angular/core';
import { SidebarComponent, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { MsalService } from '@azure/msal-angular';
import { Router } from "@angular/router";
import { MsalHttpClient } from './shared/msal-http';
import { AppRepository } from './shared/app.repository';


@Component({
    selector: 'app-root',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    @ViewChild('sidebarMenuInstance', null)
    public sidebarMenuInstance: SidebarComponent;
    public width: string = '220px';
    public mediaQuery: string = ('(min-width: 600px)');
    public target: string = '.main-content';
    public dockSize: string = '70px';
    public enableDock: boolean = true;
    public username: string;
    public tenantList: any;
    public tenant: any;

    constructor(private authService: MsalService, private router: Router, private http: MsalHttpClient, private app: AppRepository) {
        console.dir(this.authService.getAccount());

        this.AccountMenuItem = [
            {
                id: 'tenant',
                text: 'Switch Tenant'                 
            }
        ];       

        if (this.authService.getAccount() != null) {
            this.AccountMenuItem.push({ id: 'logout', text: 'Sign out' });
        }
        else {
            this.AccountMenuItem.push({ id: 'login', text: 'Log In' });
        };
    }

    async ngOnInit() {
        this.tenantList = await this.app.tenantList();
        this.tenant = this.app.tenant;
    }

    public selectMainMenu(args: MenuEventArgs): void {
        if (args.item.id) {
            this.router.navigate([args.item.id]);
        }
    }

    public selectAccountMenu(args: MenuEventArgs): void {
        if (args.item.id == 'logout') {
            this.authService.logout();
        }
        else if (args.item.id == 'login') {
            this.authService.loginPopup().then(() => {
                this.router.navigate(['/']);
                setTimeout(() => window.location.reload(), 500);
            });
        }
        else if (args.item.id == 'tenant') {
            this.router.navigate(['/account/tenant']);
        }
    }

    public menuItems: MenuItemModel[] = [
        {
            text: 'Home',
            iconCss: 'fal fa-home-alt',
            id: '/'
        },
        {
            text: 'Dashboard',
            iconCss: 'fal fa-tachometer-alt',
            id: '/dashboard'
        },
        {
            text: 'Samples',
            iconCss: 'fal fa-vials',
            id: '/'
        },
        {
            text: 'Manage',
            iconCss: 'fal fa-cubes',
            items: [
                { id: '/customer/list', text: 'Customers' },
                { id: '/site/list', text: 'Sites' },
                { id: '/location/list', text: 'Locations' },
                { id: '/vendor/list', text: 'Vendors' }
            ]
        },
        {
            text: 'Settings',
            iconCss: 'fal fa-cog',
            items: [
                { id: '/user/list', text: 'Users' },
                { id: '/role/list', text: 'Roles' },
                { id: '/role/list', text: 'Tenants' }                
            ]
        }        
    ];

    public AccountMenuItem: ItemModel[];

    openClick() {
        this.sidebarMenuInstance.toggle();
    }

    public changeTenant() {
        this.app.tenant = this.tenant;
    }
};
