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
		this.privileges = (await this.appService.getPrivileges()).states;
		this.app = await this.appService.getData();
		this.record = await this.repository.get(id);
		this.countries = this.app.countries;
		this.hideSpinner();			

		this.form = new FormGroup({
			name: new FormControl(this.record.name, [Validators.required]),
			fipsCode: new FormControl(this.record.fipsCode, [Validators.required]),
			countryId: new FormControl(this.record.countryId, [Validators.required]),
			code: new FormControl(this.record.code, [Validators.required])
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
				history.pushState('', '', `/auth/state/edit/${returnValue.id}`);
			}
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
