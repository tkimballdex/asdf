import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';

@Component({
    selector: 'location-list',
    templateUrl: './list.component.html',
})
export class LocationListComponent extends PageComponent implements OnInit {
    constructor(private repository: LocationRepository, private router: Router, private app: AppRepository) {
        super();
    }

    public list: any;
    public tenant: any;
    public name: any;

    async ngOnInit() {
        this.showSpinner();
        this.tenant = this.app.tenant;
        this.hideSpinner();

        if (this.tenant) {
            this.search();
        }
    }

    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenant: this.app.tenant, name: this.name });
        this.hideSpinner();
    }
}
