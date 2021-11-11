import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DemographicsdataRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppService } from '../shared/app.service';
import { TenantService } from '../shared/tenant.service';
import { GridFormParams, FormState } from '../shared/formState';

@Component({
    selector: 'demographicsdata-list',
    templateUrl: './list.component.html',
})
export class DemographicsdataListComponent extends PageComponent implements OnInit {
	constructor(private repository: DemographicsdataRepository, private appService: AppService, private tenant: TenantService, private formState: FormState) {
        super();
    }

    public list: any;
	public form: FormParams;

	@ViewChild('grid') public grid: GridComponent;

    async ngOnInit() {
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
}

class FormParams extends GridFormParams {
	name: string;
	active: number = 1;
}