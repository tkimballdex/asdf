import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendorsRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';

@Component({
    selector: 'vendors-list',
    templateUrl: './list.component.html',
})
export class VendorsListComponent extends PageComponent implements OnInit {
    constructor(private repository: VendorsRepository, private router: Router, private app: AppRepository) {
        super();
    }

    public list: any;
    public tenant: any;
    public name: any;

    async ngOnInit() {
        this.tenant = this.app.tenant;

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
