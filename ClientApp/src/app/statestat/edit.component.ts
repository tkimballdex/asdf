import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { StateStatRepository } from './repository';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'statestat-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class StateStatEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: StateStatRepository, private tenant: TenantService) {
        super();
    }
	//------------------------------------------------------------------------------------
	public record: any;
	public data: any;
    public deleteDialog: Dialog;
    public form: FormGroup;
	//------------------------------------------------------------------------------------
	async ngOnInit() {
		var id = this.route.snapshot.paramMap.get('id');

		this.showSpinner();		
		this.privileges = (await this.appService.getPrivileges()).counties;
		this.app = await this.appService.getData();

		if (id == null) {
			this.record = {
				active: true
			};
		}
		else {
			this.record = await this.repository.get(id);
		}

		this.hideSpinner();			

		this.form = new FormGroup({
			date: new FormControl(this.record.date, [Validators.required]),
			stateId: new FormControl(this.record.stateId, [Validators.required]),
			analyteId: new FormControl(this.record.analyteId, [Validators.required]),
		});

		var $this = this;
	}
	//------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!");
			return;
		}

		Object.assign(this.record, this.form.value);

		var add = !this.record.id;
		this.record.tenantId = this.tenant.id;
		this.showSpinner();
		var returnValue = await this.repository.save(this.record);
		this.hideSpinner();

		if (returnValue && returnValue.error) {
			this.showErrorMessage(returnValue.description);
		}
		else {
			var success = !returnValue.error;
			
			this.showSaveMessage(success);

			if (success) {
				this.record = returnValue;
			}

			if (success && add) {
				this.record.id = returnValue.id;
				history.pushState('', '', `/auth/statestat/edit/${returnValue.id}`);
			}
		}
	}
	//------------------------------------------------------------------------------------
	delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete State Statistic',
            content: `Are you sure you want to delete this State Statistic <b>${this.record.userName}</b>?`,
            okButton: { click: this.deleteOK.bind(this) }
        });
    }
	//------------------------------------------------------------------------------------
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
            setTimeout(() => this.router.navigate(['/auth/statestat/list']), 1000);
        }
	}
	//------------------------------------------------------------------------------------
	close() {
		if (history.state.from == 'statestat') {
			this.router.navigate(['/auth/statestat/list'], { state: { formState: true } });
		}
		else {
			this.router.navigate(['/auth/statestat/edit', this.record.id], { state: { state: true } });
		}
	}
	//------------------------------------------------------------------------------------
}
