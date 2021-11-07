import { Component, OnInit, ViewChild  } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column, extend } from '@syncfusion/ej2-angular-grids';
import { CustomerRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppService, EventQueueService, AppEvent, AppEventType } from '../shared/app.service';
import { GridFormParams, FormState } from '../shared/formState';
import { TenantService } from '../shared/tenant.service';

@Component({
	selector: 'customer-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class CustomerListComponent extends PageComponent implements OnInit {

	constructor(private repository: CustomerRepository, private appService: AppService, private tenant: TenantService, private eventQueue: EventQueueService, private formState: FormState) {
		super();
	}
	//------------------------------------------------------------------------------------------------------------------------
	public form: FormParams;
	public list: any;
	@ViewChild('grid') public grid: GridComponent;
	//------------------------------------------------------------------------------------------------------------------------
	async ngOnInit() {
		this.privileges = (await this.appService.getPrivileges()).customers;
		await this.tenant.validate();
		this.formState.setup(this, new FormParams());
		this.search();
	}
	//------------------------------------------------------------------------------------------------------------------------
	async searchClick() {
		this.form.resetGrid(this.grid);
		this.search();
	}
	//------------------------------------------------------------------------------------------------------------------------
	async search() {
		this.formState.save(this);
		this.showSpinner();
		this.list = await this.repository.list({
			tenantId: this.tenant.id,
			name: this.form.name,
			active: this.form.active
		});
		this.hideSpinner();
	}
	//----------------------------------------------------------------------------
	gridActionHandler(e) {
		this.form.gridAction(this.grid, e);
		this.formState.save(this);
	}
	//------------------------------------------------------------------------------------------------------------------------
	async export() {
		this.showSpinner();

		(this.grid.columns[0] as Column).visible = false;
		const excelExportProperties: ExcelExportProperties = {
			includeHiddenColumn: true,
			fileName: 'customers.xlsx'
		};
		this.grid.excelExport(excelExportProperties);

		this.hideSpinner();
	}
	//------------------------------------------------------------------------------------------------------------------------
	excelExportComplete(): void {
		(this.grid.columns[0] as Column).visible = true;
	}
	//------------------------------------------------------------------------------------------------------------------------
	validateEmail(email) {
		var re = /\S+@\S+\.\S+/;
		return re.test(email);
	}
	//------------------------------------------------------------------------------------------------------------------------
	sendEmail(): void {
		var emailList = this.list.map(x => { return this.validateEmail(x.contactEmail) ? { name: x.contactName, email: x.contactEmail } : null; }).filter(x => x != null);
		this.eventQueue.dispatch(new AppEvent(AppEventType.SendEmail, emailList));
	}
	//------------------------------------------------------------------------------------------------------------------------
	sendSms(): void {
		var smsList = this.list.map(x => { return x.phoneNo ? { name: x.contactName, phoneNo: x.contactPhoneNo } : null; }).filter(x => x != null);
		this.eventQueue.dispatch(new AppEvent(AppEventType.SendSms, smsList));
	}
	//------------------------------------------------------------------------------------------------------------------------
}

class FormParams extends GridFormParams {
	name: string;
	active: number = 1;
}
