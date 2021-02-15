import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../shared/page.component';
import { AppService } from '../shared/app.service';
import { TenantService } from '../shared/tenant.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
})
export class HomeComponent extends PageComponent implements OnInit {
	constructor(private appService: AppService, private tenant: TenantService) {
		super();
	}

	public username: string;

	async ngOnInit() {
		this.username = this.appService.userName;
		await this.tenant.validate();
	}
}
