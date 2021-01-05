import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AppRepository } from "../shared/app.repository";
import { PageComponent } from '../shared/page.component';
import { CustomerRepository } from './repository';

@Component({
    selector: 'customer-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class CustomerEditComponent extends PageComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private appRepository: AppRepository, private repository: CustomerRepository) {
        super();
    }

    public record: any;
    public deleteDialog: Dialog;
    public statesList: any;
    public sitesList: any;

    async ngOnInit() {
        var id = this.route.snapshot.paramMap.get('id');

        this.showSpinner();
        this.statesList = await this.repository.statesList();
        this.record = await this.repository.get(id);
        this.sitesList = await this.repository.sitesList({ tenant: this.record.tenant, customerId: this.record.id });
        this.hideSpinner();        
    }

    async save() {
        var add = !this.record.id;
        this.showSpinner();
        this.record.tenant = this.appRepository.tenant;
        var returnValue = await this.repository.save(this.record);
        this.hideSpinner();

        if (returnValue && returnValue.error) {
            this.showErrorMessage(returnValue.description);
        }
        else {
            var success = returnValue && returnValue.updated;
            this.showSaveMessage(success);

            if (success) {
                this.record = returnValue;
            }

            if (success && add) {
                setTimeout(() => this.router.navigate(['/customer/edit', returnValue.id]), 1000);
            }
        }
    }

    delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete Customer',
            content: `Are you sure you want to delete the customer <b>${this.record.name}</b>?`,
            okButton: { click: this.deleteOK.bind(this) }
        });
    }

    async deleteOK() {
        this.showSpinner();
        this.deleteDialog.close();
        var success = await this.repository.delete(this.record.id);
        this.hideSpinner();
        this.showDeleteMessage(success);

        if (success) {
            setTimeout(() => this.router.navigate(['/customer/list']), 1000);
        }
    }
}
