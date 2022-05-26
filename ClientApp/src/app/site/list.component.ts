import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column, extend } from '@syncfusion/ej2-angular-grids';
import { SiteRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { GridFormParams, FormState } from '../shared/formState';
import { AppService, EventQueueService, AppEvent, AppEventType } from '../shared/app.service';

@Component({
    selector: 'site-list',
    templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class SiteListComponent extends PageComponent implements OnInit {
	constructor(private repository: SiteRepository, public appService: AppService, private tenant: TenantService, private eventQueue: EventQueueService, private formState: FormState) {
        super();
    }
	//------------------------------------------------------------------------------------------------------------------------
	public form: FormParams;
	public list: any;
	public customers: any = null;
	public states: any = null;
	@ViewChild('grid') public grid: GridComponent;
	//------------------------------------------------------------------------------------------------------------------------
    async ngOnInit() {
		this.privileges = (await this.appService.getPrivileges()).sites;
		await this.tenant.validate();

		if (this.customers === null) {
			this.customers = await this.repository.listCustomers({
				tenantId: this.tenant.id,
			});
			this.customers.unshift({ id: this.appService.GuidEmpty, name: "All" });
		}
		
		if (this.states === null) {
			this.app = await this.appService.getData();
			this.states = this.app.states.slice();
			this.states.unshift({ id: 0, name: 'All' });
		}

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
			searchTxt: this.form.searchTxt,
			customerId: this.form.customerId,
			stateId: this.form.stateId,
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
			fileName: 'sites.xlsx'
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
		var emailList = this.list.map(x => { return this.validateEmail(x.notificationEmail) ? { name: x.contactName, email: x.notificationEmail } : null; }).filter(x => x != null);
		this.eventQueue.dispatch(new AppEvent(AppEventType.SendEmail, { emailList }));
	}
	//------------------------------------------------------------------------------------------------------------------------
	sendSms(): void {
		var smsList = this.list.map(x => { return x.alerts ? { name: x.contactName, phoneNo: x.alerts } : null; }).filter(x => x != null);
		this.eventQueue.dispatch(new AppEvent(AppEventType.SendSms, smsList));
	}
	//------------------------------------------------------------------------------------------------------------------------
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class FormParams extends GridFormParams {
	searchTxt: string;
	customerId: string;
	stateId: number = 0;
	active: number = 1;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
