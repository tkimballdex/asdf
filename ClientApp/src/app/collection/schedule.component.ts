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
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';

@Component({
	selector: 'schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss']
})
export class CollectionScheduleComponent extends PageComponent implements OnInit {
	constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: CollectionRepository) {
		super();
	}

	public form: FormGroup;
	public record: any;
	public vendors: any;
	public customers: any;
	public sites: any;
	public locations: any;
	public location: any;
	public data: any;
	@ViewChild('grid') public grid: GridComponent;
	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.samples;
		this.data = await this.repository.getData();
		this.vendors = await this.repository.listVendors();
		this.customers = await this.repository.listCustomers();
		this.hideSpinner();

		this.record = {
			'days': {},
			containers: []
		};

		this.form = new FormGroup({
			startDate: new FormControl(null),
			endDate: new FormControl(null),
			logisticVendorId: new FormControl(null, [Validators.required]),
			frequencyId: new FormControl(this.record.frequencyId, [Validators.required])
		});

		this.form.addControl('customerId', new FormControl('', [Validators.required]));
		this.form.addControl('siteId', new FormControl('', [Validators.required]));
		this.form.addControl('locationId', new FormControl('', [Validators.required]));
	}
	//-----------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!")
		}
		else {
			Object.assign(this.record, this.form.value);

			this.record.tenantId = this.tenant.id;
			console.dir(this.record);
			return;

			this.showSpinner();
			var returnValue = await this.repository.save(this.record);
			this.hideSpinner();

			if (returnValue && returnValue.error) {
				this.showErrorMessage(returnValue.description);
			}
			else {
				var success = returnValue && returnValue.updated;
				this.showSaveMessage(success);
				setTimeout(() => this.router.navigate(['/auth/collection/list']), 1000);
			}
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
	async locationChange(e) {
		this.form.get('logisticVendorId').setValue(e.itemData.logisticVendorId);
		this.location = e.itemData;
		this.record.labVendorId = this.location.labVendorId;
	}
	//-----------------------------------------------------------------------------------------
	addContainer() {
		console.dir(this.vendors);
		console.dir(this.record);

		this.record.containers.push({
			containerType: this.record.containerType,
			expectedVolume: this.record.expectedVolume,
			samples: this.record.samples,
			labVendorId: this.record.labVendorId,
			labVendor: this.vendors.find(x => x.id == this.record.labVendorId).name
		});

		this.record.containerType = null;
		this.record.expectedVolume = null;
		this.record.samples = null;

		if (this.grid) this.grid.refresh();
	}
	//-----------------------------------------------------------------------------------------
	deleteContainer(data) {
		console.dir(data);
		this.record.containers.splice(data.index, 1);
		this.grid.refresh();
	}
	//-----------------------------------------------------------------------------------------
}
