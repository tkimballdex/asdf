import { Component, ViewEncapsulation, OnInit, ViewChild, Injectable } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ChartComponent } from '@syncfusion/ej2-angular-charts';
import { AppService } from '../shared/app.service';
import { PageComponent } from '../shared/page.component';
import { DashboardRepository } from './repository';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { CheckBoxSelectionService } from '@syncfusion/ej2-angular-dropdowns';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [CheckBoxSelectionService]
})
export class DashboardComponent extends PageComponent implements OnInit {
	public mode: string;
	constructor(private repository: DashboardRepository, private appService: AppService) {
		super();
	}

	async ngOnInit() {
		this.mode = 'CheckBox';
		this.app = await this.appService.getData();
		this.customers = await this.repository.listCustomers();
		this.variants = [];
		this.sites = [];

		this.analyteId = this.app.analytes[0].id;
		this.customerId = this.customers[0].id;
		await this.analyteChange();

		var today = new Date();
		this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
		this.siteMapDate = this.startDate;
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
	public customers: any;
	public customerId: string;
	public variantId: string;
	public variants: any;
	public sites: any;
	public analyteId: string;
	public graphData: any;
	public startDate: Date;
	public endDate: Date;
	public siteMapDate: Date;
	public cellSpacing: number[] = [10, 10];
	public cellAspectRatio: number = 70 / 25;
	public allowDragging: boolean = false;
	public placeholder: string = 'Site';

	public primaryXAxis: Object = {
		valueType: 'Category'
	}

	async customerChange() {
		this.sites = [];
		this.sites = await this.repository.listSites(this.customerId);
		this.selectedSites = this.sites.map(x => x.id);
		this.setGraphData();
	}

	async analyteChange() {
		this.variants = [];
		this.variants = await this.repository.listVariants(this.analyteId);
		if (this.variants.length > 0) this.variantId = this.variants[0].id;
		this.setGraphData();
	}

	async siteChange() {
		this.setGraphData();
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
			sites: this.selectedSites
		});

		graphData = [
			{ type: 'StackingColumn', xName: 'x', yName: 'negative', dataSource: graphData, name: 'Negative Cases' },
			{ type: 'StackingColumn', xName: 'x', yName: 'positive', dataSource: graphData, name: 'Positive Cases' }
			
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
			sites: this.selectedSites
		});

		let graphData: any = data.map(x => { return { type: 'StackingColumn', xName: 'x', yName: 'y', name: x.siteName, dataSource: x.results } });
		this.chartPositiveSites.addSeries(graphData);
	}

	setGraphData() {
		var $this = this;
		setTimeout(function () {
			if ($this.tab.selectedItem == 0) {
				$this.setGraphDataByVariant();
			}
			else if ($this.tab.selectedItem == 1) {
				$this.setGraphDataByPositiveCases();
			}
			else if ($this.tab.selectedItem == 2) {
				$this.setGraphDataByPositiveNegativeCases();
			}
			else if ($this.tab.selectedItem == 3) {
				$this.setGraphDataPositiveSites();
			}
			else if ($this.tab.selectedItem == 4) {
				$this.siteMapChange();
			}
		}, 10);
	}

	markers: google.maps.Marker[] = [];
	polygons: google.maps.Polygon[] = [];

	async siteMapChange() {
		if (!this.selectedSites || !this.siteMapDate) return;

		var googleMap = this.map.googleMap;

		const infoWindow = new google.maps.InfoWindow({
			content: 'WASHINGTON — President Biden and Democratic leaders in Congress in recent days have slashed their ambitions for a major expansion of America’s social safety net to a package worth $2.3 trillion or less, which will force hard choices about how to scale back a proposal that the president hopes will be transformational.'
		});

		this.markers.forEach(function (x) {
			x.setMap(null);
		});

		this.polygons.forEach(function (x) {
			x.setMap(null);
		});

		this.markers = [];
		this.polygons = [];
		var $this = this;

		$this.selectedSites.forEach(async function (siteId) {
			var site = await $this.repository.getSite({ siteId: siteId, analyteId: $this.analyteId, date: $this.siteMapDate });

			site.locations.forEach(function (x) {
				if (x.latitude && x.longitude) {
					const marker = new google.maps.Marker({
						position: { lat: x.latitude, lng: x.longitude },
						map: googleMap,
						title: x.name,
						label: x.name,
						icon: {
							url: `http://maps.google.com/mapfiles/ms/icons/${x.positive ? 'red' : x.negative ? 'blue' : 'yellow'}-dot.png`
						}
					});

					$this.markers.push(marker);

					marker.addListener('click', () => {
						infoWindow.open(googleMap, marker);
					});
				}
			});

			if (site.boundaries) {
				site.boundaries.forEach(function (boundaries) {
					$this.polygons.push(new google.maps.Polygon({
						map: googleMap,
						paths: boundaries,
						strokeColor: "#FF0000",
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: "#FF0000",
						fillOpacity: 0.35
					}));
				});
			}

			if ($this.markers.length) {
				googleMap.fitBounds($this.getBounds($this.markers));
			}
		});
	}

	getBounds(markers) {
		let north;
		let south;
		let east;
		let west;

		for (const marker of markers) {
			north = north !== undefined ? Math.max(north, marker.position.lat()) : marker.position.lat();
			south = south !== undefined ? Math.min(south, marker.position.lat()) : marker.position.lat();
			east = east !== undefined ? Math.max(east, marker.position.lng()) : marker.position.lng();
			west = west !== undefined ? Math.min(west, marker.position.lng()) : marker.position.lng();
		};

		return { north, south, east, west };
	}

	@ViewChild(GoogleMap) map!: GoogleMap;

	dateRangeChange() {
		this.siteMapDate = new Date(this.endDate);
		this.setGraphData();
	}

	previousSiteMapDate() {
		this.siteMapDate.setDate(this.siteMapDate.getDate() - 1);
		this.siteMapDate = new Date(this.siteMapDate < this.startDate ? this.endDate : this.siteMapDate);
	}

	nextSiteMapDate() {
		this.siteMapDate.setDate(this.siteMapDate.getDate() + 1);
		this.siteMapDate = new Date(this.siteMapDate > this.endDate ? this.startDate : this.siteMapDate);
	}
}

