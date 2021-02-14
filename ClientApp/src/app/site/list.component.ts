import { Component, OnInit } from '@angular/core';
import { SiteRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';

@Component({
    selector: 'site-list',
    templateUrl: './list.component.html',
})
export class SiteListComponent extends PageComponent implements OnInit {
	constructor(private repository: SiteRepository, private tenant: TenantService) {
        super();
    }

    public list: any;
    public name: any;

    async ngOnInit() {
        if (this.tenant.id) {
            this.search();
        }
    }

    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenantId: this.tenant.id, name: this.name });
        this.hideSpinner();
    }
}
