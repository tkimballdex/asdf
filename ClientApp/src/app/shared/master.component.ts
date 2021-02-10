import { Component, ViewEncapsulation, Inject, ViewChild, OnInit } from '@angular/core';
import { SidebarComponent, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { MsalService } from '@azure/msal-angular';
import { Router } from "@angular/router";
import { AppRepository, EventQueueService, AppEvent, AppEventType } from './../shared/app.repository';
import { EmailComponent } from './../email/email.component';

@Component({
    selector: 'master-page',
    templateUrl: './master.component.html'
})
export class MasterPageComponent implements OnInit {  
    @ViewChild('sidebarMenuInstance') public sidebarMenuInstance: SidebarComponent;
    @ViewChild('emailSidebar') public emailSidebar: SidebarComponent;
    @ViewChild('emailComponent') public emailComponent: EmailComponent;

    public sidebarwidth: string = '180px';
    public mediaQuery: string = ('(min-width: 3200px)');
    public target: string = '.main-content';
    public dockSize: string = '70px';
    public enableDock: boolean = true;
    public isOpen: boolean = false;
    public username: string;
    public sidebardisplaysize = '180px';
    public AccountMenuItem: ItemModel[];
    //-------------------------------------------------------------------------------------
    constructor(private authService: MsalService, private router: Router, public appRepository: AppRepository, private eventQueue: EventQueueService) {
        console.dir(this.authService.getAccount());

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

        if (this.authService.getAccount() != null) {
            this.AccountMenuItem.push({ id: 'logout', text: 'Sign out' });
        }
        else {
            this.AccountMenuItem.push({ id: 'login', text: 'Log In' });
        };
    }
    //-------------------------------------------------------------------------------------
    async ngOnInit() {
        this.username = this.appRepository.userName;
        this.eventQueue.on(AppEventType.SendEmail).subscribe((event) => this.openEmailSidebar(event));
    }
    //-------------------------------------------------------------------------------------
    public openEmailSidebar(data) {
        this.emailComponent.setList(data.payload);
        this.emailSidebar.show();
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
            this.authService.logout();
        }
        else if (args.item.id == 'login') {
            this.authService.loginPopup().then(() => {
                this.router.navigate(['/auth']);
                setTimeout(() => window.location.reload(), 500);
            });
        }
        else if (args.item.id == 'tenant') {
            this.router.navigate(['/auth/account/tenant']);
        }
    }
    //-------------------------------------------------------------------------------------
    public menuItems: MenuItemModel[] = [
        {
            text: 'Home',
            iconCss: 'fal fa-home-alt',
            id: '/auth'
        },
        {
            text: 'Dashboard',
            iconCss: 'fal fa-tachometer-alt',
            id: '/auth/dashboard'
        },
        {
            text: 'Samples',
            iconCss: 'fal fa-vials',
            items: [
                { id: '/auth/sample/list', text: 'Samples' },
                { id: '/auth/sampletest/list', text: 'Sample Test' },
                { id: '/auth/customer/list', text: 'Other' }
            ],
        },
        {
            text: 'Manage',
            iconCss: 'fal fa-cubes',
            items: [
                { id: '/auth/customer/list', text: 'Customers' },
                { id: '/auth/site/list', text: 'Sites' },
                { id: '/auth/location/list', text: 'Locations' },
                { id: '/auth/vendor/list', text: 'Vendors' },
                { id: '/auth/testtype/list', text: 'Test Types' }
            ]
        },
        {
            text: 'Settings',
            iconCss: 'fal fa-cog',
            items: [
                { id: '/auth/user/list', text: 'Users' },
                { id: '/auth/role/list', text: 'Roles' },
                { id: '/auth/role/list', text: 'Tenants' }
            ]
        }
    ];
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

    createdEmailSidebar() {
        this.emailSidebar.toggle();
    }
    //-------------------------------------------------------------------------------------
}
