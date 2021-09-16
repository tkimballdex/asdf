import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { SiteRepository } from './repository';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
    selector: 'site-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class SiteEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: SiteRepository, private fb:FormBuilder) {
        super();
    }

    public record: any;
    public deleteDialog: Dialog;
    public form: FormGroup;

	@ViewChild('editTab')
	public editTab: TabComponent;

	editTabCreated() {
		console.dir(history.state);
		if (history.state.locations) {
			this.editTab.selectedItem = 1;
		}
	}

    async ngOnInit() {
        this.showSpinner();
        this.app = await this.appService.getData();
        this.privileges = this.app.privileges.sites;

        var id = this.route.snapshot.paramMap.get('id');
        this.record = await this.repository.get(id);
        this.hideSpinner();

        if (id == null) {
            this.record.customerId = this.route.snapshot.paramMap.get('customerId');
        }

        this.form = this.fb.group({
			name: [this.record.name, [Validators.required]],
            address: [this.record.address, [Validators.required]],
            city: [this.record.city, [Validators.required]],
            postalCode: [this.record.postalCode, [Validators.required]],
            contactName: [this.record.contactName, [Validators.required]],
            contactEmail: [this.record.contactEmail, [Validators.required, Validators.email]],
            contactPhoneNo: [this.record.contactPhoneNo, [Validators.required, Validators.maxLength(10)]]
        })
    }

    async save() {
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
                setTimeout(() => this.router.navigate(['/auth/site/edit', returnValue.id]), 1000);
            }
        }
    }

    delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete Site',
            content: `Are you sure you want to delete this Site <b>${this.record.userName}</b>?`,
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
            setTimeout(() => this.router.navigate(['/auth/customer/edit', this.record.customerId]), 1000);
        }
    }
}
