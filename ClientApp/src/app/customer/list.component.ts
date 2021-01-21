import { Component, OnInit, ViewChild, Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column } from '@syncfusion/ej2-angular-grids';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { CustomerRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from '../shared/app.repository';
import { ServiceService } from '../service.service';

@Component({
    selector: 'customer-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class CustomerListComponent extends PageComponent implements OnInit {  
    
    
    @Output() myevent = new EventEmitter();
      
    constructor(private service: ServiceService,  private repository: CustomerRepository, private router: Router, private appRepository: AppRepository) {
        super();
    }
    //------------------------------------------------------------------------------------------------------------------------
    public list: any;
    public name: any;
    @ViewChild('sidebarEmail') public sidebarEmailInstance: SidebarComponent;
    @ViewChild('grid') public grid: GridComponent;    
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
    open(): void  {
       this.service.openSidebar();
    }
    //------------------------------------------------------------------------------------------------------------------------
    method(): void{
        this.myevent.emit();
    }



}
