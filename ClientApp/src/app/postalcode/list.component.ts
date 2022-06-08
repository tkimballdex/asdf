import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, Column, ExcelExportProperties } from '@syncfusion/ej2-angular-grids';
import { PostalcodeRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppService } from '../shared/app.service';
import { TenantService } from '../shared/tenant.service';
import { GridFormParams, FormState } from '../shared/formState';
import { StateListComponent } from '../state/list.component';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
    selector: 'postalcode-list',
    templateUrl: './list.component.html',
})
export class PostalcodeListComponent extends PageComponent implements OnInit {
	constructor(private repository: PostalcodeRepository, private appService: AppService, private tenant: TenantService, private formState: FormState) {
        super();
    }

    public list: any;
	public states: any = null;
	public form: FormParams;
	public tabGrid: string;
	
	@ViewChild('editTab')
	public editTab: TabComponent;

	@ViewChild('grid') public grid: GridComponent;
	@ViewChild('griddemographics') public griddemographics: GridComponent;
	@ViewChild('grideconomics') public grideconomics: GridComponent;

    async ngOnInit() {
		this.privileges = (await this.appService.getPrivileges()).postalCodes;

		if (this.states === null) {
			this.app = await this.appService.getData();
			this.states = this.app.states.slice();
			this.states.unshift({ id: 0, name: 'All' });
		}
	
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
			searchTxt: this.form.searchTxt,
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
			fileName: 'postalcodes.xlsx'
		};
		this[this.tabGrid].excelExport(excelExportProperties);

		this.hideSpinner();
	}
	//------------------------------------------------------------------------------------------------------------------------
	excelExportComplete(): void {
		(this[this.tabGrid].columns[0] as Column).visible = true;
	}
	//------------------------------------------------------------------------------------------------------------------------
	gridActionHandler(e) {
		this.form.gridAction(this.grid, e);
		this.formState.save(this);
	}
}

class FormParams extends GridFormParams {
	searchTxt: string;
	stateId: number = 0;
}
