import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column, extend } from '@syncfusion/ej2-angular-grids';
import { CountystatRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppService } from '../shared/app.service';
import { TenantService } from '../shared/tenant.service';
import { GridFormParams, FormState } from '../shared/formState';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
    selector: 'countystat-list',
    templateUrl: './list.component.html',
})
export class CountystatListComponent extends PageComponent implements OnInit {
	constructor(private repository: CountystatRepository, private appService: AppService, private tenant: TenantService, private formState: FormState) {
        super();
    }
	//----------------------------------------------------------------------------
    public list: any;
	public states: any = null;
	public form: FormParams;
	public dateFormat = {type:'date', format:'MM/dd/yyyy'};

	@ViewChild('editTab')
	public editTab: TabComponent;
	
	@ViewChild('grid') public grid: GridComponent;
	//----------------------------------------------------------------------------
	
	//----------------------------------------------------------------------------
    async ngOnInit() {
		this.app = await this.appService.getData();
		this.privileges = (await this.appService.getPrivileges()).counties;
		await this.tenant.validate();
		if (this.states === null) {
			this.states = this.app.states.slice();
			this.states.unshift({ id: 0, name: 'All' });
		}

		this.formState.setup(this, new FormParams());
		this.search();
    }
	//----------------------------------------------------------------------------
	async searchClick() {
		this.form.resetGrid(this.grid);
		this.search();
	}
	//----------------------------------------------------------------------------
	async search() {
		this.formState.save(this);
		this.showSpinner();
		this.list = await this.repository.list({
			tenantId: this.tenant.id,
			name: this.form.name,
			stateId: this.form.stateId
		});
		this.hideSpinner();
	}
	async export() {
		this.showSpinner();

		(this.grid.columns[0] as Column).visible = false;
		const excelExportProperties: ExcelExportProperties = {
			includeHiddenColumn: true,
			fileName: 'counties.xlsx'
		};
		this.grid.excelExport(excelExportProperties);

		this.hideSpinner();
	}
	//------------------------------------------------------------------------------------------------------------------------
	excelExportComplete(): void {
		(this.grid.columns[0] as Column).visible = true;
	}
	//----------------------------------------------------------------------------
	gridActionHandler(e) {
		this.form.gridAction(this.grid, e);
		this.formState.save(this);
	}
	//----------------------------------------------------------------------------
}
//////////////////////////////////////////////////////////////////////////////////
class FormParams extends GridFormParams {
	name: string;
	stateId: number;
}
//////////////////////////////////////////////////////////////////////////////////
