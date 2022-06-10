import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column } from '@syncfusion/ej2-angular-grids';
import { VendorRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { AppService } from '../shared/app.service';

@Component({
    selector: 'vendors-list',
    templateUrl: './list.component.html',
})
export class VendorListComponent extends PageComponent implements OnInit {

	constructor(private repository: VendorRepository, public appService: AppService, private tenant: TenantService) {
        super();
    }
    //------------------------------------------------------------------------------------------------------------------------
    public list: any;
    public searchTxt: any;
    public states: any = null;
    public stateId: number = 0;
    public vendors: any = null;
    public vendorTypeId: number = 0;
    public active: number = 1;
    @ViewChild('grid') public grid: GridComponent;
    //------------------------------------------------------------------------------------------------------------------------
	async ngOnInit() {
        this.privileges = (await this.appService.getPrivileges()).vendors;
        this.app = await this.appService.getData();
		await this.tenant.validate();

        if (this.states === null) {
			this.states = this.app.states.slice();
			this.states.unshift({ id: 0, name: 'All' });
		}

        if (this.vendors === null) {
            this.vendors = this.app.vendortypes.slice();
			this.vendors.unshift({ id: 0, name: 'All' });
        } 



		this.search();
	}
    //------------------------------------------------------------------------------------------------------------------------
    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenantId: this.tenant.id, searchTxt: this.searchTxt, stateId: this.stateId, vendorTypeId: this.vendorTypeId, active: this.active });
        this.hideSpinner();
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
