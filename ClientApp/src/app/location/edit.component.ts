import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppRepository } from "../shared/app.repository";
import { PageComponent } from '../shared/page.component';
import { LocationRepository } from './repository';

@Component({
    selector: 'location-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class LocationEditComponent extends PageComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private appRepository: AppRepository, private repository: LocationRepository) {
        super();
    }

    public record: any;
    public deleteDialog: Dialog;
    @ViewChild('grid', null) public grid: GridComponent;

    async ngOnInit() {
        var id = this.route.snapshot.paramMap.get('id');
        this.showSpinner();
        this.record = await this.repository.get(id);
        this.hideSpinner();
    }

    async save() {
        var add = !this.record.id;
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
                setTimeout(() => this.router.navigate(['/location/edit', returnValue.id]), 1000);
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
        var success = await this.repository.delete(this.record.id);
        this.hideSpinner();
        this.showDeleteMessage(success);

        if (success) {
            setTimeout(() => this.router.navigate(['/location/list']), 1000);
        }
    }
}
