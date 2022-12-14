import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { SampleRepository } from './repository';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TenantService } from '../shared/tenant.service';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';

@Component({
	selector: 'sample-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class SampleEditComponent extends PageComponent implements OnInit {
	constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: SampleRepository, private location: Location) {
		super();
	}

	public form: FormGroup;
	public id: any;
	public record: any;
	public data: any;
	public deleteDialog: Dialog;
	public tests: any;
	public statusName: string;

	public labVendors: any;
	public customers: any;
	public customerId: string;
	public sites: any;
	public siteId: string;
	public locations: any;
	public collection: any;
	public collections: any;
	public sampleSuccessfulBool: boolean = null;

	@ViewChild('editTab') public editTab: TabComponent;
	@ViewChild('CompletedDate') public CompletedDate;
	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.samples;
		this.data = await this.repository.getData();
		this.labVendors = await this.repository.listVendors({ tenantId: this.tenant.id, vendorTypeId: 2, active: 1 });

		this.id = this.route.snapshot.paramMap.get('id');

		if (this.id) {
			this.record = await this.repository.get(this.id);
			this.tests = await this.repository.getTests(this.id);
			this.collection = await this.repository.getCollection(this.record.collectionId);
			this.statusName = this.data.statuses.find(m => m.id === this.record.sampleStatusId).name;
			if (this.record.failureReasonId) {
				this.sampleSuccessfulBool = false;
			} else if (this.record.volume > 0) {
				this.sampleSuccessfulBool = true;
			} else {
				this.sampleSuccessfulBool = null;
			}
		} else {
			this.collection = await this.repository.getCollection(this.route.snapshot.queryParamMap.get('collectionId'));
			this.record = {
				site: this.collection.site,
				location: this.collection.location,
				locationId: this.collection.locationId,
				collectionId: this.collection.id
			};
			this.record.containerNo = history.state.containerNo
		}

		this.hideSpinner();

		this.collection.scheduledDate = this.collection.scheduledDate ? new Date(this.collection.scheduledDate) : null;
		this.record.completedDate = this.record.completedDate ? new Date(this.record.completedDate) : null;
		this.record.shippedDate = this.record.shippedDate ? new Date(this.record.shippedDate) : null;
		this.record.receivedDate = this.record.receivedDate ? new Date(this.record.receivedDate) : null;
		this.record.deliveryDate = this.record.deliveryDate ? new Date(this.record.deliveryDate) : null;

		this.form = new FormGroup({
			sampleNo: new FormControl(this.record.sampleNo, [Validators.required]),
			referenceNo: new FormControl(this.record.referenceNo, [Validators.required]),
			failureReasonId: new FormControl(this.record.failureReasonId),
			sampleSuccessful: new FormControl(this.sampleSuccessfulBool),
			vendorId: new FormControl(this.record.vendorId, [Validators.required]),
			volume: new FormControl(this.record.volume),
			completedDate: new FormControl(this.record.completedDate),
		});

		this.form.get('sampleSuccessful').valueChanges.subscribe(value => {
			if (value === true) {
				this.form.get('volume').setValidators([Validators.required]);
				this.form.get('completedDate').setValidators([Validators.required]);
				this.form.get('failureReasonId').setValidators(null);
			} else if (value === false) {
				this.form.get('failureReasonId').setValidators([Validators.required]);
				this.form.get('volume').setValidators(null);
				this.form.get('completedDate').setValidators(null);
			} else if (value === null) {
				this.form.get('failureReasonId').setValidators(null);
				this.form.get('volume').setValidators(null);
				this.form.get('completedDate').setValidators(null);
			}
			this.form.get('volume').updateValueAndValidity();
			this.form.get('completedDate').updateValueAndValidity();
			this.form.get('failureReasonId').updateValueAndValidity();
		});
	}
	//-----------------------------------------------------------------------------------------
	editTabCreated() {
		if (history.state.tests) {
			this.editTab.selectedItem = 1;
		}
	}
	//-----------------------------------------------------------------------------------------
	back(): void {
		this.location.back()
	}
	//-----------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();
		if (this.form.get('volume').value === 0) {
			this.form.get('volume').setValue(null)
		}

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!")
		} else {
			Object.assign(this.record, this.form.value);

			var add = !this.record.id;
			this.record.tenantId = this.tenant.id;

			if (this.form.get('sampleSuccessful').value === true) {
				this.record.failureReasonId = null;
				this.record.sampleStatusId = 2;
			} else if (this.form.get('sampleSuccessful').value === false) {
				this.record.volume = 0;
				this.record.completedDate = null;
				this.record.sampleStatusId = 3;
			} else if (this.form.get('sampleSuccessful').value === null) {
				this.record.failureReasonId = null;
				this.record.volume = 0;
				this.record.completedDate = null;
				this.record.sampleStatusId = 1;
			}
			this.statusName = this.data.statuses.find(m => m.id === this.record.sampleStatusId).name;

			this.showSpinner();
			var returnValue = await this.repository.save(this.record);
			this.hideSpinner();

			if (returnValue && returnValue.error) {
				this.showErrorMessage(returnValue.description);
			} else {
				var success = returnValue && returnValue.updated;
				this.showSaveMessage(success);

				if (success && add) {
					setTimeout(() => this.router.navigate(['/auth/sample/edit', returnValue.id]), 1000);
				}
			}
		}
		
		if (this.record.failureReasonId) {
			this.sampleSuccessfulBool = false;
		} else if (this.record.volume > 0) {
			this.sampleSuccessfulBool = true;
		} else {
			this.sampleSuccessfulBool = null;
		}
	}
	//-----------------------------------------------------------------------------------------
	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete Vendor',
			content: `Are you sure you want to delete the sample <b>${this.record.sampleNo}</b>?`,
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
			setTimeout(() => this.router.navigate(['/auth/sample/list']), 1000);
		}
	}
	//-----------------------------------------------------------------------------------------
	async customerChange() {
		this.sites = [];
		this.siteId = null;
		this.locations = null;
		this.record.locationId = null;
		this.sites = await this.repository.listSites(this.form.get('customerId').value);
	}
	//-----------------------------------------------------------------------------------------
	async siteChange() {
		this.locations = null;
		this.record.locationId = null;
		this.locations = await this.repository.listLocations(this.siteId);
	}
	//-----------------------------------------------------------------------------------------
	async locationChange() {
		this.collections = null;
		this.record.collectionId = null;
		this.collections = await this.repository.listCollections(this.form.get('locationId').value);
	}
	//-----------------------------------------------------------------------------------------
	async collectionChange() {
	}
	//-----------------------------------------------------------------------------------------
}
