import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleRepository } from './repository';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog  } from '@syncfusion/ej2-popups';
import { PageComponent } from '../shared/page.component';

@Component({
    selector: 'role-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class RoleEditComponent extends PageComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private repository: RoleRepository) {
        super();
    }

    public record: any;
    public deleteDialog: Dialog;
    @ViewChild('grid') public grid: GridComponent;

    async ngOnInit() {
        var id = this.route.snapshot.paramMap.get('id');

        this.showSpinner();
        this.record = await this.repository.get(id);
        this.hideSpinner();
        this.record.featureRoles.forEach(function (x, i) {
            x.index = i;
        });
    }

    async save() {
        var add = !this.record.id;
        this.showSpinner();
        this.record = await this.repository.save(this.record);
        this.hideSpinner();
        var success = this.record && this.record.updated;
        this.showSaveMessage(success);
        if (success && add) {
            setTimeout(() => this.router.navigate(['/auth/role/edit', this.record.id]), 1000);
        }
    }

    delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete Role',
            content: `Are you sure you want to delete the role <b>${this.record.name}</b>?`,
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
            setTimeout(() => this.router.navigate(['/auth/role/list']), 1000);
        }
    }
}
