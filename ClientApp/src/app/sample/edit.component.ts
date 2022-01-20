import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { SampleRepository } from './repository';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TenantService } from '../shared/tenant.service';

@Component({
	selector: 'sample-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class SampleEditComponent extends PageComponent implements OnInit {
	constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: SampleRepository) {
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
	public collections: any;
	public failureReasons: any;

	@ViewChild('editTab')
	public editTab: TabComponent;

	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.samples;
		this.vendors = await this.repository.listVendors();

		this.failureReasons = this.app.sampleFailureReasons.slice();
		this.failureReasons.unshift({ id: 0, name: '' });

		var id = this.route.snapshot.paramMap.get('id');

		if (id) {
			this.record = await this.repository.get(id);
			this.tests = await this.repository.getTests(id);
		}
		else {
			var collection = await this.repository.getCollection(this.route.snapshot.queryParamMap.get('collectionId'));

			this.record = {
				site: collection.site,
				location: collection.location,
				locationId: collection.locationId,
				collectionId: collection.id
			};
		}

		this.hideSpinner();

		this.record.collectedDate = this.record.completedDate ? new Date(this.record.collectedDate) : null;
		this.record.shippedDate = this.record.shippedDate ? new Date(this.record.shippedDate) : null;
		this.record.receivedDate = this.record.receivedDate ? new Date(this.record.receivedDate) : null;

		this.form = new FormGroup({
			sampleNo: new FormControl(this.record.sampleNo),
			vendorId: new FormControl(this.record.vendorId, [Validators.required])
		});
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

	async customerChange() {
		this.sites = [];
		this.siteId = null;
		this.locations = null;
		this.record.locationId = null;
		this.sites = await this.repository.listSites(this.form.get('customerId').value);
	}

	async siteChange() {
		this.locations = null;
		this.record.locationId = null;
		this.locations = await this.repository.listLocations(this.siteId);
	}

	async locationChange() {
		this.collections = null;
		this.record.collectionId = null;
		this.collections = await this.repository.listCollections(this.form.get('locationId').value);
	}

	async collectionChange() {
	}
	//-----------------------------------------------------------------------------------------
}
