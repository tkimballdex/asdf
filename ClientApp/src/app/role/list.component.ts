import { Component, OnInit } from '@angular/core';
import { RoleRepository } from './repository';
import { TenantService } from '../shared/tenant.service';
import { PageComponent } from '../shared/page.component';
import { GridFormParams, FormState } from '../shared/formState';

@Component({
    selector: 'role-list',
    templateUrl: './list.component.html',
})
export class RoleListComponent extends PageComponent implements OnInit {
    constructor(private repository: RoleRepository, private tenant: TenantService, private formState: FormState) {
        super();
    }

    public form: FormParams;
    public list: any;

    async ngOnInit() {
        this.showSpinner();
        this.formState.setup(this, new FormParams());
        this.list = await this.repository.list({ tenantId: this.tenant.id, roleName: this.form.roleName });
        this.hideSpinner();
    }

    async search() {
        this.showSpinner();
        this.list = await this.repository.list({ tenantId: this.tenant.id, roleName: this.form.roleName });
        this.hideSpinner();
    }
}

class FormParams extends GridFormParams {
	roleName: string;
}

