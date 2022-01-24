import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { UserRepository } from './repository';

@Component({
	selector: 'user-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class UserEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: UserRepository) {
		super();
	}

	public record: any;
	public customers: any;
	public vendors: any;
	public deleteDialog: Dialog;
	public integrationKey: string;
	@ViewChild('grid') public grid: GridComponent;

	async ngOnInit() {
		this.privileges = (await this.appService.getPrivileges()).users;

		var id = this.route.snapshot.paramMap.get('id');
		this.showSpinner();
		var data = await this.repository.get(id);
		this.hideSpinner();

		this.customers = await this.repository.listCustomers();
		this.customers.unshift({ id: null, name: '' });

		this.vendors = await this.repository.listVendors();
		this.vendors.unshift({ id: null, name: '' });

		this.record = data.record || {};
		this.record.roles = data.roles;
		this.record.tenants = data.tenants;
		this.record.updated = data.updated;

		this.record.roles.forEach(function (x, i) {
			x.index = i;
		});

		this.record.tenants.forEach(function (x, i) {
			x.index = i;
		});

		if (id == null) {
			this.record.siteId = this.route.snapshot.paramMap.get('siteId');
		}
	}

	async save() {
		var add = !this.record.id;
		this.record.api = !!this.record.api;
		this.showSpinner();
		var returnValue = await this.repository.save(this.record);
		this.hideSpinner();

		if (returnValue && returnValue.error) {
			this.showErrorMessage(returnValue.description);
		}
		else {
			var success = returnValue && returnValue.updated;
			this.showSaveMessage(success);

			if (success) {
				this.record.id = returnValue.id;
			}

			if (success && add) {
				setTimeout(() => this.router.navigate(['/auth/user/edit', returnValue.id]), 1000);
			}
		}
	}

	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete User',
			content: `Are you sure you want to delete the user <b>${this.record.userName}</b>?`,
			okButton: { click: this.deleteOK.bind(this) }
		});
	}

	async deleteOK() {
		this.showSpinner();
		this.deleteDialog.close();
		var success = await this.repository.delete(this.record.id);
		this.hideSpinner();
		this.showDeleteMessage(success);

		if (success) {
			setTimeout(() => this.router.navigate(['/auth/user/list']), 1000);
		}
	}

	async sendPasswordResetLink() {
		this.showSpinner();
		var success = await this.repository.sendPasswordResetLink(this.record.id);

		if (success) {
			this.showSuccessMessage(`Sent password reset link to ${this.record.email}!`);
		}
		else {
			this.showErrorMessage('Error!');
		}

		this.hideSpinner();
	}

	async generateIntegrationKey() {
		this.showSpinner();
		var key = await this.repository.generateIntegrationKey(this.record.id);

		if (key) {
			this.integrationKey = key;
		}
		else {
			this.showErrorMessage('Error generating API key!');
		}

		this.hideSpinner();
	}

	async changeCustomer() {
		if (this.record.customerId) {
			this.record.vendorId = null;
		}
	}

	async changeVendor() {
		if (this.record.vendorId) {
			this.record.customerId = null;
		}
	}
}
