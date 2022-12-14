import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { SampleRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { AppService } from '../shared/app.service';
import { GridFormParams, FormState } from '../shared/formState';
import { DateRangePicker } from '@syncfusion/ej2-angular-calendars';

@Component({
    selector: 'sample-list',
    templateUrl: './list.component.html',
})
export class SampleListComponent extends PageComponent implements OnInit {

	constructor(private repository: SampleRepository, private tenant: TenantService, private appService: AppService, private formState: FormState) {
        super();
    }
    //------------------------------------------------------------------------------------------------------------------------
    public list: any;
    public name: any;
    public dateFormat: any;
	public form: FormParams;
	public statuses: any;
	public startDate: Date;
	public endDate: Date;

   @ViewChild('grid') public grid: GridComponent;
   @ViewChild('SelectRange') public SelectRange: DateRangePicker;
    //------------------------------------------------------------------------------------------------------------------------
	async ngOnInit() {
		this.app = await this.appService.getData();
		this.privileges = (await this.appService.getPrivileges()).samples;
		this.dateFormat = { type: 'date', format: 'MM/dd/yyyy' };
		this.formState.setup(this, new FormParams());

		var today = new Date();
		this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
		this.statuses = this.app.sampleStatuses.slice();
		this.statuses.unshift({ id: 0, name: 'All' });

		this.search();
	}

	ngAfterViewChecked() {
		if (this.SelectRange && !this.SelectRange.startDate) {
			this.SelectRange.startDate = this.startDate;
			this.SelectRange.endDate = this.endDate;
			this.dateRangeChange({ startDate: this.startDate, endDate: this.endDate });
		}
	}
    //------------------------------------------------------------------------------------------------------------------------
	async search() {
		this.appService.saveFormState(this);
		this.showSpinner();
		this.list = await this.repository.list({
			tenantId: this.tenant.id,
			sampleNo: this.form.sampleNo,
			referenceNo: this.form.referenceNo,
			startDate: this.startDate,
			endDate: this.endDate,
			sampleStatusId: this.form.sampleStatusId
		});
		this.hideSpinner();
	}
	//------------------------------------------------------------------------------------------------------------------------
	gridActionHandler(e) {
		this.form.gridAction(this.grid, e);
		this.formState.save(this);
	}
	//------------------------------------------------------------------------------------------------------------------------
	dateRangeChange(e) {
		if (e && e.startDate && e.endDate) {
			this.startDate = this.getAdjustedDate(e.startDate);
			this.endDate = this.getAdjustedDate(e.endDate);
		}
	}
	//------------------------------------------------------------------------------------------------------------------------
	getAdjustedDate(date: Date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
	}
    //------------------------------------------------------------------------------------------------------------------------
    async export() {
        this.showSpinner();

        (this.grid.columns[0] as Column).visible = false;
        const excelExportProperties: ExcelExportProperties = {
            includeHiddenColumn: true,
            fileName: 'samples.xlsx'
        };
        this.grid.excelExport(excelExportProperties);

        this.hideSpinner();
    }
    //------------------------------------------------------------------------------------------------------------------------
    excelExportComplete(): void {
        (this.grid.columns[0] as Column).visible = true;
    }
    //------------------------------------------------------------------------------------------------------------------------
}
///////////////////////////////////////////////////////////////////////////////////
class FormParams extends GridFormParams {
	constructor() {
		super();
        this.sampleNo = "";
		this.referenceNo = "";
		this.sampleStatusId = 0;

		var today = new Date();
		this.startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
		this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	}

	public tenantId: string;
    public sampleNo: string;
	public referenceNo: string;
	public startDate: Date;
	public endDate: Date;
	public sampleStatusId: number;
}
