import { Component, OnInit } from '@angular/core';
import { UserRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';

@Component({
    selector: 'user-list',
    templateUrl: './list.component.html',
})
export class UserListComponent extends PageComponent implements OnInit {
	constructor(private repository: UserRepository, private tenant: TenantService) {
        super();
    }

    public list: any;
    public tenantList: any;
    public tenantId: any;
    public username: any;

    async ngOnInit() {
        this.showSpinner();
		this.tenantList = await this.tenant.getList();
        this.tenantId = this.tenant.id;
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
}
