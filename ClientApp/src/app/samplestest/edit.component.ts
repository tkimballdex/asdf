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
	public testResults: any;
	public analytes: any;
	public testSuccessfulBool: boolean = null;
	public selectedAnalyteUnit: string = '';
	@ViewChild('TestCompletedOn') public TestCompletedOn;
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
			if (this.record.failureReasonId) {
				this.testSuccessfulBool = false;
			} else if (this.record.resultValue) {
				this.testSuccessfulBool = true;
			}
		} else if (sampleId) {
			var sample = await this.repository.getSample(sampleId);
			this.record = {
				sampleId: sampleId,
				customer: sample.customer,
				location: sample.location,
				site: sample.site,
				sample: sample.name,
				referenceNo: ""
			}
		} else {
			this.record = {};
		}

		this.testData = await this.repository.getData(this.record.analyteId);
		this.testTypes = this.testData.testTypes;
		this.testResults = this.testData.testResults;

		this.hideSpinner();

		this.record.createdDate = this.record.createdDate ? new Date(this.record.createdDate) : null;

		this.form = new FormGroup({
			analyteId: new FormControl(this.record.analyteId, [Validators.required]),
			testTypeId: new FormControl(this.record.testTypeId, [Validators.required]),
			sampleId: new FormControl(this.record.sampleId),
			testSuccessful: new FormControl(this.testSuccessfulBool),
			testResultId: new FormControl(this.record.testResultId),
			resultValue: new FormControl(this.record.resultValue),
			failureReasonId: new FormControl(this.record.failureReasonId),
			completedDate: new FormControl(this.record.completedDate)
		});

		if (id) {
			const analyte = await this.repository.getAnalyte(this.form.value.analyteId);
			this.selectedAnalyteUnit = ` (${analyte['resultUnits']})`;
		}

		this.form.get('testSuccessful').valueChanges.subscribe(value => {
			if (value === true) {
				this.form.get('testResultId').setValidators([Validators.required]);
				this.form.get('resultValue').setValidators([Validators.required]);
				this.form.get('failureReasonId').setValidators(null);
			} else if (value === false) {
				this.form.get('failureReasonId').setValidators([Validators.required]);
				this.form.get('testResultId').setValidators(null);
				this.form.get('resultValue').setValidators(null);
			} else if (value === null) {
				this.form.get('failureReasonId').setValidators(null);
				this.form.get('testResultId').setValidators(null);
				this.form.get('resultValue').setValidators(null);
			}
			this.form.get('testResultId').updateValueAndValidity();
			this.form.get('resultValue').updateValueAndValidity();
			this.form.get('failureReasonId').updateValueAndValidity();
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

		if (this.form.controls.testSuccessful.value === true || this.form.controls.testSuccessful.value === null) {
			this.record.failureReasonId = null;
		}
		if (this.form.controls.testSuccessful.value === false || this.form.controls.testSuccessful.value === null) {
			this.record.resultValue = null;
			this.record.testResultId = null;
		}

		var add = !this.record.id;
		this.showSpinner();
		this.record.tenantId = this.tenant.id;

		var returnValue = await this.repository.save(this.record);
		this.hideSpinner();

		if (returnValue && returnValue.error) {
			this.showErrorMessage(returnValue.description);
		} else {
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
			content: `Are you sure you want to delete the test <b>${this.record.testNo}</b>?`,
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
		} else {
			this.showDeleteMessage(true);
			setTimeout(() => this.router.navigate(['/auth/sampletest/list']), 1000);
		}
	}
	//-----------------------------------------------------------------------------------------
	async analyteChange(e) {
		this.showSpinner();
		this.testTypes = null;
		this.testResults = null;
		this.form.get('analyteId').setValue(e.itemData.id);
		this.form.get('testTypeId').setValue(null);

		const analyte = await this.repository.getAnalyte(e.value);
		this.selectedAnalyteUnit = ` (${analyte['resultUnits']})`;

		this.testData = await this.repository.getData(e.itemData.id);
		this.testTypes = this.testData.testTypes;
		this.testResults = this.testData.testResults;
		this.hideSpinner();
	}
	//-----------------------------------------------------------------------------------------
	close() {
		if (history.state.from == 'sampletests') {
			this.router.navigate(['/auth/sampletest/list'], { state: { formState: true } });
		} else {
			this.router.navigate(['/auth/sample/edit', this.record.sampleId], { state: { sampletests: true } });
		}
	}
	//-----------------------------------------------------------------------------------------
}
