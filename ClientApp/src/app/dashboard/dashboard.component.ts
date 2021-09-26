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
		this.analyteId = this.app.analytes[0].id;

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

	@ViewChild('chartPositiveNegativeCases')
	public chartPositiveNegativeCases: ChartComponent;

	@ViewChild('chartPositiveSites')
	public chartPositiveSites: ChartComponent;

	@ViewChild('tab')
	public tab: TabComponent;

	public selectedSites: any;
	public selectedSitesPositiveNegative: any;
	public selectedSitesPositive: any;
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

	public marker: Object = {
        visible: true,
        height: 10,
        width: 10
    };
    public tooltip: Object = {
        enable: true,
        header: 'Profit'
    };

	async customerChange() {
		this.sites = [];
		this.siteId = null;
		this.locations = null;
		this.locationId = null;
		this.sites = await this.repository.listSites(this.customerId);
		this.selectedSites = this.sites.map(x => x.id);
		this.selectedSitesPositiveNegative = this.sites.map(x => x.id);
		this.selectedSitesPositive = this.sites.map(x => x.id);
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

		graphData.forEach(x => { x.type = 'Spline'; x.xName = 'x'; x.yName = 'y'; x.marker = this.marker; x.tooltip = this.tooltip });
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

		graphData.forEach(x => { x.type = 'Spline'; x.xName = 'x'; x.yName = 'y'; });
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
			endDate: this.endDate,
			sites: this.selectedSites
		});

		graphData = [{ type: 'Column', xName: 'x', yName: 'y', dataSource: graphData }];
		this.chartPositiveCases.addSeries(graphData);
	}

	async setGraphDataByPositiveNegativeCases() {
		if (!this.chartPositiveNegativeCases) return;

		this.chartPositiveNegativeCases.clearSeries();
		if (!this.customerId || !this.analyteId) return;

		let graphData = await this.repository.positiveNegativeCases({
			customerId: this.customerId,
			analyteId: this.analyteId,
			startDate: this.startDate,
			endDate: this.endDate,
			sites: this.selectedSitesPositiveNegative
		});

		graphData = [
			{ type: 'StackingColumn', xName: 'x', yName: 'positive', dataSource: graphData, name: 'Positive Cases' },
			{ type: 'StackingColumn', xName: 'x', yName: 'negative', dataSource: graphData, name: 'Negative Cases' }
		];
		this.chartPositiveNegativeCases.addSeries(graphData);
	}

	async setGraphDataPositiveSites() {
		if (!this.chartPositiveSites) return;

		this.chartPositiveSites.clearSeries();
		if (!this.customerId || !this.analyteId) return;

		let data = await this.repository.positiveSiteStack({
			customerId: this.customerId,
			analyteId: this.analyteId,
			startDate: this.startDate,
			endDate: this.endDate,
			sites: this.selectedSitesPositive
		});

		let graphData: any = data.map(x => { return { type: 'StackingColumn', xName: 'x', yName: 'y', name: x.siteName, dataSource: x.results } });
		this.chartPositiveSites.addSeries(graphData);
	}

	setGraphData() {
		var $this = this;
		setTimeout(function () {
			if ($this.tab.selectedItem == 0) {
				$this.setGraphDataByLocation();
			}
			else if ($this.tab.selectedItem == 1) {
				$this.setGraphDataByVariant();
			}
			else if ($this.tab.selectedItem == 2) {
				$this.setGraphDataByPositiveCases();
			}
			else if ($this.tab.selectedItem == 3) {
				$this.setGraphDataByPositiveNegativeCases();
			}
			else if ($this.tab.selectedItem == 4) {
				$this.setGraphDataPositiveSites();
			}
		}, 10);
	}
}

