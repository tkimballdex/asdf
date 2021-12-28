import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { CollectionRepository } from './repository';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TenantService } from '../shared/tenant.service';

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
	public customerId: string;
	public sites: any;
	public siteId: string;
	public locations: any;

	@ViewChild('editTab')
	public editTab: TabComponent;

	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.samples;
		var id = this.route.snapshot.paramMap.get('id');
		this.record = await this.repository.get(id);
		this.vendors = await this.repository.listVendors();

		if (id) {
			this.tests = await this.repository.getTests(id);
		}
		else {
			this.customers = await this.repository.listCustomers();
		}

		this.hideSpinner();

		this.record.collectedDate = this.record.completedDate ? new Date(this.record.collectedDate) : null;
		this.record.shippedDate = this.record.shippedDate ? new Date(this.record.shippedDate) : null;
		this.record.receivedDate = this.record.receivedDate ? new Date(this.record.receivedDate) : null;

		this.form = new FormGroup({
			referenceNo: new FormControl(this.record.referenceNo, [Validators.required]),
			scheduledDate: new FormControl(this.record.scheduledDate ? new Date(this.record.scheduledDate) : null),
			qcpass: new FormControl(this.record.qcpass),
			vendorId: new FormControl(this.record.vendorId, [Validators.required])
		});

		if (!id) {
			this.form.addControl('customerId', new FormControl(this.customerId, [Validators.required]));
			this.form.addControl('siteId', new FormControl(this.siteId, [Validators.required]));
			this.form.addControl('locationId', new FormControl(this.record.locationId, [Validators.required]));
		}
	}

	editTabCreated() {
		if (history.state.tests) {
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
					setTimeout(() => this.router.navigate(['/auth/sample/edit', returnValue.id]), 1000);
				}
			}
		}
	}
	//-----------------------------------------------------------------------------------------
	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete Vendor',
			content: `Are you sure you want to delete the vendor <b>${this.record.name}</b>?`,
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
		this.sites = await this.repository.listSites(this.customerId);
	}
	//-----------------------------------------------------------------------------------------
	async siteChange() {
		this.locations = null;
		this.record.locationId = null;
		this.locations = await this.repository.listLocations(this.siteId);
	}
	//-----------------------------------------------------------------------------------------
}
