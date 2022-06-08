import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column, extend } from '@syncfusion/ej2-angular-grids';
import { CountyRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppService } from '../shared/app.service';
import { TenantService } from '../shared/tenant.service';
import { GridFormParams, FormState } from '../shared/formState';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
    selector: 'county-list',
    templateUrl: './list.component.html',
})
export class CountyListComponent extends PageComponent implements OnInit {
	constructor(private repository: CountyRepository, private appService: AppService, private tenant: TenantService, private formState: FormState) {
        super();
    }
	//----------------------------------------------------------------------------
    public list: any;
	public states: any;
	public form: FormParams;
	public tabGrid: string;

	@ViewChild('editTab') public editTab: TabComponent;
	@ViewChild('grid') public grid: GridComponent;
	@ViewChild('griddemographics') public griddemographics: GridComponent;
	@ViewChild('grideconomics') public grideconomics: GridComponent;
	//----------------------------------------------------------------------------
	
	//----------------------------------------------------------------------------
    async ngOnInit() {
		this.app = await this.appService.getData();
		this.privileges = (await this.appService.getPrivileges()).counties;
		
		await this.tenant.validate();
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
	//----------------------------------------------------------------------------
	async export(tabIndex) {
		this.showSpinner();
		switch (tabIndex) {
			case 0:
				this.tabGrid = 'grid';
				break;
			case 1:
				this.tabGrid = 'griddemographics';
				break;
			case 2:
				this.tabGrid = 'grideconomics';
				break;
		  }

		(this[this.tabGrid].columns[0] as Column).visible = false;
		const excelExportProperties: ExcelExportProperties = {
			includeHiddenColumn: true,
			fileName: 'counties.xlsx'
		};
		this[this.tabGrid].excelExport(excelExportProperties);

		this.hideSpinner();
	}
	//----------------------------------------------------------------------------
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
