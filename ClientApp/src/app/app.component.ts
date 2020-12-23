import { Component, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { SidebarComponent, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { MsalService } from '@azure/msal-angular';
import { Router } from "@angular/router";
import { MsalHttpClient } from './shared/msal-http';


@Component({
    selector: 'app-root',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    @ViewChild('sidebarMenuInstance', null)
    public sidebarMenuInstance: SidebarComponent;
    public width: string = '220px';
    public mediaQuery: string = ('(min-width: 600px)');
    public target: string = '.main-content';
    public dockSize: string = '70px';
    public enableDock: boolean = true;
    constructor(private authService: MsalService, private router: Router, private http: MsalHttpClient) {
        console.dir(this.authService.getAccount());

        this.AccountMenuItem = [
            {
                text: 'Account',
                items: [
                    { id: 'tenant', text: 'Tenant' },
                ]
            }
        ];

        if (this.authService.getAccount() != null) {
            this.AccountMenuItem[0].items.push({ id: 'logout', text: 'Sign out' });
        }
        else {
            this.AccountMenuItem[0].items.push({ id: 'login', text: 'Log In' });
        }
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
            iconCss: 'e-icons home',
            id: '/'
        },
        {
            text: 'Settings',
            iconCss: 'e-icons settings',
            items: [
                { id: '/role/list', text: 'Roles' },
                { id: '/user/list', text: 'Users' },
            ]
        },
        {
            text: 'Notification',
            iconCss: 'icon-bell-alt icon',
            items: [
                { text: 'Message' },
                { text: 'Facebook' },
                { text: 'Twitter' }
            ]
        },
        {
            text: 'Comments',
            iconCss: 'icon-comment-inv-alt2 icon',
            items: [
                { text: 'Category1' },
                { text: 'Category2' },
                { text: 'Category3' }
            ]
        }
    ];

    public AccountMenuItem: MenuItemModel[];

    openClick() {
        this.sidebarMenuInstance.toggle();
    }

    public data: Object[] = [
        {
            nodeId: '01', nodeText: 'Home', iconCss: 'e-icons home',
        },
        {
            nodeId: '02', nodeText: 'Dashboard', iconCss: 'icon-thumbs-up-alt icon',
        },
        {
            nodeId: '03', nodeText: 'Samples', iconCss: 'icon-docs icon',
        },
        {
            nodeId: '04', nodeText: 'Manage', iconCss: 'icon-th icon',
            nodeChild: [
                { nodeId: '04-01', nodeText: 'Customers', iconCss: 'icon-circle-thin icon' },
                { nodeId: '04-02', nodeText: 'Sites', iconCss: 'icon-circle-thin icon' },
                { nodeId: '04-03', nodeText: 'Locations', iconCss: 'icon-circle-thin icon' }
            ]
        },
        {
            nodeId: '05', nodeText: 'Settings', iconCss: 'icon-code icon',
            nodeChild: [
                { nodeId: 'user/list', nodeText: 'Users', iconCss: 'icon-circle-thin icon' },
                { nodeId: '/role/list', nodeText: 'Roles', iconCss: 'icon-circle-thin icon' },
                { nodeId: '05-03', nodeText: 'Tenants', iconCss: 'icon-circle-thin icon' },
                { nodeId: '05-04', nodeText: 'Labs', iconCss: 'icon-circle-thin icon' }
            ]
        }        
    ];
    public field: Object = { dataSource: this.data, id: 'nodeId', text: 'nodeText', navigateUrl: 'nodeId', child: 'nodeChild', iconCss: 'iconCss' };
};
