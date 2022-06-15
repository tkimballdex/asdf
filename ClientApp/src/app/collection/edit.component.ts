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
	public record: any;
	public deleteDialog: Dialog;
	public tests: any;

	public vendors: any;
	public customers: any;
	public sites: any;
	public locations: any;
	public data: any;
	public collectionRadio: any;

	@ViewChild('editTab') public editTab: TabComponent;
	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.samples;
		this.data = await this.repository.getData();

		var id = this.route.snapshot.paramMap.get('id');
		this.record = await this.repository.get(id);
		this.vendors = await this.repository.listVendors({ tenantId: this.tenant.id, vendorTypeId: 3 });

		if (id) {
			this.tests = await this.repository.getTests(id);
		}
		else {
			this.customers = await this.repository.listCustomers();
			this.record.collectionStatusId = 1;
			this.collectionRadio = 1;
		}

		this.hideSpinner();

		this.record.collectedDate = this.record.collectedDate ? new Date(this.record.collectedDate) : null;

		this.form = new FormGroup({
			collectionSuccessful: new FormControl(this.collectionRadio),
			collectionNo: new FormControl(this.record.collectionNo),
			scheduledDate: new FormControl(this.record.scheduledDate ? new Date(this.record.scheduledDate) : null),
			collectionStatusId: new FormControl(this.record.collectionStatusId, [Validators.required]),
			vendorId: new FormControl(this.record.vendorId, [Validators.required]),
			completedDate: new FormControl(this.record.collectedDate),
			failureReasonId: new FormControl(this.record.failureReasonId)
		});

		if (!id) {
			this.form.addControl('customerId', new FormControl('', [Validators.required]));
			this.form.addControl('siteId', new FormControl('', [Validators.required]));
			this.form.addControl('locationId', new FormControl('', [Validators.required]));
		}

		// this.form.get('collectionStatusId').valueChanges.subscribe(value => {
		// 	if (value === 1) {
		// 		this.form.get('collectedDate').disable();
		// 		this.form.get('failureReasonId').disable();
		// 	}
		// 	this.form.updateValueAndValidity();
		// });

		// this.form.get('collectionSuccessful').valueChanges.subscribe(value => {
		// 	if (value === true) {
		// 		this.form.get('collectedDate').enable();
		// 		this.form.get('failureReasonId').disable();
		// 	} else if (value === false) {
		// 		this.form.get('failureReasonId').enable();
		// 		this.form.get('collectedDate').disable();
		// 	}
		// 	this.form.updateValueAndValidity();
		// });
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
	setSucessStatus() {
		this.record.failureReasonId = null;
	}
	//-----------------------------------------------------------------------------------------
	setFailureStatus() {
		this.record.collectedDate = null;
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

			if (this.form.get('collectionSuccessful').value) {
				this.record.failureReasonId = null;
			}

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
