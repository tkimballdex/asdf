import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';

@Component({
    selector: 'user-list',
    templateUrl: './list.component.html',
})
export class UserListComponent extends PageComponent implements OnInit {
    constructor(private repository: UserRepository, private router: Router, private app: AppRepository) {
        super();
    }

    public list: any;
    public tenantList: any;
    public tenant: any;
    public username: any;

    async ngOnInit() {
        this.showSpinner();
        this.tenantList = await this.repository.tenantList();
        this.tenant = this.app.tenant;
        this.hideSpinner();

        if (this.tenant) {
            this.search();
        }
    }

    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenant: this.tenant, username: this.username });
        this.hideSpinner();
    }

    changeTenant() {

    }
}
