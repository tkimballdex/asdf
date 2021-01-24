import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from "../shared/app.repository";
import { TestTypeRepository } from './repository';

@Component({
  selector: 'testtype-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class TestTypeListComponent extends PageComponent implements OnInit {
    constructor(private repository: TestTypeRepository, private router: Router, private appRepository: AppRepository) {
        super();
    }
    //--------------------------------------------------------------------------------------------------------------------
    public list: any;
    public name: any;
    //--------------------------------------------------------------------------------------------------------------------
    async ngOnInit() {
        this.app = await this.appRepository.getData();
        this.privileges = this.app.privileges.testTypes;

        if (this.appRepository.tenantId) {
            this.search();
        }
    }
    //--------------------------------------------------------------------------------------------------------------------
    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenantId: this.appRepository.tenantId, name: this.name });
        this.hideSpinner();
    }
    //--------------------------------------------------------------------------------------------------------------------
}

