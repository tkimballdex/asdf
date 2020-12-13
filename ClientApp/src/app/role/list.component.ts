import { Component, OnInit } from '@angular/core';
import { RoleRepository } from './repository';
import { PageComponent } from '../shared/page.component';

@Component({
    selector: 'role-list',
    templateUrl: './list.component.html',
})
export class RoleListComponent extends PageComponent implements OnInit {
    constructor(private repository: RoleRepository) {
        super();
    }

    public list: any;

    async ngOnInit() {
        this.showSpinner();
        this.list = await this.repository.list();
        this.hideSpinner();
    }
}
