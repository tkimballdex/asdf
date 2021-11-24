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

	constructor(private repository: VendorRepository, private appService: AppService, private tenant: TenantService) {
        super();
    }
    //------------------------------------------------------------------------------------------------------------------------
    public list: any;
    public name: any;
    @ViewChild('grid') public grid: GridComponent;
    //------------------------------------------------------------------------------------------------------------------------
	async ngOnInit() {
        this.privileges = (await this.appService.getPrivileges()).vendors;
		await this.tenant.validate();
		this.search();
	}
    //------------------------------------------------------------------------------------------------------------------------
    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenantId: this.tenant.id, name: this.name });
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
