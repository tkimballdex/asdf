import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { LocationRepository } from './repository';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'location-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class LocationEditComponent extends PageComponent implements OnInit {
	constructor(private fb:FormBuilder, private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: LocationRepository, private tenant: TenantService) {
        super();
    }

    public record: any;
    public deleteDialog: Dialog;
    public form: FormGroup;
    @ViewChild('grid') public grid: GridComponent;

    async ngOnInit() {
        this.privileges = (await this.appService.getPrivileges()).locations;
        var id = this.route.snapshot.paramMap.get('id');
        this.showSpinner();
        this.record = await this.repository.get(id);
        this.hideSpinner();

        if (id == null) {
            this.record.siteId = this.route.snapshot.paramMap.get('siteId');
        }

        this.form = this.fb.group({
            name: [this.record.name, [Validators.required]]
        })
    }

    async save() {
        var add = !this.record.id;
		this.record.tenantId = this.tenant.id;
        this.showSpinner();
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
                setTimeout(() => this.router.navigate(['/auth/location/edit', returnValue.id]), 1000);
            }
        }
    }

    delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete Location',
            content: `Are you sure you want to delete the location <b>${this.record.name}</b>?`,
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
            setTimeout(() => this.router.navigate(['/auth/site/edit', this.record.siteId]), 1000);
        }
    }
}
