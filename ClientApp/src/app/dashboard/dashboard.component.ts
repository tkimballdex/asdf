import { Component, ViewEncapsulation, OnInit, ViewChild, Injectable } from '@angular/core';
import { ChartComponent } from '@syncfusion/ej2-angular-charts';
import { AppService } from '../shared/app.service';
import { PageComponent } from '../shared/page.component';
import { DashboardRepository } from './repository';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DashboardComponent extends PageComponent implements OnInit {
	constructor(private repository: DashboardRepository, private appService: AppService) {
		super();
	}

	async ngOnInit() {
		this.app = await this.appService.getData();
		this.customers = await this.repository.listCustomers();
		this.variants = [];
		this.sites = [];

		var startDate = new Date();
		startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - 14);
		this.startDate = startDate;
	}

	@ViewChild('chartByLocation')
	public chartByLocation: ChartComponent;

	@ViewChild('chartByVariant')
	public chartByVariant: ChartComponent;

	@ViewChild('chartPositiveCases')
	public chartPositiveCases: ChartComponent;

	@ViewChild('tab')
	public tab: TabComponent;

	public customers: any;
	public customerId: string;
	public variantId: string;
	public variants: any;
	public sites: any;
	public siteId: string;
	public locations: any;
	public locationId: string;
	public analyteId: string;
	public graphData: any;
	public startDate: Date;
	public endDate: Date;
	public cellSpacing: number[] = [10, 10];
	public cellAspectRatio: number = 70 / 25;
	public allowDragging: boolean = false;
	public primaryXAxis: Object = {
		valueType: 'Category'
	}

	async customerChange() {
		this.sites = [];
		this.siteId = null;
		this.locations = null;
		this.locationId = null;
		this.sites = await this.repository.listSites(this.customerId);
		this.setGraphData();
	}

	async analyteChange() {
		this.variants = [];
		this.variants = await this.repository.listVariants(this.analyteId);
		this.setGraphData();
	}

	async siteChange() {
		this.locations = null;
		this.locationId = null;
		this.locations = await this.repository.listLocations(this.siteId);
		this.setGraphData();
	}

	async setGraphDataByLocation() {
		if (!this.chartByLocation) return;

		this.chartByLocation.clearSeries();
		if (!this.locationId || !this.analyteId) return;

		let graphData = await this.repository.locationVariants({
			locationId: this.locationId,
			analyteId: this.analyteId,
			startDate: this.startDate,
			endDate: this.endDate
		});

		graphData.forEach(x => { x.type = 'Line'; x.xName = 'x'; x.yName = 'y'; });
		this.chartByLocation.addSeries(graphData);
	}

	async setGraphDataByVariant() {
		if (!this.chartByVariant) return;

		this.chartByVariant.clearSeries();
		if (!this.customerId || !this.variantId) return;

		let graphData = await this.repository.variantLocations({
			customerId: this.customerId,
			variantId: this.variantId,
			startDate: this.startDate,
			endDate: this.endDate
		});

		graphData.forEach(x => { x.type = 'Line'; x.xName = 'x'; x.yName = 'y'; });
		this.chartByVariant.addSeries(graphData);
	}

	async setGraphDataByPositiveCases() {
		if (!this.chartPositiveCases) return;

		this.chartPositiveCases.clearSeries();
		if (!this.customerId || !this.analyteId) return;

		let graphData = await this.repository.positiveCases({
			customerId: this.customerId,
			analyteId: this.analyteId,
			startDate: this.startDate,
			endDate: this.endDate
		});

		graphData = [{ type: 'Line', xName: 'x', yName: 'y', dataSource: graphData }];
		this.chartPositiveCases.addSeries(graphData);
	}

	async setGraphData() {
		if (this.tab.selectedItem == 0) {
			await this.setGraphDataByLocation();
		}
		else if (this.tab.selectedItem == 1) {
			await this.setGraphDataByVariant();
		}
		else if (this.tab.selectedItem == 2) {
			await this.setGraphDataByPositiveCases();
		}
	}
}

