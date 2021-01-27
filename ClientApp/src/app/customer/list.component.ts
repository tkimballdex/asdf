import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column } from '@syncfusion/ej2-angular-grids';
import { CustomerRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppRepository, EventQueueService, AppEvent, AppEventType } from '../shared/app.repository';

@Component({
    selector: 'customer-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class CustomerListComponent extends PageComponent implements OnInit {  
       
    constructor(private repository: CustomerRepository, private router: Router, private appRepository: AppRepository, private eventQueue: EventQueueService) {
        super();
    }
    //------------------------------------------------------------------------------------------------------------------------
    public list: any;
    public name: any;
    @ViewChild('grid') public grid: GridComponent;    
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
    validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    //------------------------------------------------------------------------------------------------------------------------
    sendEmail(): void {
        var email = this.list.map(x => { return this.validateEmail(x.contactEmail) ? { name: x.contactName, email: x.contactEmail } : null; }).filter(x => x != null);
        this.eventQueue.dispatch(new AppEvent(AppEventType.SendEmail, email));
    }
    //------------------------------------------------------------------------------------------------------------------------
}
