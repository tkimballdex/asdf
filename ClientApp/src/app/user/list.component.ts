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
    constructor(private repository: UserRepository, private router: Router, private appRepository: AppRepository) {
        super();
    }

    public list: any;
    public tenantList: any;
    public tenantId: any;
    public username: any;

    async ngOnInit() {
        this.showSpinner();
		this.tenantList = await this.appRepository.getTenants();
        this.tenantId = this.appRepository.tenantId;
        this.hideSpinner();

        if (this.tenantId) {
            this.search();
        }
    }

    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenantId: this.tenantId, username: this.username });
        this.hideSpinner();
    }

    changeTenant() {

    }
}
