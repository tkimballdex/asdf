import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { CountyRepository } from './repository';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'county-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class CountyEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: CountyRepository, private tenant: TenantService) {
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
		this.privileges = (await this.appService.getPrivileges()).counties;
		this.app = await this.appService.getData();
		this.record = await this.repository.get(id);
		this.countries = this.app.countries;
		this.hideSpinner();			

		this.form = new FormGroup({
			name: new FormControl(this.record.name, [Validators.required]),
			stateId: new FormControl(this.record.stateId, [Validators.required]),
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
				history.pushState('', '', `/auth/county/edit/${returnValue.id}`);
			}
		}
	}
	//------------------------------------------------------------------------------------
	close() {
		if (history.state.from == 'state') {
			this.router.navigate(['/auth/county/list'], { state: { formState: true } });
		}
		else {
			this.router.navigate(['/auth/county/edit', this.record.id], { state: { state: true } });
		}
	}
	//------------------------------------------------------------------------------------
}
