import { Component, ViewEncapsulation, OnInit, AfterViewChecked, ViewChild, Injectable } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ChartComponent } from '@syncfusion/ej2-angular-charts';
import { AppService, EventQueueService, AppEvent, AppEventType } from '../shared/app.service';
import { TenantService } from '../shared/tenant.service';
import { PageComponent } from '../shared/page.component';
import { DashboardRepository } from './repository';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { CheckBoxSelectionService } from '@syncfusion/ej2-angular-dropdowns';
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { SliderChangeEventArgs, SliderTickEventArgs, SliderTooltipEventArgs } from '@syncfusion/ej2-angular-inputs';
import html2canvas from 'html2canvas';
import { DateRangePicker } from '@syncfusion/ej2-angular-calendars';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [CheckBoxSelectionService]
})
export class DashboardComponent extends PageComponent implements OnInit, AfterViewChecked {
	public mode: string;
	public initialized = false;
	constructor(private repository: DashboardRepository, private appService: AppService, private tenant: TenantService, private eventQueue: EventQueueService) {
		super();
	}

	@ViewChild('dateRangePicker')
	public dateRangePicker: DateRangePicker;

	@ViewChild('chartPositiveCases')
	public chartPositiveCases: ChartComponent;

	@ViewChild('chartPositiveNegativeCases')
	public chartPositiveNegativeCases: ChartComponent;

	@ViewChild('chartPositiveSites')
	public chartPositiveSites: ChartComponent;

	@ViewChild('tab')
	public tab: TabComponent;

	public selectedSites: any;
	public data: any;
	public customerId: string;
	public sites: any;

	public analyteId: string;
	public graphData: any;
	public startDate: Date;
	public endDate: Date;
	public mapXSize: number = 12;
	public mapYSize: number = 6;
	public largeChartXSize: number = 12;
	public largeChartYSize: number = 6;
	public smallChartXSize: number = 6;
	public smallChartYSize: number = 5;
	public tileXSize: number = 3;
	public tileYSize: number = 2;

	public siteMapDate: Date;
	public cellSpacing: number[] = [20, 20];
	public cellAspectRatio: number = 100 / 60;
	public allowDragging: boolean = false;
	public placeholder: string = 'Site';
	public displaySummary = {};
	public tileData = {};
	public isCovid: boolean = false;
	public isWater: boolean = false;

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
	public primaryYAxis: Object = {
		valueType: 'Double',
		interval: 1
	}

	async ngOnInit() {
		var $this = this;
		this.mode = 'CheckBox';
		this.redColorPalette = ['#e35254'];
		this.greenColorPalette = ['#32bbae'];
		this.colorPalette = ['#ee5253', '#74b9ff', '#a29bfe', '#ff7675', '#fdcb6e'];
		this.app = await this.appService.getData();
		this.data = await this.repository.getData();
		this.sites = [];

		var today = new Date();
		this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
		this.tooltip = { enable: true };
		if (window.matchMedia("only screen and (max-width: 600px)").matches) {
			this.mapXSize = 2;
			this.mapYSize = 1;
			this.largeChartXSize = 4;
			this.largeChartYSize = 2;
			this.smallChartXSize = 4;
			this.smallChartYSize = 2;
			this.tileXSize = 2;
			this.tileYSize = 1;
		};

		this.analyteId = this.data.analytes[0].id;
		this.initialized = true;
		this.customerId = this.data.customers[0].id;
		await this.customerChange();
	}

	async ngAfterViewChecked() {
		if (this.dateRangePicker && !this.dateRangePicker.startDate) {
			this.dateRangePicker.startDate = this.startDate;
			this.dateRangePicker.endDate = this.endDate;
			this.dateRangeChange({ startDate: this.startDate, endDate: this.endDate });
		}
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
		this.chartPositiveCases.clearSeries();
		this.chartPositiveNegativeCases.clearSeries();
		this.chartPositiveSites.clearSeries();

		this.chartPositiveCases.addSeries([{ type: 'Column', xName: 'x', yName: 'y', dataSource: data.positiveCases }]);

		this.chartPositiveNegativeCases.addSeries([
			{ type: 'StackingColumn', xName: 'x', yName: 'positive', dataSource: data.positiveNegativeCases, name: 'Positive Cases', fill: '#e35254' },
			{ type: 'StackingColumn', xName: 'x', yName: 'negative', dataSource: data.positiveNegativeCases, name: 'Negative Cases', fill: '#32bbae' }
		]);

		this.chartPositiveSites.addSeries(data.positiveSiteStack.map(x => { return { type: 'StackingColumn', xName: 'x', yName: 'y', name: x.siteName, dataSource: x.results } }));
	}

	async setGraphData(from) {
		console.log(`setGraphData ${from} ${this.initialized}`);
		if (!this.initialized || !this.customerId || !this.analyteId || !this.selectedSites) return;

		await this.getSummary();

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

		this.setCharts(this.graphData);
	}

	markers: google.maps.Marker[] = [];
	polygons: google.maps.Polygon[] = [];

	getColor(positive, negative) {
		return positive ? '#e35254' : negative ? '#32bbae' : '#aaaaaa'
	}

	async getSummary() {
		if (!this.selectedSites || !this.siteMapDate || !this.initialized) return;
		var data = await this.repository.dailySummary({ customerId: this.customerId, sites: this.selectedSites, analyteId: this.analyteId, summaryDate: this.siteMapDate, startDate: this.startDate, endDate: this.endDate });
		this.displaySummary = data.dailySummary;
		this.tileData = data.tileData;
		this.isCovid = data.isCovid;
		this.isWater = data.isWater;
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

	dateRangeChange(e) {
		if (e && e.startDate && e.endDate) {
			this.startDate = this.getAdjustedDate(e.startDate);
			this.endDate = this.getAdjustedDate(e.endDate);
		}

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
		html2canvas(
			document.getElementById('default_dashboard'), {
			backgroundColor: null,
			useCORS: true
		}).then(canvas => {
			canvas.toBlob(x => this.downloadFile(x, 'dashboard.png'));
		});
	}
	//------------------------------------------------------------------------------------------------------------------------
	sendEmail(): void {
		var $this = this;

		html2canvas(
			document.getElementById('default_dashboard'), {
			backgroundColor: null,
			useCORS: true
		}).then(canvas => {
			canvas.toBlob(function (blob) {
				var emailList = [{ name: $this.app.userName, email: $this.app.email }];

				var reader = new window.FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = function () {
					var result: string = reader.result.toString().replace('data:image/png;base64,', '');
					$this.eventQueue.dispatch(new AppEvent(AppEventType.SendEmail, {
						subject: 'REMAPP Dashboard',
						body: 'Export of REMAPP dashboard as of ' + (new Date().toLocaleString()),
						emailList,
						attachment: { name: 'dashboard.png', blob: result }
					}));
				}
			});
		});
	}		
	//------------------------------------------------------------------------------------------------------------------------
	async communicate() {
		this.showSpinner();
		var returnValue = await this.repository.communicate({
			tenantId: this.tenant.id,
			customerId: this.customerId,
			analyteId: this.analyteId,
			testDate: this.siteMapDate
		});
		this.hideSpinner();

		if (returnValue && returnValue.error) {
			this.showErrorMessage(returnValue.description);
		}
		else {
			var success = returnValue && returnValue.updated;
			this.showSuccessMessage("Notifications & Alerts Sent!");
		}
	}
	//------------------------------------------------------------------------------------------------------------------------
}

