import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { SampleTestRepository } from './repository';
import { TenantService } from '../shared/tenant.service';

@Component({
    selector: 'sampletest-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class SampleTestEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: SampleTestRepository) {
        super();
	}

	public customers: any;
	public customerId: string;
	public sites: any;
	public siteId: string;
	public locations: any;
	public locationId: any;
	public samples: any;

    public record: any;
	public deleteDialog: Dialog;
	public variants: any;
	public data: any;

    //-----------------------------------------------------------------------------------------
    async ngOnInit() {       
        this.showSpinner();
        this.app = await this.appService.getData();
        this.privileges = this.app.privileges.tests;

		var id = this.route.snapshot.paramMap.get('id');
		var sampleId = this.route.snapshot.paramMap.get('sampleId');

		if (id) {
			this.data = await this.repository.get(id);
			this.record = this.data.record;
			this.record.variants = this.data.variants;
		}
		else if (sampleId) {
			var sample = await this.repository.getSample(sampleId);
			this.record = {
				sampleId: sampleId,
				customer: sample.customer,
				location: sample.location,
				site: sample.site,
				sample: sample.name
			}
		}
		else {
			this.record = {};
			this.customers = await this.repository.listCustomers();
		}

		this.hideSpinner();        
    }
    //-----------------------------------------------------------------------------------------
    async save() {
        var add = !this.record.id;
        this.showSpinner();
		this.record.tenantId = this.tenant.id;
        var returnValue = await this.repository.save(this.record);
        this.hideSpinner();

        if (returnValue && returnValue.error) {
            this.showErrorMessage(returnValue.description);
        }
        else {
            var success = returnValue && returnValue.updated === true;
            this.showSaveMessage(success);

            if (success && add) {
                setTimeout(() => this.router.navigate(['/auth/sampletest/edit', returnValue.id]), 1000);
            }
        }
    }
    //-----------------------------------------------------------------------------------------
    delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete Test',
            content: `Are you sure you want to delete the test <b>${this.record.referenceNo}</b>?`,
            okButton: { click: this.deleteOK.bind(this) }
        });
    }
    //-----------------------------------------------------------------------------------------
    async deleteOK() {
        this.showSpinner();
        this.deleteDialog.close();
        var result = await this.repository.delete(this.record.id);
        this.hideSpinner();

        if (result.error) {
            this.showErrorMessage(result.description);
        }
        else {
            this.showDeleteMessage(true);
            setTimeout(() => this.router.navigate(['/auth/sampletest/list']), 1000);
        }
	}

	async customerChange() {
		this.sites = [];
		this.siteId = null;
		this.locations = null;
		this.locationId = null;
		this.samples = null;
		this.record.sampleId = null;
		this.sites = await this.repository.listSites(this.customerId);
	}

	async siteChange() {
		this.locations = null;
		this.locationId = null;
		this.samples = null;
		this.record.sampleId = null;
		this.locations = await this.repository.listLocations(this.siteId);
	}

	async locationChange() {
		this.samples = null;
		this.record.sampleId = null;
		this.samples = await this.repository.listSamples(this.locationId);
	}
    //-----------------------------------------------------------------------------------------
}
