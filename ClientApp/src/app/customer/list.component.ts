import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column } from '@syncfusion/ej2-angular-grids';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
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
    public name: any;
    @ViewChild('sidebarEmail', null) public sidebarEmailInstance: SidebarComponent;
    @ViewChild('grid', null) public grid: GridComponent;    
    public messageEnableDock: boolean = true;
    public messageWidth: string = '400px';
    public messageDockSize: string = '0px';
    //------------------------------------------------------------------------------------------------------------------------
    async ngOnInit() {
        this.privileges = (await this.appRepository.getPrivileges()).customers;

        if (this.appRepository.tenantId) {
            this.search();
        }
    }
    //------------------------------------------------------------------------------------------------------------------------
    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenantId: this.appRepository.tenantId, name: this.name });
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
    toggleMessage(): void  {
        this.sidebarEmailInstance.toggle();
    }
    //------------------------------------------------------------------------------------------------------------------------




}
