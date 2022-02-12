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
	public container: any = {};
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
			this.showSpinner();

			try {
				var returnValue = await this.repository.saveSchedule(this.record);
			}
			finally {
				this.hideSpinner();
			}

			if (returnValue && returnValue.error) {
				this.showErrorMessage(returnValue.description);
			}
			else {
				var success = returnValue && returnValue.updated;

				if (success) {
					this.showSuccessMessage(`Created ${returnValue.collections} collections, ${returnValue.samples} samples and ${returnValue.tests} tests!`);
				}
				else {
					this.showErrorMessage('Error occurred!');
				}
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
		this.container.labVendorId = this.location.labVendorId;
	}
	//-----------------------------------------------------------------------------------------
	addContainer() {
		console.dir(this.container);

		this.record.containers.push({
			containerType: this.container.containerType,
			expectedVolume: this.container.expectedVolume,
			analytes: this.container.analytes,
			analyteNames: this.container.analytes.join(', '),
			testType: this.container.testType,
			samples: this.container.samples,
			labVendorId: this.container.labVendorId,
			labVendor: this.vendors.find(x => x.id == this.container.labVendorId).name
		});

		this.container.containerType = null;
		this.container.expectedVolume = null;
		this.container.samples = null;
		this.container.analytes = null;

		if (this.grid) this.grid.refresh();
	}
	//-----------------------------------------------------------------------------------------
	deleteContainer(data) {
		this.record.containers.splice(data.index, 1);
		this.grid.refresh();
	}
	//-----------------------------------------------------------------------------------------
}
