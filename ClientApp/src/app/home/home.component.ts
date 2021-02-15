import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';
import { TenantService } from '../shared/tenant.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
})
export class HomeComponent extends PageComponent implements OnInit {
	constructor(private appRepository: AppRepository, private tenant: TenantService) {
		super();
	}

	public username: string;

	async ngOnInit() {
		this.username = this.appRepository.userName;
		await this.tenant.validate();
	}
}
