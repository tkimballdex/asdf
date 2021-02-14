import { Component, OnInit } from '@angular/core';
import { LocationRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';

@Component({
    selector: 'location-list',
    templateUrl: './list.component.html',
})
export class LocationListComponent extends PageComponent implements OnInit {
	constructor(private repository: LocationRepository, private tenant: TenantService) {
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
