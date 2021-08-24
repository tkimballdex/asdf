import { Component, ViewEncapsulation, OnInit, ViewChild, Injectable } from '@angular/core';
import { ChartComponent } from '@syncfusion/ej2-angular-charts';
import { AppService } from '../shared/app.service';
import { PageComponent } from '../shared/page.component';
import { DashboardRepository } from './repository';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent extends PageComponent implements OnInit {
	constructor(private repository: DashboardRepository, private appService: AppService, public variant: VariantVars) {
		super();
	}

	async ngOnInit() {
		this.app = await this.appService.getData();
		this.customers = await this.repository.listCustomers();

		var startDate = new Date();
		startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - 14);
		this.startDate = startDate;
	}

	@ViewChild('chart')
	public chart: ChartComponent;

	public customers: any;
	public customerId: string;
	public sites: any;
	public siteId: string;
	public locations: any;
	public locationId: string;
	public analyteId: string;
	public graphData: any;
	public startDate: Date;
	public endDate: Date;
    public cellSpacing: number[] = [10, 10];
    public cellAspectRatio: number = 70/25;
    public allowDragging: boolean = false;
    public primaryXAxis: Object = {
        valueType: 'Category'
    }

	@ViewChild('chartByLocation')
	public chartByLocation: ChartComponent;

	async customerChange() {
		this.sites = null;
		this.siteId = null;
		this.locations = null;
		this.locationId = null;
		this.sites = await this.repository.listSites(this.customerId);
	}

	async siteChange() {
		this.locations = null;
		this.locationId = null;
		this.locations = await this.repository.listLocations(this.siteId);
	}

	async getData() {
		this.chart.clearSeries();

		if (this.locationId && this.analyteId) {
			var graphData = await this.repository.locationVariants({
				locationId: this.locationId,
				analyteId: this.analyteId,
				startDate: this.startDate,
				endDate: this.endDate
			});

			graphData.forEach(x => { x.type = 'Line'; x.xName = 'x'; x.yName = 'y'; });
			this.chart.addSeries(graphData);
		}
	}

	async getDataByLocation() {
		this.chartByLocation.clearSeries();

		if (this.variant.customerId && this.variant.id) {
			var graphData = await this.repository.variantLocations({
				customerId: this.variant.customerId,
				variantId: this.variant.id,
				startDate: this.variant.startDate,
				endDate: this.variant.endDate
			});

			graphData.forEach(x => { x.type = 'Line'; x.xName = 'x'; x.yName = 'y'; });
			this.chartByLocation.addSeries(graphData);
		}
	}
}

@Injectable({ providedIn: 'root' })
class VariantVars {
	locations: any;
	list: any;
	id: string;
	customerId: string;
	analyteId: string;
	startDate: Date;
	endDate: Date;

	constructor(private repository: DashboardRepository) {
	}

	async setLocations() {
		this.locations = null;
		this.locations = await this.repository.listCustomerLocations(this.customerId);
	}

	async setVariantList() {
		this.list = null;
		this.list = await this.repository.listVariants(this.analyteId);
	}
}
