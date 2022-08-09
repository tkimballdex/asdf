import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { UserRepository } from './repository';

@Component({
	selector: 'my-account',
	templateUrl: './account.component.html',
})
export class MyAccountComponent extends PageComponent implements OnInit {
	constructor(private authService: MsalService, private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: UserRepository) {
		super();
	}

	public user: any;
	public customers: any;
	public vendors: any;
	public deleteDialog: Dialog;
	public integrationKey: string;
	@ViewChild('grid') public grid: GridComponent;

	async ngOnInit() {
		this.privileges = (await this.appService.getPrivileges()).users;

		this.showSpinner();
        this.user = this.authService.instance.getActiveAccount();
		this.hideSpinner();

		this.customers = await this.repository.listCustomers();
		this.customers.unshift({ id: null, name: '' });

		this.vendors = await this.repository.listVendors();
		this.vendors.unshift({ id: null, name: '' });

	}


	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete User',
			content: `Are you sure you want to delete the user <b>${this.user.userName}</b>?`,
			okButton: { click: this.deleteOK.bind(this) }
		});
	}

	async deleteOK() {
		this.showSpinner();
		this.deleteDialog.close();
		var success = await this.repository.delete(this.user.id);
		this.hideSpinner();
		this.showDeleteMessage(success);

		if (success) {
			setTimeout(() => this.router.navigate(['/auth/user/list']), 1000);
		}
	}

	async sendPasswordResetLink() {
		this.showSpinner();
		var success = await this.repository.sendPasswordResetLink(this.user.id);

		if (success) {
			this.showSuccessMessage(`Sent password reset link to ${this.user.email}!`);
		}
		else {
			this.showErrorMessage('Error!');
		}

		this.hideSpinner();
	}

	async generateIntegrationKey() {
		this.showSpinner();
		var key = await this.repository.generateIntegrationKey(this.user.id);

		if (key) {
			this.integrationKey = key;
		}
		else {
			this.showErrorMessage('Error generating API key!');
		}

		this.hideSpinner();
	}

	async changeCustomer() {
		if (this.user.customerId) {
			this.user.vendorId = null;
		}
	}

	async changeVendor() {
		if (this.user.vendorId) {
			this.user.customerId = null;
		}
	}
}
