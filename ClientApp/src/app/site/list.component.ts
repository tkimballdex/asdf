import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { SiteRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { GridFormParams, FormState } from '../shared/formState';
import { AppService } from '../shared/app.service';

@Component({
    selector: 'site-list',
    templateUrl: './list.component.html',
})
export class SiteListComponent extends PageComponent implements OnInit {
	constructor(private repository: SiteRepository, private tenant: TenantService, public appService: AppService, private formState: FormState) {
        super();
    }

	public form: FormParams;
	public list: any;
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
