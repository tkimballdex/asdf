import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppRepository } from "../shared/app.repository";
import { PageComponent } from '../shared/page.component';
import { SiteRepository } from './repository';

@Component({
  selector: 'app-testedit',
  templateUrl: './testedit.component.html',
  styleUrls: ['./testedit.component.css']
})
export class TestEditComponent extends PageComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private appRepository: AppRepository, private repository: SiteRepository) {
    super();
}

public record: any;
public deleteDialog: Dialog;

async ngOnInit() {
    this.showSpinner();
    this.app = await this.appRepository.getData();
    this.privileges = this.app.privileges.sites;

    var id = this.route.snapshot.paramMap.get('id');
    this.record = await this.repository.get(id);
    this.hideSpinner();

    if (id == null) {
        this.record.customerId = this.route.snapshot.paramMap.get('customerId');
    }
}

async save() {
    var add = !this.record.id;
    this.showSpinner();
    this.record.tenantId = this.appRepository.tenantId;
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
    var result = await this.repository.delete(this.record.id);
    this.hideSpinner();

    if (result.error) {
        this.showErrorMessage(result.description);
    }
    else {
        this.showDeleteMessage(true);
        setTimeout(() => this.router.navigate(['/customer/edit', this.record.customerId]), 1000);
    }
}
}
