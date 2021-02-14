import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalHttpClient } from '../shared/msal-http';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent extends PageComponent implements OnInit {
	constructor(private http: MsalHttpClient, private appRepository: AppRepository, private router: Router) {
        super();
    }

    public username: string;

	async ngOnInit() {
		this.http.postWithErrorCheck('/home/getdata2', null, (data) => {
			console.dir(data);
			this.username = this.appRepository.userName;

			if (!this.appRepository.tenantId) {
				console.dir('Tenant is not set, redirecting to choose tenant page');
				this.router.navigate(['/auth/account/tenant']);
			}
		});
	}
}
