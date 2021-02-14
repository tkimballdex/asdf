import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../shared/page.component';
import { Router } from "@angular/router";
import { TenantService } from '../shared/tenant.service';

@Component({
  selector: 'app-home',
  templateUrl: './tenant.component.html',
})
export class ChooseTenantComponent extends PageComponent implements OnInit {
	constructor(private router: Router, private tenant: TenantService) {
        super();
    }

	public tenantList: any;
	public tenantId: string;

    async ngOnInit() {
		this.tenantList = await this.tenant.getList();
		this.tenantId = this.tenant.id;
    }

	public changeTenant() {
        var t = this.tenantList.find(x => x.id == this.tenantId);
		this.tenant.set(t);
        setTimeout(() => this.router.navigate(['/auth']), 1000);
    }
}
