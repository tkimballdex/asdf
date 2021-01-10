import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SiteRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';

@Component({
    selector: 'site-list',
    templateUrl: './list.component.html',
})
export class SiteListComponent extends PageComponent implements OnInit {
    constructor(private repository: SiteRepository, private router: Router, private appRepository: AppRepository) {
        super();
    }

    public list: any;
    public tenant: any;
    public name: any;

    async ngOnInit() {
        //this.showSpinner();
        this.tenant = this.appRepository.tenant;
        //this.hideSpinner();

        if (this.tenant) {
            this.search();
        }
    }

    async search() {
        //this.showSpinner();
        this.list = await this.repository.list({ tenant: this.appRepository.tenant, name: this.name });
        //this.hideSpinner();
    }
}
