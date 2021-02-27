import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog, DialogUtility } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { CustomerRepository } from './repository';

@Component({
    selector: 'customer-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class CustomerEditComponent extends PageComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: CustomerRepository) {
        super();
    }

    public record: any;
    public deleteDialog: Dialog;
	public form: FormGroup;

    async ngOnInit() {
        var id = this.route.snapshot.paramMap.get('id');

        this.showSpinner();
        this.app = await this.appService.getData();
        this.privileges = this.app.privileges.customers;
		this.record = await this.repository.get(id);
		this.hideSpinner();

		this.form = new FormGroup({
			name: new FormControl(this.record.name, [Validators.required]),
			serviceStartDate: new FormControl(this.record.serviceStartDate ? new Date(this.record.serviceStartDate) : null),
			serviceEndDate: new FormControl(this.record.serviceEndDate ? new Date(this.record.serviceEndDate) : null),
			address: new FormControl(this.record.address, [Validators.required]),
			address2: new FormControl(this.record.address2, []),
			city: new FormControl(this.record.city, [Validators.required]),
			stateId: new FormControl(this.record.stateId, [Validators.required]),
			postalCode: new FormControl(this.record.postalCode, [Validators.required]),
			website: new FormControl(this.record.website, []),
			phoneNo: new FormControl(this.record.phoneNo, []),
			contactName: new FormControl(this.record.contactName, []),
			contactEmail: new FormControl(this.record.contactEmail, [Validators.required, Validators.email]),
			contactPhoneNo: new FormControl(this.record.contactPhoneNo, [Validators.required]),
			notificationEmail: new FormControl(this.record.notificationEmail, []),
		});
    }

	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!")
		}
		else {
			Object.assign(this.record, this.form.value);

			var add = !this.record.id;
			this.showSpinner();
			this.record.tenantId = this.appService.tenantId;
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
					setTimeout(() => this.router.navigate(['/auth/customer/edit', returnValue.id]), 1000);
				}
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
        var result = await this.repository.delete(this.record.id);
        this.hideSpinner();

        if (result.error) {
            this.showErrorMessage(result.description);
        }
        else {
            this.showDeleteMessage(true);
            setTimeout(() => this.router.navigate(['/auth/customer/list']), 1000);
        }
    }
}
