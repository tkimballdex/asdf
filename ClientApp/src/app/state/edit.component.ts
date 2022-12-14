import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { StateRepository } from './repository';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'state-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class StateEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: StateRepository, private tenant: TenantService) {
        super();
    }
	//------------------------------------------------------------------------------------
	public record: any;
	public data: any;
    public deleteDialog: Dialog;
    public form: FormGroup;
	public countries: any;
	//------------------------------------------------------------------------------------
	async ngOnInit() {
		var id = parseInt(this.route.snapshot.paramMap.get('id'));

		this.showSpinner();	
		this.app = await this.appService.getData();
		this.privileges = (await this.appService.getPrivileges()).states;

		if (!id) {
			this.record = {
				tenant: this.tenant.name,
				active: true
			}
		} else {
			this.record = await this.repository.get(id);
			this.calculateDensity();
		}
		this.hideSpinner();			

		this.form = new FormGroup({
			name: new FormControl(this.record?.name, [Validators.required]),
			countryId: new FormControl(this.record?.countryId, [Validators.required]),
			code: new FormControl(this.record?.code, [Validators.required])
		});

		var $this = this;
	}
	//------------------------------------------------------------------------------------
	calculateDensity() {
		if (this.record.population && this.record.landArea) {
			this.record.density = this.record.population / this.record.landArea;
		} else {
			this.record.density = 0;
		}
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
				history.pushState('', '', `/auth/state/edit/${returnValue.id}`);
			}
		}
	}
	//------------------------------------------------------------------------------------
	delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete State',
            content: `Are you sure you want to delete the state <b>${this.record.name}</b>?`,
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
            setTimeout(() => this.router.navigate(['/auth/state/list']), 1000);
        }
    }
	//------------------------------------------------------------------------------------
	close() {
		if (history.state.from == 'state') {
			this.router.navigate(['/auth/state/list'], { state: { formState: true } });
		}
		else {
			this.router.navigate(['/auth/state/edit', this.record.id], { state: { state: true } });
		}
	}
	//------------------------------------------------------------------------------------
}
