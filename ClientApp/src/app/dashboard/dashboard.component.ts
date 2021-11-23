import { Component, ViewEncapsulation, OnInit, ViewChild, Injectable } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ChartComponent } from '@syncfusion/ej2-angular-charts';
import { AppService } from '../shared/app.service';
import { PageComponent } from '../shared/page.component';
import { DashboardRepository } from './repository';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { CheckBoxSelectionService } from '@syncfusion/ej2-angular-dropdowns';
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { SliderChangeEventArgs, SliderTickEventArgs, SliderTooltipEventArgs } from '@syncfusion/ej2-angular-inputs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [CheckBoxSelectionService]
})
export class DashboardComponent extends PageComponent implements OnInit {
	public mode: string;
	public initialized = false;
	constructor(private repository: DashboardRepository, private appService: AppService) {
		super();
	}

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
	public sites: any;

	public customerchange: number =0;
	public countychange: number =-12;
	public statechange: number =0;

	public analyteId: string;
	public graphData: any;
	public startDate: Date;
	public endDate: Date;
	public siteMapDate: Date;
	public cellSpacing: number[] = [20, 20];
	public cellAspectRatio: number = 100 / 60;
	public allowDragging: boolean = false;
	public placeholder: string = 'Site';
	public displaySummary = {};

	public sliderTooltipData: Object = { placement: 'Before', isVisible: true };
    public sliderTicksData: Object = { placement: 'After', largeStep: 1 * 86400000 };
	public sliderStep: number = 86400000;
    public sliderMin: number;
    public sliderMax: number;    
    public sliderValue: number;


	public redColorPalette: string[];
	public greenColorPalette: string[];
	public colorPalette: string[];
	public tooltip: Object;

	public primaryXAxis: Object = {
		valueType: 'Category',
		majorGridLines: { width: 0 },
		labelRotation: 45
	}

	async ngOnInit() {
		var $this = this;
		this.mode = 'CheckBox';
		this.redColorPalette = ['#e35254'];
		this.greenColorPalette = ['#1abc9c'];
		this.colorPalette = ['#ee5253', '#74b9ff', '#a29bfe', '#ff7675', '#fdcb6e'];
		this.app = await this.appService.getData();
		this.customers = await this.repository.listCustomers();
		this.sites = [];

		var today = new Date();
		this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
		this.dateRangeChange();
		this.tooltip = { enable: true };

		this.analyteId = this.app.analytes[0].id;
		this.initialized = true;
		this.customerId = this.customers[0].id;
		await this.customerChange();
	}	

	tooltipChangeHandler(args: SliderTooltipEventArgs): void {
        let totalMiliSeconds = Number(args.text);
        // Converting the current milliseconds to the respective date in desired format
        //let custom = { year: "numeric", month: "2-digit", day: "2-digit" };
        args.text = new Date(totalMiliSeconds).toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" });
    }

    renderingTicksHandler(args: SliderTickEventArgs): void {
        let totalMiliSeconds = Number(args.value);
        // Converting the current milliseconds to the respective date in desired format
        //let custom = { year: "numeric", month: "short", day: "numeric" };
        args.text = new Date(totalMiliSeconds).toLocaleDateString("en-us", { month: "short", day: "numeric" });
    }

	async customerChange() {
		this.sites = [];
		this.sites = await this.repository.listSites(this.customerId);
		this.selectedSites = this.sites.map(x => x.id);
	}

	async analyteChange() {
		this.setGraphData('analyteChange');
	}

	async siteChange() {
		this.setGraphData('siteChange');
	}

	setCharts(data) {
		console.log('setCharts');
		this.chartPositiveCases.clearSeries();
		this.chartPositiveNegativeCases.clearSeries();
		this.chartPositiveSites.clearSeries();

		this.chartPositiveCases.addSeries([{ type: 'Column', xName: 'x', yName: 'y', dataSource: data.positiveCases }]);

		this.chartPositiveNegativeCases.addSeries([
			{ type: 'StackingColumn', xName: 'x', yName: 'positive', dataSource: data.positiveNegativeCases, name: 'Positive Cases', fill: '#e35254' },
			{ type: 'StackingColumn', xName: 'x', yName: 'negative', dataSource: data.positiveNegativeCases, name: 'Negative Cases', fill: '#1abc9c' }
		]);

		this.chartPositiveSites.addSeries(data.positiveSiteStack.map(x => { return { type: 'StackingColumn', xName: 'x', yName: 'y', name: x.siteName, dataSource: x.results } }));
	}

	async setGraphData(from) {
		console.log(`setGraphData ${from} ${this.initialized}`);
		if (!this.initialized || !this.customerId || !this.analyteId || !this.selectedSites) return;

		this.graphData = await this.repository.getGraphData({
			customerId: this.customerId,
			analyteId: this.analyteId,
			startDate: this.startDate,
			endDate: this.endDate,
			sites: this.selectedSites
		});

		var date = new Date(this.graphData.summaryDate);
		this.siteMapDate = this.getAdjustedDate(date);
		this.sliderValue = this.siteMapDate.getTime();

		await this.getSummary();
		this.setCharts(this.graphData);
	}

	markers: google.maps.Marker[] = [];
	polygons: google.maps.Polygon[] = [];

	getColor(positive, negative) {
		return positive ? '#e35254' : negative ? '#32bbae' : '#aaaaaa'
	}

	async getSummary() {
		if (!this.selectedSites || !this.siteMapDate || !this.initialized) return;
		var data = await this.repository.dailySummary({ customerId: this.customerId, sites: this.selectedSites, analyteId: this.analyteId, summaryDate: this.siteMapDate });
		this.displaySummary = data.dailySummary;
		this.siteMap(data.sites);
	}
	
	siteMap(sites) {
		var googleMap = this.map.googleMap;

		const mapStyles = <google.maps.MapTypeStyle[]> [
			{
				featureType: "poi",
				stylers: [{ visibility: "off" }],
			},
			{
				featureType: "transit",
				elementType: "labels.icon",
				stylers: [{ visibility: "off" }],
			}
		];		
		googleMap.setOptions({ styles: mapStyles, mapTypeControl: false, streetViewControl: false, scrollwheel: false });

		const infoWindow = new google.maps.InfoWindow({
			content: 'To Set'
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
		var points = [];

		sites.forEach(function (site) {
			site.locations.forEach(function (x) {
				if (x.latitude && x.longitude) {
					const marker = new google.maps.Marker({
						position: { lat: x.latitude, lng: x.longitude },
						map: googleMap,
						title: x.name,
						icon: {
							path: faCircle.icon[4] as string,
							fillColor: $this.getColor(x.positive, x.negative),
							fillOpacity: 1,
							anchor: new google.maps.Point(
								faCircle.icon[0] / 2, // width
								faCircle.icon[1] / 2 // height
							),
							strokeWeight: 2,
							strokeColor: "#ffffff",
							scale: 0.03,
						},
					});					

					$this.markers.push(marker);

					marker.addListener('click', () => {
						infoWindow.open(googleMap, marker);
					});

					points.push({ lat: x.latitude, lng: x.longitude });
				}
			});

			if (site.boundaries) {
				site.boundaries.forEach(function (boundaries) {
					$this.polygons.push(new google.maps.Polygon({
						map: googleMap,
						paths: boundaries,
						strokeColor: $this.getColor(site.positive, site.negative),
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: $this.getColor(site.positive, site.negative),
						fillOpacity: 0.6
					}));

					points = points.concat(boundaries);
				});
			}
		});

		if (points.length) {
			googleMap.fitBounds($this.getBounds(points));
		}
	}

	getBounds(points) {
		let north;
		let south;
		let east;
		let west;

		for (const point of points) {
			north = north !== undefined ? Math.max(north, point.lat) : point.lat;
			south = south !== undefined ? Math.min(south, point.lat) : point.lat;
			east = east !== undefined ? Math.max(east, point.lng) : point.lng;
			west = west !== undefined ? Math.min(west, point.lng) : point.lng;
		};

		return { north, south, east, west };
	}

	@ViewChild(GoogleMap) map!: GoogleMap;

	getAdjustedDate(date: Date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
	}

	dateRangeChange() {
		this.startDate = this.getAdjustedDate(this.startDate);
		this.endDate = this.getAdjustedDate(this.endDate);

		this.siteMapDate = this.endDate;
		this.sliderMax = this.endDate.getTime();
		this.sliderMin = this.startDate.getTime();
		this.sliderValue = this.sliderMax;
		this.setGraphData('dateRangeChange');
	}

	onSliderChanged(args: SliderChangeEventArgs): void {
        this.siteMapDate = new Date(+args.value);
		this.getSummary();
	}

	export() {
		this.chartPositiveCases.exportModule.export('PDF', 'Dashboard', 1, [this.chartPositiveNegativeCases, this.chartPositiveCases, this.chartPositiveSites]);
	}
}

