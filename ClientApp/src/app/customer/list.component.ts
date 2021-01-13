import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column } from '@syncfusion/ej2-angular-grids';
import { CustomerRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';

@Component({
    selector: 'customer-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class CustomerListComponent extends PageComponent implements OnInit {
    constructor(private repository: CustomerRepository, private router: Router, private appRepository: AppRepository) {
        super();
    }
    //------------------------------------------------------------------------------------------------------------------------
    public list: any;
    public tenant: any;
    public name: any;
    @ViewChild('grid', null) public grid: GridComponent;
    //------------------------------------------------------------------------------------------------------------------------
    async ngOnInit() {
        this.tenant = this.appRepository.tenant;
        this.privileges = (await this.appRepository.getPrivileges()).customers;

        if (this.tenant) {
            this.search();
        }
    }
    //------------------------------------------------------------------------------------------------------------------------
    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenant: this.appRepository.tenant, name: this.name });
        this.hideSpinner();
    }
    //------------------------------------------------------------------------------------------------------------------------
    async export() {
        this.showSpinner();

        (this.grid.columns[0] as Column).visible = false;
        const excelExportProperties: ExcelExportProperties = {
            includeHiddenColumn: true,
            fileName: 'customers.xlsx'
        };
        this.grid.excelExport(excelExportProperties);

        this.hideSpinner();
    }
    //------------------------------------------------------------------------------------------------------------------------
    excelExportComplete(): void {
        (this.grid.columns[0] as Column).visible = true;
    }
    //------------------------------------------------------------------------------------------------------------------------

    mail():void {
        console.log('miau');
    }




}
