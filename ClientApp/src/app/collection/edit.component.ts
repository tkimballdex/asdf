import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { CollectionRepository } from './repository';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TenantService } from '../shared/tenant.service';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';

@Component({
	selector: 'collection-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class CollectionEditComponent extends PageComponent implements OnInit {
	constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: CollectionRepository) {
		super();
	}

	public form: FormGroup;
	public id: any;
	public record: any;
	public deleteDialog: Dialog;
	public tests: any;

	public vendors: any;
	public customers: any;
	public sites: any;
	public locations: any;
	public data: any;
	public statusName: string;
	public collectionCompleteBool: boolean = false;
	public collectionSuccessfulBool: any;

	@ViewChild('editTab') public editTab: TabComponent;
	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.samples;
		this.data = await this.repository.getData();

		this.id = this.route.snapshot.paramMap.get('id');
		this.record = await this.repository.get(this.id);
		this.vendors = await this.repository.listVendors({ tenantId: this.tenant.id, vendorTypeId: 3, active: 1 });

		if (this.id) {
			this.tests = await this.repository.getTests(this.id);
			this.customers = await this.repository.listCustomers();
			this.record.customerId = this.customers.find(e => e.name === this.record.customer).id;
			this.statusName = this.data.statuses.find(m => m.id === this.record.collectionStatusId).name;
			this.sites = await this.repository.listSites(this.record.customerId);
			this.locations = await this.repository.listLocations(this.record.siteId);
		} else {
			this.customers = await this.repository.listCustomers();
			this.record.collectionStatusId = 1;
		}

		if (this.record.completedDate) {
			this.collectionCompleteBool = true;
		}

		if (this.record.failureReasonId) {
			this.record.collectionStatusId = 3;
		}

		if (this.record.collectionStatusId === 1) {
			this.collectionSuccessfulBool = null
		} else {
			this.collectionSuccessfulBool = this.record.collectionStatusId;
		}

		this.hideSpinner();

		this.record.completedDate = this.record.completedDate ? new Date(this.record.completedDate) : null;

		this.form = new FormGroup({
			collectionCompleted: new FormControl(this.collectionCompleteBool),
			collectionSuccessful: new FormControl(this.collectionSuccessfulBool),
			scheduledDate: new FormControl(this.record.scheduledDate ? new Date(this.record.scheduledDate) : null),
			vendorId: new FormControl(this.record.vendorId, [Validators.required]),
			completedDate: new FormControl(this.record.completedDate),
			failureReasonId: new FormControl(this.record.failureReasonId),
			customerId: new FormControl(this.record.customerId, [Validators.required]),
			siteId: new FormControl(this.record.siteId, [Validators.required]),
			locationId: new FormControl(this.record.locationId, [Validators.required]),
		});

		this.form.get('collectionCompleted').valueChanges.subscribe(value => {
			if (value === true) {
				this.form.get('completedDate').setValidators([Validators.required]);
				this.form.get('collectionSuccessful').setValidators([Validators.required]);
			} else if (value === false) {
				this.form.get('completedDate').setValidators(null);
				this.form.get('collectionSuccessful').setValidators(null);
			}
			this.form.get('completedDate').updateValueAndValidity();
			this.form.get('collectionSuccessful').updateValueAndValidity();
		});

		this.form.get('collectionSuccessful').valueChanges.subscribe(value => {
			if (value === 2) {
				this.form.get('failureReasonId').setValidators(null);
			} else if (value === 3) {
				this.form.get('failureReasonId').setValidators([Validators.required]);
			}
			this.form.get('failureReasonId').updateValueAndValidity();
		});
	}
	//-----------------------------------------------------------------------------------------
	gridAction(e) {
		if (e.name == 'actionComplete' && e.requestType == 'save') {
			console.dir(e);
			var data = {
				collectionId: this.record.id,
				id: e.data.id,
				containerNo: e.data.containerNo,
				container: e.data.container,
				volume: parseInt(e.data.volume)
			};

			this.repository.saveContainer(data);
		}
	}
	//-----------------------------------------------------------------------------------------
	editTabCreated() {
		if (history.state.containers) {
			this.editTab.selectedItem = 1;
		}
	}
	//-----------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!")
		}
		else {
			Object.assign(this.record, this.form.value);

			var add = !this.record.id;
			this.record.tenantId = this.tenant.id;

			if (this.form.get('collectionCompleted').value === false) {
				this.record.completedDate = null;
				this.record.failureReasonId = null;
				this.record.flowRate = null;
				this.record.humidity = null;
				this.record.temperature = null;
				this.record.completedBy = null;
				this.record.collectionStatusId = 1;
			} else if (this.form.get('collectionSuccessful').value === 2) {
				this.record.failureReasonId = null;
				this.record.collectionStatusId = 2;
			} else if (this.form.get('collectionSuccessful').value === 3) {
				this.record.flowRate = null;
				this.record.humidity = null;
				this.record.temperature = null;
				this.record.collectionStatusId = 3;
			}
			
			this.record.collectionSuccessful = null;
			this.statusName = this.data.statuses.find(m => m.id === this.record.collectionStatusId).name;
			this.showSpinner();
			var returnValue = await this.repository.save(this.record);
			this.hideSpinner();

			if (returnValue && returnValue.error) {
				this.showErrorMessage(returnValue.description);
			}
			else {
				var success = returnValue && returnValue.updated;
				this.showSaveMessage(success);

				if (success && add) {
					setTimeout(() => this.router.navigate(['/auth/collection/edit', returnValue.id]), 1000);
				}
			}
		}
	}
	//-----------------------------------------------------------------------------------------
	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete Collection',
			content: `Are you sure you want to delete the Collection <b>${this.record.collectionNo}</b>?`,
			okButton: { click: this.deleteOK.bind(this) }
		});
	}
	//-----------------------------------------------------------------------------------------
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
			setTimeout(() => this.router.navigate(['/auth/collection/list']), 1000);
		}
	}
	//-----------------------------------------------------------------------------------------
	async customerChange(e) {
		this.sites = [];
		this.form.get('siteId').setValue(null);
		this.form.get('locationId').setValue(null);
		this.locations = null;
		this.sites = await this.repository.listSites(e.itemData.id);
	}
	//-----------------------------------------------------------------------------------------
	async siteChange(e) {
		this.locations = null;
		this.form.get('locationId').setValue(null);
		this.locations = await this.repository.listLocations(e.itemData.id);
	}
	//-----------------------------------------------------------------------------------------
}
