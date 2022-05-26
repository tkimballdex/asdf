import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { SiteRepository } from './repository';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
	selector: 'site-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class SiteEditComponent extends PageComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private tenant: TenantService, private repository: SiteRepository) {
		super();
	}

	public counties: any;
	public record: any;
	public deleteDialog: Dialog;
	public form: FormGroup;

	@ViewChild('editTab')
	public editTab: TabComponent;

	@ViewChild('map') map!: GoogleMap;
	private siteMarker: google.maps.Marker;
	public mapOptions: google.maps.MapOptions;
	markers: google.maps.Marker[] = [];
	polygons: google.maps.Polygon[] = [];

	editTabCreated() {
		if (history.state.locations) {
			this.editTab.selectedItem = 1;
		}
	}

	async ngOnInit() {
		this.showSpinner();
		this.app = await this.appService.getData();
		this.privileges = this.app.privileges.sites;

		var id = this.route.snapshot.paramMap.get('id');
		var customerId = this.route.snapshot.paramMap.get('customerId');

		if (id == null) {
			var customer = await this.repository.getCustomer(customerId);
			this.record = {
				customerId: customerId,
				customer: customer.name,
				active: true
			}
		}
		else {
			this.record = await this.repository.get(id);
			this.counties = await this.repository.getCounties(this.record.stateId)
		}

		this.hideSpinner();

		this.form = new FormGroup({
			name: new FormControl(this.record.name, [Validators.required]),
			serviceStartDate: new FormControl(this.record.serviceStartDate ? new Date(this.record.serviceStartDate) : null),
			serviceEndDate: new FormControl(this.record.serviceEndDate ? new Date(this.record.serviceEndDate) : null),
			address: new FormControl(this.record.address, [Validators.required]),
			city: new FormControl(this.record.city, [Validators.required]),
			stateId: new FormControl(this.record.stateId, [Validators.required]),
			postalCode: new FormControl(this.record.postalCode, [Validators.required]),
			countyId: new FormControl(this.record.countyId),
			contactName: new FormControl(this.record.contactName, [Validators.required]),
			contactEmail: new FormControl(this.record.contactEmail, [Validators.required, Validators.email]),
			contactPhoneNo: new FormControl(this.record.contactPhoneNo, [Validators.required, Validators.maxLength(10)])
		});
	}

	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!");
			return;
		}

		Object.assign(this.record, this.form.value);

		var add = !this.record.id;
		this.showSpinner();
		this.record.tenantId = this.tenant.id;

		try {
			var returnValue = await this.repository.save(this.record);
		}
		finally {
			this.hideSpinner();
		}

		if (returnValue && returnValue.error) {
			this.showErrorMessage(returnValue.description);
			return;

		}

		var success = returnValue && returnValue.updated;
		this.showSaveMessage(success);

		if (success) {
			this.record = returnValue;
		}

		if (success && add) {
			this.record.id = returnValue.id;
			history.pushState('', '', `/auth/site/edit/${returnValue.id}`);
		}

		this.mapSetup();
	}

	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete Site',
			content: `Are you sure you want to delete the site <b>${this.record.name}</b>?`,
			okButton: { click: this.deleteOK.bind(this) }
		});
	}

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
			setTimeout(() => this.router.navigate(['/auth/customer/edit', this.record.customerId]), 1000);
		}
	}

	async stateChange(e) {
		this.counties = null;
		this.counties = await this.repository.getCounties(e.itemData.id);
	}

	selectTab(e) {
		if (this.editTab.selectedItem == 1) {
			this.mapSetup();
		}
	}

	mapSetup() {
		var $this = this;

		if (!$this.record.id) {
			return;
		}

		if ($this.record.latitude && $this.record.longitude) {
			$this.mapOptions = { center: { lat: +$this.record.latitude, lng: +$this.record.longitude } };
		}

		$this.markers.forEach(function (x) {
			x.setMap(null);
		});

		$this.polygons.forEach(function (x) {
			x.setMap(null);
		});

		$this.markers = [];
		$this.polygons = [];

		setTimeout(function () {
			var googleMap = $this.map?.googleMap;

			$this.record.locations.forEach(function (x) {
				if (x.latitude && x.longitude) {
					$this.markers.push(new google.maps.Marker({
						position: { lat: x.latitude, lng: x.longitude },
						map: googleMap,
						label: x.name
					}));
				}
			});

			if ($this.record.boundaries) {
				var boundaries = JSON.parse($this.record.boundaries);

				boundaries = boundaries.map(function (x) {
					return x.map(function (y) {
						return { lat: y[1], lng: y[0] };
					});
				});

				boundaries.forEach(function (boundaries) {
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

				googleMap.fitBounds($this.getBounds(boundaries));
			}

			const drawingManager = new google.maps.drawing.DrawingManager({
				drawingMode: null,
				drawingControl: true,
				drawingControlOptions: {
					position: google.maps.ControlPosition.TOP_CENTER,
					drawingModes: [
						google.maps.drawing.OverlayType.POLYGON
					]
				}
			});

			drawingManager.setMap(googleMap);

			google.maps.event.addListener(drawingManager, 'polygoncomplete', function (event) {
				$this.polygons.forEach(function (x) {
					x.setMap(null);
				});

				$this.polygons = [event];
				$this.record.path = event.getPath().getArray().map(x => { return [x.lng(), x.lat()]; });
			});

		}, 0);
	}

	getBounds(boundaries) {
		let north;
		let south;
		let east;
		let west;

		for (const polygon of boundaries) {
			for (const point of polygon) {
				north = north !== undefined ? Math.max(north, point.lat) : point.lat;
				south = south !== undefined ? Math.min(south, point.lat) : point.lat;
				east = east !== undefined ? Math.max(east, point.lng) : point.lng;
				west = west !== undefined ? Math.min(west, point.lng) : point.lng;
			};
		};

		return { north, south, east, west };
	}

	close() {
		if (history.state.from == 'sites') {
			this.router.navigate(['/auth/site/list'], { state: { formState: true } });
		}
		else {
			this.router.navigate(['/auth/customer/edit', this.record.customerId], { state: { sites: true } });
		}
	}
}
