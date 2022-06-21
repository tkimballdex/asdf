import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { CollectionRepository } from './repository';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TenantService } from '../shared/tenant.service';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';

@Component({
	selector: 'collectionContainer-edit',
	templateUrl: './cedit.component.html',
	styleUrls: ['./cedit.component.scss']
})
export class CollectionContainerEditComponent extends PageComponent implements OnInit {
	constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: CollectionRepository) {
		super();
	}

	public form: FormGroup;
	public record: any;
	public deleteDialog: Dialog;
	public containerSuccessfulBool: boolean = null;

	public data: any;

	@ViewChild('editTab') public editTab: TabComponent;	
	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.samples;
		this.data = await this.repository.getData();

		var id = this.route.snapshot.paramMap.get('id');

		if (id) {
			this.record = await this.repository.getContainer(id);
			this.containerSuccessfulBool = this.record.failureReasonId ? false : true;
		} else {
			var collectionId = this.route.snapshot.paramMap.get('collectionId');
			var collection = await this.repository.get(collectionId);

			this.record = {
				collectionId: collectionId,
				collectionName: collection.name,
				scheduledDate: collection.scheduledDate,
				customer: collection.customer,
				site: collection.site,
				location: collection.location
			};
		}

		this.hideSpinner();

		this.form = new FormGroup({
			containerSuccessful: new FormControl(this.containerSuccessfulBool),
			containerNo: new FormControl(this.record.containerNo),
			containerTypeId: new FormControl(this.record.containerTypeId, [Validators.required]),
			failureReasonId: new FormControl(this.record.failureReasonId),
			containerVolume: new FormControl(this.record.volume),
		});

		this.form.get('containerSuccessful').valueChanges.subscribe(value => {
			if (value === true) {
				this.form.get('containerVolume').setValidators([Validators.required]);
				this.form.get('failureReasonId').setValidators(null);
			} else if (value === false) {
				this.form.get('containerVolume').setValidators(null);
				this.form.get('failureReasonId').setValidators([Validators.required]);
			} else if (value === null) {
				this.form.get('containerVolume').setValidators(null);
				this.form.get('failureReasonId').setValidators(null);
			}
			this.form.get('containerVolume').updateValueAndValidity();
			this.form.get('failureReasonId').updateValueAndValidity();
		});
	}
	//-----------------------------------------------------------------------------------------
	editTabCreated() {
		if (history.state.tests) {
			this.editTab.selectedItem = 1;
		}
	}
	//-----------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();
		if (this.record.volume === 0) {
			this.form.get('containerVolume').setValue(null)
		}

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!");
		} else {
			Object.assign(this.record, this.form.value);

			var add = !this.record.id;
			this.record.tenantId = this.tenant.id;

			if (this.form.get('containerSuccessful').value === true) {
				this.record.failureReasonId = null;
			} else if (this.form.get('containerSuccessful').value === false) {
				this.record.volume = 0;
				this.record.acidity = null;
				this.record.temperature = null;
				this.record.conductivity = null;
			}

			this.showSpinner();
			var returnValue = await this.repository.saveContainer(this.record);
			this.hideSpinner();

			if (returnValue && returnValue.error) {
				this.showErrorMessage(returnValue.description);
			} else {
				var success = returnValue && returnValue.updated;
				this.showSaveMessage(success);

				if (success && add) {
					setTimeout(() => this.router.navigate(['/auth/collection/cedit', returnValue.id]), 1000);
				}
			}
		}
	}
	//-----------------------------------------------------------------------------------------
	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete Container',
			content: `Are you sure you want to delete the Container <b>${this.record.containerNo}</b>?`,
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
			setTimeout(() => this.router.navigate(['/auth/collection/list']), 1000);
		}
	}	
	//-----------------------------------------------------------------------------------------
}
