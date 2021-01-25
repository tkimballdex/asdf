import { Component, ViewEncapsulation, Inject, ViewChild, OnInit } from '@angular/core';
import { SidebarComponent, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { MsalService } from '@azure/msal-angular';
import { Router } from "@angular/router";
import { AppRepository, EventQueueService, AppEvent, AppEventType } from './shared/app.repository';
import { EmailComponent } from './email/email.component';

@Component({
    selector: 'app-root',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
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
                this.router.navigate(['/']);
                setTimeout(() => window.location.reload(), 500);
            });
        }
        else if (args.item.id == 'tenant') {
            this.router.navigate(['/account/tenant']);
        }
    }
    //-------------------------------------------------------------------------------------
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
            items: [   
            { id: '/sample/list', text: 'Samples' },
            { id: '/sampletest/list', text: 'Sample Test' },
            { id: '/customer/list', text: 'Other' }
            ],
        },
        {
            text: 'Manage',
            iconCss: 'fal fa-cubes',
            items: [
                { id: '/customer/list', text: 'Customers' },
                { id: '/site/list', text: 'Sites' },
                { id: '/location/list', text: 'Locations' },
                { id: '/vendor/list', text: 'Vendors' },
                { id: '/testtype/list', text: 'Test Types' }
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
};
