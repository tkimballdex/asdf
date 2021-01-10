import { Component, OnInit } from '@angular/core';
import { AppRepository } from '../shared/app.repository';
import { MsalHttpClient } from '../shared/msal-http';
import { PageComponent } from '../shared/page.component';
import { UserRepository } from '../user/repository';

@Component({
  selector: 'app-home',
  templateUrl: './tenant.component.html',
})
export class ChooseTenantComponent extends PageComponent implements OnInit {
    constructor(private http: MsalHttpClient, private repository: UserRepository, private appRepository: AppRepository) {
        super();
    }

    public tenantList: any;
    public tenant: any;

    async ngOnInit() {
        this.tenantList = await this.appRepository.tenantList();
        this.tenant = this.appRepository.tenant;
    }

    public changeTenant() {
        this.appRepository.tenant = this.tenant;
    }
}
