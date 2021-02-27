import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { SampleRepository } from './repository';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataComponent } from './data.component';
import { TenantService } from '../shared/tenant.service';

@Component({
	selector: 'sample-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class SampleEditComponent extends PageComponent implements OnInit {
	constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: SampleRepository) {
		super();
	}

	public record: any;
	public deleteDialog: Dialog;

	//----------------------------Reference No validations----------------------------//

	public refno: FormControl;
	public date1: FormControl;


	getErrorMessage() {
		if (this.refno.hasError('required')) {
			return 'You must enter a reference number';
		}
		return '';
	}

	getErrorMessage1() {
		if (this.date1.hasError('required')) {
			return 'You must pick a date';
		}
		return '';
	}
	//-----------------------------------------------------------------------------------------
	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.samples;
		var id = this.route.snapshot.paramMap.get('id');
		this.record = await this.repository.get(id);
		this.hideSpinner();

		this.refno = new FormControl(this.record.referenceNo, [Validators.required]);
		this.date1 = new FormControl(this.record.scheduledDate, [Validators.required]);
	}
	//-----------------------------------------------------------------------------------------
	async save() {
		var add = !this.record.id;
		this.showSpinner();
		if (this.refno.hasError('required') || this.date1.hasError('required')) {
			this.dialog.open(DataComponent);
			this.hideSpinner();
		} else {
			this.record.referenceNo = this.refno.value;
			this.record.scheduledDate = this.date1.value;
			this.record.tenantId = this.tenant.id;

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
					setTimeout(() => this.router.navigate(['/auth/sample/edit', returnValue.id]), 1000);
				}
			}
		}
	}
	//-----------------------------------------------------------------------------------------
	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete Vendor',
			content: `Are you sure you want to delete the vendor <b>${this.record.name}</b>?`,
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
			setTimeout(() => this.router.navigate(['/auth/sample/list']), 1000);
		}
	}
	//-----------------------------------------------------------------------------------------
}
