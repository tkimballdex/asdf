import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AppRepository } from "../shared/app.repository";
import { PageComponent } from '../shared/page.component';
import { SiteRepository } from './repository';

@Component({
    selector: 'site-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class SiteEditComponent extends PageComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private appRepository: AppRepository, private repository: SiteRepository) {
        super();
    }

    public record: any;
    public deleteDialog: Dialog;
    public statesList: any;
    public locationsList: any;
    public frequencyList: any;

    async ngOnInit() {
        var id = this.route.snapshot.paramMap.get('id');
        this.showSpinner();
        this.statesList = await this.repository.statesList();
        this.frequencyList = await this.repository.frequencyList();
        this.record = await this.repository.get(id);
        this.locationsList = await this.repository.locationsList({ tenant: this.record.tenant, siteId: this.record.id });
        this.hideSpinner();

        if (id == null) {
            this.record.customerId = this.route.snapshot.paramMap.get('customerId');
        }
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
                setTimeout(() => this.router.navigate(['/site/edit', returnValue.id]), 1000);
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
        var success = await this.repository.delete(this.record.id);
        this.hideSpinner();
        this.showDeleteMessage(success);

        if (success) {
            setTimeout(() => this.router.navigate(['/site/list']), 1000);
        }
    }
}
