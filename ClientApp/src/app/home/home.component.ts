import { Component, OnInit } from '@angular/core';
import { MsalHttpClient } from '../shared/msal-http';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';
import { UserRepository } from '../user/repository';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent extends PageComponent implements OnInit {
    constructor(private http: MsalHttpClient, private app: AppRepository) {
        super();
    }

    public tenant: string;
    public username: string;

    async ngOnInit() {
        this.http.postWithErrorCheck('/home/getdata2', null, (data) => console.dir(data));
        this.tenant = localStorage.getItem('tenant');
        this.username = this.app.userName;
    }
}
