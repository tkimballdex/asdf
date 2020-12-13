import { Component, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { SidebarComponent, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { MsalService } from '@azure/msal-angular';
import { Router } from "@angular/router";


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
    constructor(private authService: MsalService, private router: Router) {

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
    public AccountMenuItem: MenuItemModel[] = [
        {
            text: 'Account',
            items: [
                { id: 'tenant', text: 'Tenant' },
                { id: 'logout', text: 'Sign out' },
            ]
        }
    ];

    openClick() {
        this.sidebarMenuInstance.toggle();
    }
};
// open new tab
