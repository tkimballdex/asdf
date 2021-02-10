import { Component, OnInit } from '@angular/core';
import { AppRepository } from '../shared/app.repository';
import { MsalHttpClient } from '../shared/msal-http';
import { PageComponent } from '../shared/page.component';
import { UserRepository } from '../user/repository';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './tenant.component.html',
})
export class ChooseTenantComponent extends PageComponent implements OnInit {
    constructor(private http: MsalHttpClient, private router: Router, private repository: UserRepository, private appRepository: AppRepository) {
        super();
    }

    public tenantList: any;

    async ngOnInit() {
        this.tenantList = await this.appRepository.tenantList();
    }

    public changeTenant() {
        var t = this.tenantList.find(x => x.id == this.appRepository.tenantId);
        this.appRepository.tenantName = t.name;
        setTimeout(() => this.router.navigate(['/auth']), 1000);
    }
}
