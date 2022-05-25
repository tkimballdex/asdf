import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { SamplerRepository } from './repository';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'sampler-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class SamplerEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: SamplerRepository) {
		super();
	}

	public form: FormGroup;
	public record: any;
	public deleteDialog: Dialog;
	public data: any;

	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.samplers;
		var id = this.route.snapshot.paramMap.get('id');
		this.data = await this.repository.getData();

		if (id) {
			this.record = await this.repository.get(id);
		}
		else {
			this.record = {};
		}

		this.hideSpinner();
		this.record.purchaseDate = this.record.purchaseDate ? new Date(this.record.purchaseDate) : null;

		this.form = new FormGroup({
			customerId: new FormControl(this.record.customerId, [Validators.required]),
			samplingTypeId: new FormControl(this.record.samplingTypeId, [Validators.required]),
			modelNo: new FormControl(this.record.modelNo, [Validators.required]),
			brand: new FormControl(this.record.brand, [Validators.required]),
			serialNo: new FormControl(this.record.serialNo, [Validators.required]),
			assetNo: new FormControl(this.record.assetNo, [Validators.required]),
			name: new FormControl(this.record.name, [Validators.required])
		});
	}
	//-----------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!")
		}
		else {
			Object.assign(this.record, this.form.value);

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

				if (success && add) {
					this.record.id = returnValue.id;
					history.pushState('', '', `/auth/sampler/edit/${returnValue.id}`);
				}
			}
		}
	}
	//-----------------------------------------------------------------------------------------
	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete Sampler',
			content: `Are you sure you want to delete the sampler <b>${this.record.name}</b>?`,
			okButton: { click: this.deleteOK.bind(this) }
		});
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
			setTimeout(() => this.router.navigate(['/auth/sampler/list']), 1000);
		}
	}
	//-----------------------------------------------------------------------------------------
}
