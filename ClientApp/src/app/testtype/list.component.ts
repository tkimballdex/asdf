import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../shared/page.component';
import { AppService } from "../shared/app.service";
import { TestTypeRepository } from './repository';
import { TenantService } from '../shared/tenant.service';

@Component({
  selector: 'testtype-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class TestTypeListComponent extends PageComponent implements OnInit {
	constructor(private repository: TestTypeRepository, private appService: AppService, private tenant: TenantService) {
        super();
    }
    //--------------------------------------------------------------------------------------------------------------------
    public list: any;
    public name: any;
    //--------------------------------------------------------------------------------------------------------------------
    async ngOnInit() {
        this.app = await this.appService.getData();
        this.privileges = this.app.privileges.testTypes;

        if (this.tenant.id) {
            this.search();
        }
    }
    //--------------------------------------------------------------------------------------------------------------------
    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenantId: this.tenant.id, name: this.name });
        this.hideSpinner();
    }
    //--------------------------------------------------------------------------------------------------------------------
}

