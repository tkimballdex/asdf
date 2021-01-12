import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AppRepository } from "../shared/app.repository";
import { PageComponent } from '../shared/page.component';
import { VendorRepository } from './repository';

@Component({
    selector: 'vendor-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class VendorEditComponent extends PageComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private appRepository: AppRepository, private repository: VendorRepository) {
        super();
    }

    public record: any;
    public deleteDialog: Dialog;

    //-----------------------------------------------------------------------------------------
    async ngOnInit() {       
        this.showSpinner();
        this.app = await this.appRepository.getData();
        this.privileges = this.app.privileges.vendors;

        var id = this.route.snapshot.paramMap.get('id');
        this.record = await this.repository.get(id);
        this.hideSpinner();        
    }
    //-----------------------------------------------------------------------------------------
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
                setTimeout(() => this.router.navigate(['/vendor/edit', returnValue.id]), 1000);
            }
        }
    }
    //-----------------------------------------------------------------------------------------
    delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete Vendor',
            content: `Are you sure you want to delete the vendor <b>${this.record.name}</b>?`,
            okButton: { click: this.deleteOK.bind(this) }
        });
    }
    //-----------------------------------------------------------------------------------------
    async deleteOK() {
        this.showSpinner();
        this.deleteDialog.close();
        var result = await this.repository.delete(this.record.id);
        this.hideSpinner();

        if (result.error) {
            this.showErrorMessage(result.description);
        }
        else {
            this.showDeleteMessage(true);
            setTimeout(() => this.router.navigate(['/vendor/list']), 1000);
        }
    }
    //-----------------------------------------------------------------------------------------
}
