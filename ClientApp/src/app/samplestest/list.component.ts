import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column } from '@syncfusion/ej2-angular-grids';
import { SampleTestRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';

@Component({
    selector: 'sampletest-list',
    templateUrl: './list.component.html',
})
export class SampleTestListComponent extends PageComponent implements OnInit {

	constructor(private repository: SampleTestRepository, private tenant: TenantService) {
        super();
    }
    //------------------------------------------------------------------------------------------------------------------------
    public list: any;
    public name: any;
    public dateFormat: any;
    @ViewChild('grid') public grid: GridComponent;
    //------------------------------------------------------------------------------------------------------------------------
    async ngOnInit() {
        this.dateFormat = {type:'date', format:'MM/dd/yyyy'};

        if (this.tenant.id) {
            this.search();
        }
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
            fileName: 'sample-tests.xlsx'
        };
        this.grid.excelExport(excelExportProperties);

        this.hideSpinner();
	}

	async sendNotifications() {
		this.loadStart();
		var notifications = await this.repository.sendNotifications();
		this.loadEnd();
		this.showSuccessMessage(`${notifications} notifications have been sent!`);
	}
    //------------------------------------------------------------------------------------------------------------------------
    excelExportComplete(): void {
        (this.grid.columns[0] as Column).visible = true;
    }
    //------------------------------------------------------------------------------------------------------------------------
}
