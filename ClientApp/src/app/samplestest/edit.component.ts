import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { SampleTestRepository } from './repository';
import { TenantService } from '../shared/tenant.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'sampletest-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class SampleTestEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: SampleTestRepository) {
        super();
	}

	public form: FormGroup;
    public record: any;
	public deleteDialog: Dialog;
	public variants: any;
	public recordData: any;
	public testData: any;
	public testTypes: any;
	public resultTypes: any;
	public analytes: any;
    //-----------------------------------------------------------------------------------------
    async ngOnInit() {       
        this.showSpinner();
        this.app = await this.appService.getData();
        this.privileges = this.app.privileges.tests;

		this.analytes = await this.repository.getAnalytes();

		var id = this.route.snapshot.paramMap.get('id');
		var sampleId = this.route.snapshot.paramMap.get('sampleId');

		if (id) {
			this.recordData = await this.repository.get(id);
			this.record = this.recordData.record;
			this.record.variants = this.recordData.variants;
		}
		else if (sampleId) {
			var sample = await this.repository.getSample(sampleId);
			this.record = {
				sampleId: sampleId,
				customer: sample.customer,
				location: sample.location,
				site: sample.site,
				sample: sample.name
			}
		}
		else {
			this.record = {};
		}

		this.testData = await this.repository.getData(this.record.analyteId);

		this.hideSpinner();

		this.form = new FormGroup({
			referenceNo: new FormControl(this.record.referenceNo, [Validators.required]),
			analyteId: new FormControl(this.record.analyteId, [Validators.required]),
			testTypeId: new FormControl(this.record.testTypeId, [Validators.required]),
			sampleId: new FormControl(this.record.sampleId, [Validators.required]),
			testSuccessful: new FormControl(!this.record.rejectionReasonId)
		});
    }
    //-----------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!");
			return;
		}

		Object.assign(this.record, this.form.value);

		var add = !this.record.id;
		this.showSpinner();
		this.record.tenantId = this.tenant.id;
		var returnValue = await this.repository.save(this.record);
		this.hideSpinner();

		if (returnValue && returnValue.error) {
			this.showErrorMessage(returnValue.description);
		}
		else {
			var success = returnValue && returnValue.updated === true;
			this.showSaveMessage(success);

			if (success && add) {
				setTimeout(() => this.router.navigate(['/auth/sampletest/edit', returnValue.id]), 1000);
			}
		}
	}
    //-----------------------------------------------------------------------------------------
    delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete Test',
            content: `Are you sure you want to delete the test <b>${this.record.referenceNo}</b>?`,
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
            setTimeout(() => this.router.navigate(['/auth/sampletest/list']), 1000);
        }
	}
	//-----------------------------------------------------------------------------------------
	async analyteChange(e) {
		this.testTypes = null;
		this.resultTypes = null;
		this.form.get('analyteId').setValue(null);
		this.recordData = await this.repository.getData(e.itemData.id);
	}
    //-----------------------------------------------------------------------------------------	
	setSucessStatus() {
		this.record.failureReasonId = null;
	}
	//-----------------------------------------------------------------------------------------
}
