import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { CollectionRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { AppService } from '../shared/app.service';
import { GridFormParams, FormState } from '../shared/formState';

@Component({
	selector: 'collection-list',
	templateUrl: './list.component.html',
})
export class CollectionListComponent extends PageComponent implements OnInit {

	constructor(private repository: CollectionRepository, private tenant: TenantService, private appService: AppService, private formState: FormState) {
		super();
	}
	//------------------------------------------------------------------------------------------------------------------------
	public list: any;
	public name: any;
	public dateFormat: any;
	public form: FormParams;
	public statuses: any;
	public customers: any;
	public someId: number;
	@ViewChild('grid') public grid: GridComponent;
	@ViewChild('ScheduledDate') public ScheduledDate;
	//------------------------------------------------------------------------------------------------------------------------
	async ngOnInit() {
		this.app = await this.appService.getData();
		this.privileges = (await this.appService.getPrivileges()).samples;
		this.dateFormat = { type: 'date', format: 'MM/dd/yyyy' };
		this.formState.setup(this, new FormParams());

		this.customers = await this.repository.listCustomers();
		this.customers.unshift({ id: this.appService.GuidEmpty, name: "All" });

		this.statuses = this.app.collectionStatuses.slice();
		this.statuses.unshift({ id: 0, name: 'All' });		

		this.search();
	}
	//------------------------------------------------------------------------------------------------------------------------
	async search() {
		this.appService.saveFormState(this);
		this.showSpinner();
		this.list = await this.repository.list({
			tenantId: this.tenant.id,
			collectionNo: this.form.collectionNo,
			scheduledDate: this.form.scheduledDate,
			customerId: this.form.customerId,
			collectionStatusId: this.form.collectionStatusId
		});
		this.hideSpinner();
	}
	//------------------------------------------------------------------------------------------------------------------------
	gridActionHandler(e) {
		this.form.gridAction(this.grid, e);
		this.formState.save(this);
	}
	//------------------------------------------------------------------------------------------------------------------------
	async export() {
		this.showSpinner();

		(this.grid.columns[0] as Column).visible = false;
		const excelExportProperties: ExcelExportProperties = {
			includeHiddenColumn: true,
			fileName: 'collections.xlsx'
		};
		this.grid.excelExport(excelExportProperties);

		this.hideSpinner();
	}
	//------------------------------------------------------------------------------------------------------------------------
	excelExportComplete(): void {
		(this.grid.columns[0] as Column).visible = true;
	}
	//------------------------------------------------------------------------------------------------------------------------
}
///////////////////////////////////////////////////////////////////////////////////
class FormParams extends GridFormParams {
	constructor() {
		super();
		this.collectionNo = "";
		this.customerId = "00000000-0000-0000-0000-000000000000";
		this.collectionStatusId = 0;

		var today = new Date();
		this.scheduledDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	}

	public tenantId: string;
    public collectionNo: string;
	public scheduledDate: Date;
	public customerId: string;
	public collectionStatusId: number;
}
///////////////////////////////////////////////////////////////////////////////////
