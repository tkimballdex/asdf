import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
})
export class HomeComponent extends PageComponent implements OnInit {
	constructor(private appRepository: AppRepository) {
		super();
	}

	public username: string;

	async ngOnInit() {
		this.username = this.appRepository.userName;
		this.appRepository.validateTenant();
	}
}
