import { Component, OnInit } from '@angular/core';
import { MsalHttpClient } from '../shared/msal-http';
import { PageComponent } from '../shared/page.component';
import { UserRepository } from '../user/repository';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent extends PageComponent implements OnInit {
    constructor(private http: MsalHttpClient, private repository: UserRepository) {
        super();
    }

    public tenantList: any;
    public tenant: any;

    async ngOnInit() {
        this.http.postWithErrorCheck('/home/getdata2', null, (data) => console.dir(data));
        this.tenantList = await this.repository.tenantList();
        this.tenant = localStorage.getItem('tenant');
    }
}
