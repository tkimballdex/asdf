import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppRepository } from "../shared/app.repository";
import { PageComponent } from '../shared/page.component';
import { UserRepository } from './repository';

@Component({
    selector: 'user-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class UserEditComponent extends PageComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private appRepository: AppRepository, private repository: UserRepository) {
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

        this.record.roles.forEach(function (x, i) {
            x.index = i;
        });

        this.record.tenants.forEach(function (x, i) {
            x.index = i;
        });
    }

    async save() {
        var add = !this.record.id;
        this.showSpinner();
        this.record = await this.repository.save(this.record);
        this.hideSpinner();

        if (this.record && this.record.error) {
            this.showErrorMessage(this.record.description);
        }
        else {
            var success = this.record && this.record.updated;
            this.showSaveMessage(success);

            if (success && add) {
                setTimeout(() => this.router.navigate(['/user/edit', this.record.id]), 1000);
            }
        }
    }

    delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete User',
            content: `Are you sure you want to delete the user <b>${this.record.userName}</b>?`,
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
            setTimeout(() => this.router.navigate(['/user/list']), 1000);
        }
    }
}
