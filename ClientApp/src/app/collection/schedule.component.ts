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
import { validateEndDate } from '../shared/validators';

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
	public logisticVendors: any;
	public labVendors: any;
	public customers: any;
	public sites: any;
	public locations: any;
	public location: any;
	public data: any;
	public container: any = {};
	public analytes: any;
	public testTypes: any;
	public showContainer: boolean;
	@ViewChild('grid') public grid: GridComponent;
	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.samples;
		this.data = await this.repository.getScheduleData();
		this.logisticVendors = await this.repository.listVendors({ tenantId: this.tenant.id, vendorTypeId: 3 });
		this.labVendors = await this.repository.listVendors({ tenantId: this.tenant.id, vendorTypeId: 2 });
		this.customers = await this.repository.listCustomers();
		this.testTypes = await this.repository.listTestTypes({ tenantId: this.tenant.id });
		this.analytes = await this.repository.listAnalytes({ tenantId: this.tenant.id });
		this.hideSpinner();
		this.resetRecord();

		this.form = new FormGroup({
			startDate: new FormControl(null),
			endDate: new FormControl(null),
			logisticVendorId: new FormControl(null, [Validators.required]),
			frequencyId: new FormControl(this.record.frequencyId, [Validators.required])
		}, { validators: validateEndDate });

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
					this.resetForm();
				}
				else {
					this.showErrorMessage('Error occurred!');
				}
			}
		}
	}
	//-----------------------------------------------------------------------------------------
	resetRecord() {
		this.record = {
			'days': {},
			containers: []
		};
	}
	//-----------------------------------------------------------------------------------------
	resetForm() {
		this.sites = null;
		this.locations = null;
		this.showContainer = false;
		this.resetRecord();

		this.form.get('customerId').setValue(null);
		this.form.get('siteId').setValue(null);
		this.form.get('locationId').setValue(null);
		this.form.get('frequencyId').setValue(null);
		this.form.get('startDate').setValue(null);
		this.form.get('endDate').setValue(null);
		this.form.markAsUntouched();
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
		this.resetContainer();
	}
	//-----------------------------------------------------------------------------------------
	frequencyChange() {
		this.showContainer = true;
	}
	//-----------------------------------------------------------------------------------------
	resetContainer() {
		this.container = {
			labVendorId: this.location.labVendorId,
			testTypes: []
		};
	}
	//-----------------------------------------------------------------------------------------
	addContainer() {
		this.record.containers.push({
			containerType: this.container.containerType,
			expectedVolume: this.container.expectedVolume,
			samples: this.container.samples,
			labVendorId: this.container.labVendorId,
			labVendor: this.labVendors.find(x => x.id == this.container.labVendorId)?.name,
			testTypes: this.container.testTypes,
			testTypeNames: this.container.testTypeNames
		});

		this.resetContainer();
		if (this.grid) this.grid.refresh();
	}
	//-----------------------------------------------------------------------------------------
	deleteContainer(data) {
		this.record.containers.splice(data.index, 1);
		this.grid.refresh();
	}
	//-----------------------------------------------------------------------------------------
	changeTestType(e) {
		this.analytes = this.data.analytes[e.value];
		this.container.analytes = null;
	}
	//-----------------------------------------------------------------------------------------
	addTestType() {
		this.container.testTypes.push({
			testType: this.container.testType,
			analytes: this.container.analytes,
			analyteNames: this.container.analytes.join(', ')
		});

		this.container.analytes = null;
		this.container.testType = null;
		this.container.testTypeNames = this.container.testTypes.map(x => `${x.testType}: ${x.analytes.join(', ')}`).join('; ');
	}
}
