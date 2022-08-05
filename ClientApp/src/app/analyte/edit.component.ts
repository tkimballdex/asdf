import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { AnalyteRepository } from './repository';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TenantService } from '../shared/tenant.service';
@Component({
	selector: 'analyte-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class AnalyteEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: AnalyteRepository, private tenant: TenantService) {
		super();
	}

	public form: FormGroup;
	public record: any;
	public deleteDialog: Dialog;
	public data: any;
	public analyteCategories: any;

	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.data = await this.repository.getData({ tenantId: this.tenant.id });
		this.privileges = this.app.privileges.analytes;
		var id = this.route.snapshot.paramMap.get('id');

		if (id == null) {
			this.record = {
				active: true
			};
		} else {
			this.record = await this.repository.get(id);
		}
		this.hideSpinner();
		

		this.form = new FormGroup({
			name: new FormControl(this.record.name, [Validators.required]),
			code: new FormControl(this.record.code, [Validators.required]),
			description: new FormControl(this.record.description, [Validators.required]),
			resultUnits: new FormControl(this.record.resultUnits, [Validators.required]),
			categoryId: new FormControl(this.record.categoryId, [Validators.required]),
		});
	}
	//-----------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!");
			return;
		}
		else {
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
				var success = returnValue && returnValue.updated;
				this.showSaveMessage(success);

				if (success && add) {
					this.record.id = returnValue.id;
					history.pushState('', '', `/auth/analyte/edit/${returnValue.id}`);
				}
			}
		}
	}
	//-----------------------------------------------------------------------------------------
	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete Analyte',
			content: `Are you sure you want to delete the analyte <b>${this.record.name}</b>?`,
			okButton: { click: this.deleteOK.bind(this) }
		});
	}
	//-----------------------------------------------------------------------------------------
	close() {
		if (history.state.from == 'state') {
			this.router.navigate(['/auth/analyte/list'], { state: { formState: true } });
		}
		else {
			this.router.navigate(['/auth/analyte/edit', this.record.id], { state: { state: true } });
		}
	}
	//-----------------------------------------------------------------------------------------
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
			setTimeout(() => this.router.navigate(['/auth/analyte/list']), 1000);
		}
	}
	//-----------------------------------------------------------------------------------------
}
