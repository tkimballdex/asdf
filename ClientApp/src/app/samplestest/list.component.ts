import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column } from '@syncfusion/ej2-angular-grids';
import { SampleTestRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { AppService } from "../shared/app.service";
import { GridFormParams, FormState } from '../shared/formState';

@Component({
    selector: 'sampletest-list',
    templateUrl: './list.component.html',
})
export class SampleTestListComponent extends PageComponent implements OnInit {

	constructor(private repository: SampleTestRepository,private appService: AppService, private tenant: TenantService, private formState: FormState) {
        super();
    }
    //------------------------------------------------------------------------------------------------------------------------
    public list: any;
    public searchTxt: any;
    public customers: any;
    public dateFormat: any;
    public form: FormParams;
    @ViewChild('grid') public grid: GridComponent;
    //------------------------------------------------------------------------------------------------------------------------
    async ngOnInit() {
        this.privileges = (await this.appService.getPrivileges()).tests;
        this.dateFormat = {type:'date', format:'MM/dd/yyyy'};
        this.formState.setup(this, new FormParams());

        this.customers = await this.repository.listCustomers();
		this.customers.unshift({ id: this.appService.GuidEmpty, name: "All" });

        if (this.tenant.id) {
            this.search();
        }
    }
    //------------------------------------------------------------------------------------------------------------------------
    async search() {
        this.appService.saveFormState(this);
        this.showSpinner();
        this.list = await this.repository.list({ tenantId: this.tenant.id, searchTxt: this.form.searchTxt, customerId: this.form.customerId });
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
            fileName: 'sample-tests.xlsx'
        };
        this.grid.excelExport(excelExportProperties);

        this.hideSpinner();
	}
    //------------------------------------------------------------------------------------------------------------------------
	async sendNotifications() {
		this.loadStart();
		var result = await this.repository.sendAlertsAndNotifications();
		this.loadEnd();
		this.showSuccessMessage(`${result.siteNotifications} site notifications, ${result.siteAlerts} site alerts, ${result.customerNotifications} customer notifications, and ${result.customerAlerts} customer alerts have been sent!`);
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
		this.searchTxt = "";
		this.customerId = "00000000-0000-0000-0000-000000000000";
	}

	public tenantId: string;
    public searchTxt: string;
	public customerId: string;
}
///////////////////////////////////////////////////////////////////////////////////
