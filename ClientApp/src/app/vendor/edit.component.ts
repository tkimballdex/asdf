import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { VendorRepository } from './repository';
import { TenantService } from '../shared/tenant.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'vendor-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class VendorEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: VendorRepository) {
        super();
    }

    public record: any;
    public deleteDialog: Dialog;
    public form: FormGroup;

    //-----------------------------------------------------------------------------------------
    async ngOnInit() {    
        var id = this.route.snapshot.paramMap.get('id');

        this.showSpinner();
        this.app = await this.appService.getData();
        this.privileges = (await this.appService.getPrivileges()).vendors;
        this.record = await this.repository.get(id);
        this.hideSpinner();     
        
        this.form = new FormGroup({
            name: new FormControl(this.record.name, [Validators.required]),
            vendorTypeId: new FormControl(this.record.vendorTypeId, [Validators.required]),
            address: new FormControl(this.record.address, [Validators.required]),
			city: new FormControl(this.record.city, [Validators.required]),
			stateId: new FormControl(this.record.stateId, [Validators.required]),
			postalCode: new FormControl(this.record.postalCode, [Validators.required]),
            contactName: new FormControl(this.record.contactName, [Validators.required]),
            contactEmail: new FormControl(this.record.contactEmail, [Validators.required, Validators.email]),
            contactPhoneNo: new FormControl(this.record.contactPhoneNo, [Validators.required]),
        });        
    }
    //-----------------------------------------------------------------------------------------
    async save() {
        this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!")
		}
		else {
			Object.assign(this.record, this.form.value);

            var add = !this.record.id;
            this.showSpinner();
            this.record.tenantId = this.tenant.id;
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
                    this.record.id = returnValue.id;
                    setTimeout(() => this.router.navigate(['/auth/vendor/edit', returnValue.id]), 1000);
                }
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
            setTimeout(() => this.router.navigate(['/auth/vendor/list']), 1000);
        }
    }
    //-----------------------------------------------------------------------------------------
}
