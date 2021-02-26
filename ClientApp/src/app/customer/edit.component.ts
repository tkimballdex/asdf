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

	get name() { return this.form.get('name'); }
	get stateId() { return this.form.get('stateId'); }

    async ngOnInit() {
        var id = this.route.snapshot.paramMap.get('id');

        this.showSpinner();
        this.app = await this.appService.getData();
        this.privileges = this.app.privileges.customers;
        this.record = await this.repository.get(id);
		this.hideSpinner();

		this.form = new FormGroup({
			name: new FormControl(this.record.name, [Validators.required]),
			address: new FormControl(this.record.address, [Validators.required]),
			stateId: new FormControl(this.record.stateId, [Validators.required])
		});
    }

	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!")
		}
		else {
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
