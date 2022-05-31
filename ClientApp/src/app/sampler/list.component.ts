import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column } from '@syncfusion/ej2-angular-grids';
import { SamplerRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { GridFormParams, FormState } from '../shared/formState';
import { AppService } from '../shared/app.service';

@Component({
    selector: 'sampler-list',
    templateUrl: './list.component.html',
})
export class SamplerListComponent extends PageComponent implements OnInit {

	constructor(private repository: SamplerRepository, private appService: AppService,private tenant: TenantService, private formState: FormState) {
        super();
    }
    //------------------------------------------------------------------------------------------------------------------------
	public form: FormParams;
    public list: any;
    public dateFormat: any;
    public customers: any = null;
    @ViewChild('grid') public grid: GridComponent;
    //------------------------------------------------------------------------------------------------------------------------
    async ngOnInit() {
        this.privileges = (await this.appService.getPrivileges()).samplers;
		await this.tenant.validate();
        this.dateFormat = {type:'date', format:'MM/dd/yyyy'};

        if (this.customers === null) {
			this.customers = await this.repository.listCustomers({
				tenantId: this.tenant.id,
			});
			this.customers.unshift({ id: this.appService.GuidEmpty, name: "All" });
		}

		this.formState.setup(this, new FormParams());
        this.search();
    }
    //------------------------------------------------------------------------------------------------------------------------
    async search() {
		this.formState.save(this);
        this.showSpinner();
        this.list = await this.repository.list({ 
            tenantId: this.tenant.id, 
            searchTxt: this.form.searchTxt, 
            customerId: this.form.customerId
        });
        this.hideSpinner();
    }
	//----------------------------------------------------------------------------
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
            fileName: 'vendors.xlsx'
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

class FormParams extends GridFormParams {
	searchTxt: string;
    customerId: string = "00000000-0000-0000-0000-000000000000";
}
