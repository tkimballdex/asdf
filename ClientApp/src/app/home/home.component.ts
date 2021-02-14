import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent extends PageComponent implements OnInit {
	constructor(private appRepository: AppRepository, private router: Router) {
        super();
    }

    public username: string;

	async ngOnInit() {
		this.username = this.appRepository.userName;

		if (!this.appRepository.tenantId) {
			console.dir('Tenant is not set, redirecting to choose tenant page');
			this.router.navigate(['/auth/account/tenant']);
		}
	}
}
