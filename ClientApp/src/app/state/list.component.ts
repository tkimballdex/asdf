import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { StateRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppService } from '../shared/app.service';
import { TenantService } from '../shared/tenant.service';
import { GridFormParams, FormState } from '../shared/formState';

@Component({
    selector: 'state-list',
    templateUrl: './list.component.html',
})
export class StateListComponent extends PageComponent implements OnInit {
	constructor(private repository: StateRepository, private appService: AppService, private tenant: TenantService, private formState: FormState) {
        super();
    }

    public list: any;
	public form: FormParams;

	@ViewChild('grid') public grid: GridComponent;

    async ngOnInit() {
		this.app = await this.appService.getData();
		this.privileges = (await this.appService.getPrivileges()).states;
		
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
			countryId: this.form.countryId
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
	countryId: number = 1;
}
