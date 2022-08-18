import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog, DialogUtility } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { CustomerRepository } from './repository';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { TenantService } from '../shared/tenant.service';
import { validateServiceEndDate } from '../shared/validators';
import { EditSettingsModel, ToolbarItems, CommandModel, DialogEditEventArgs } from '@syncfusion/ej2-angular-grids';
import { Browser } from '@syncfusion/ej2-base';

@Component({
	selector: 'customer-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class CustomerEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: CustomerRepository, private tenant: TenantService) {
		super();
	}

	public id: string;
	public record: any;
	public form: FormGroup;
	public deleteDialog: Dialog;

	public tenantAnalytes: any;
	public customerAnalytes: any = null;
	public editAnalyte: boolean = false;
	public dateFormat: any;
	public editSettings: EditSettingsModel;
	public toolbar: ToolbarItems[];
	public editCommand: CommandModel[];
	public deleteCommand: CommandModel[];
	public submitClicked: boolean = false;
	public analyteForm: FormGroup;
	public status: string;
	public activeToggleText: string;

	@ViewChild('editTab') public editTab: TabComponent;
	@ViewChild('editSettingsTemplate') public editSettingsTemplate: TabComponent;
	@ViewChild('ServiceStartDate') public ServiceStartDate;
	@ViewChild('ServiceEndDate') public ServiceEndDate;
	//------------------------------------------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();

		this.id = this.route.snapshot.paramMap.get('id');
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.customers;
		this.tenantAnalytes = await this.repository.listTenantAnalytes(this.tenant.id);

		this.dateFormat = { type: 'date', format: 'MM/dd/yyyy' };
		this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', showDeleteConfirmDialog: true };
		this.toolbar = ['Add'];
		this.editCommand = [
			{ type: 'Edit', buttonOption: { cssClass: 'command-button', iconCss: 'e-edit e-icons' } },
		];
		this.deleteCommand = [
			{ type: 'Delete', buttonOption: { cssClass: 'command-button', iconCss: 'e-delete e-icons' } },
		];

		if (this.id == null) {
			this.record = {
				tenant: this.tenant.name,
				active: true
			}
		} else {
			this.record = await this.repository.get(this.id);
			this.customerAnalytes = await this.repository.listCustomerAnalytes(this.id);
			this.status = this.record.active ? "Active" : "Inactive";
			this.activeToggleText = this.record.active ? "Deactivate" : "Activate";
		}
		this.hideSpinner();

		this.form = new FormGroup({
			name: new FormControl(this.record.name, [Validators.required]),
			serviceStartDate: new FormControl(this.record.serviceStartDate ? new Date(this.record.serviceStartDate) : null),
			serviceEndDate: new FormControl(this.record.serviceEndDate ? new Date(this.record.serviceEndDate) : null),
			address: new FormControl(this.record.address, [Validators.required]),
			city: new FormControl(this.record.city, [Validators.required]),
			stateId: new FormControl(this.record.stateId, [Validators.required]),
			postalCode: new FormControl(this.record.postalCode, [Validators.required]),
			website: new FormControl(this.record.website, []),
			phoneNo: new FormControl(this.record.phoneNo, [Validators.required]),
			contactName: new FormControl(this.record.contactName, [Validators.required]),
			contactEmail: new FormControl(this.record.contactEmail, [Validators.required, Validators.email]),
			contactPhoneNo: new FormControl(this.record.contactPhoneNo, [Validators.required]),
			notificationEmail: new FormControl(this.record.notificationEmail, [Validators.email]),
		}, { validators: validateServiceEndDate });
	}
	//------------------------------------------------------------------------------------------------------------------------
	createFormGroup(data): FormGroup {
		return new FormGroup({
			analyteId: new FormControl(data.analyteId, [Validators.required]),
			sendNotifications: new FormControl(data.sendNotifications),
			sendAlerts: new FormControl(data.sendAlerts),
			showOnDashboard: new FormControl(data.showOnDashboard),
		});
	}
	//------------------------------------------------------------------------------------------------------------------------
	editTabCreated() {
		if (history.state.sites) {
			this.editTab.selectedItem = 1;
		}
	}
	//------------------------------------------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!")
		} else if (this.form.errors?.['validateEndDate'] === 'validateEndDate') {
			this.showErrorMessage("End date is before start date!")
		} else {
			Object.assign(this.record, this.form.value);

			var add = !this.record.id;
			this.showSpinner();
			this.record.tenantId = this.appService.tenantId;
			var returnValue = await this.repository.save(this.record);
			this.hideSpinner();

			if (returnValue && returnValue.error) {
				this.showErrorMessage(returnValue.description);
			}
			else {
				var success = returnValue && returnValue.updated;
				this.showSaveMessage(success);

				if (success) {
					this.record = returnValue;
				}

				if (success && add) {
					this.record.id = returnValue.id;
					history.pushState('', '', `/auth/customer/edit/${returnValue.id}`);
				}
			}
		}
	}
	//------------------------------------------------------------------------------------------------------------------------
	async actionBegin(args) {
		if (args.requestType === 'beginEdit' || args.requestType === 'add') {
			this.submitClicked = false;
			this.analyteForm = this.createFormGroup(args.rowData);
		}

		if (args.requestType === 'beginEdit') {
			this.editAnalyte = true;
		} else if (args.requestType === 'add') {
			this.editAnalyte = false;
		}

		if (args.requestType === 'save') {
			this.submitClicked = true;
			this.analyteForm.markAllAsTouched();
			if (this.analyteForm.invalid) {
				this.showErrorMessage("Please complete all required fields!");
				this.customerAnalytes = await this.repository.listCustomerAnalytes(this.id);
				return;
			}

			if (args.action === "edit" || args.action === "add") {
				const analyteName = await this.repository.getAnalyteName(this.analyteForm.value.analyteId);
				this.analyteForm.value.analyte = analyteName['name'];
				this.analyteForm.value.tenantId = this.tenant.id;
				this.analyteForm.value.customerId = this.record.id;
				this.analyteForm.value.id = args.data.id
				if (this.analyteForm.value.sendNotifications === null) {
					this.analyteForm.value.sendNotifications = false
				}
				if (this.analyteForm.value.sendAlerts === null) {
					this.analyteForm.value.sendAlerts = false
				}
				if (this.analyteForm.value.showOnDashboard === null) {
					this.analyteForm.value.showOnDashboard = false
				}
			}
			if (args.action === "add") {
				this.analyteForm.value.id = this.appService.GuidEmpty;
			}
			const response = await this.repository.saveCustomerAnalyte(this.analyteForm.value);
			this.customerAnalytes = await this.repository.listCustomerAnalytes(this.id);
		}

		if (args.requestType === 'delete') {
			this.showSpinner();
			const result = await this.repository.deleteCustomerAnalyte(args.data[0].id);
			this.hideSpinner();

			if (result.error) {
				this.showErrorMessage(result.description);
			} else {
				this.showDeleteMessage(true);
				this.customerAnalytes = await this.repository.listCustomerAnalytes(this.id);
			}
		}
	}
	//------------------------------------------------------------------------------------------------------------------------
	actionComplete(args: DialogEditEventArgs) {
		args.dialog.allowDragging = false;
		args.dialog.overlayClick = args.dialog.close;
		args.dialog.showCloseIcon = false;
		args.dialog.width = 300;
		if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
			if (Browser.isDevice) {
				args.dialog.height = window.innerHeight - 90 + 'px';
				(<Dialog>args.dialog).dataBind();
			}
		}
	}
	//------------------------------------------------------------------------------------------------------------------------
	toggleActiveDialog() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Toggle Customer',
			content: `Are you sure you want to <b>${this.activeToggleText}</b> the customer <b>${this.record.name}</b>?`,
			okButton: { click: this.toggleActive.bind(this) }
		});
	}
	//------------------------------------------------------------------------------------------------------------------------
	async toggleActive() {
		this.showSpinner();
		this.deleteDialog.close();
		this.record.active = !this.record.active;
		this.record.tenantId = this.appService.tenantId;
		const returnValue = await this.repository.save(this.record);
		this.hideSpinner();

		if (returnValue.error) {
			this.showErrorMessage(returnValue.description);
		} else {
			const success = returnValue && returnValue.updated;
			this.showSuccessMessage("Record state saved!");

			if (success) {
				this.record = returnValue;
				this.activeToggleText = this.record.active ? "Deactivate" : "Activate";
				this.status = this.record.active ? "Active" : "Inactive";
			}
		}
	}
	//------------------------------------------------------------------------------------------------------------------------
	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete Customer',
			content: `Are you sure you want to delete the customer <b>${this.record.name}</b>?`,
			okButton: { click: this.deleteOK.bind(this) }
		});
	}
	//------------------------------------------------------------------------------------------------------------------------
	async deleteOK() {
		this.showSpinner();
		this.deleteDialog.close();
		var result = await this.repository.delete(this.record.id);
		this.hideSpinner();

		if (result.error) {
			this.showErrorMessage(result.description);
		}
		else {
			this.showDeleteMessage(true);
			setTimeout(() => this.router.navigate(['/auth/customer/list']), 1000);
		}
	}
}
