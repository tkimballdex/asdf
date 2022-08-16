import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMap } from '@angular/google-maps';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { TenantService } from '../shared/tenant.service';
import { LocationRepository } from './repository';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'location-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class LocationEditComponent extends PageComponent implements OnInit {
	constructor(private fb:FormBuilder, private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: LocationRepository, private tenant: TenantService) {
        super();
    }
	//-----------------------------------------------------------------------------------------------
	public record: any;
	public data: any;
    public deleteDialog: Dialog;
    public form: FormGroup;
    @ViewChild('grid') public grid: GridComponent;
	@ViewChild('ServiceStartDate') public ServiceStartDate;
	@ViewChild('ServiceEndDate') public ServiceEndDate;
	@ViewChild('map') map!: GoogleMap;
	private siteMarker: google.maps.Marker;
	public mapOptions: google.maps.MapOptions;
	public siteAndCustomer: any;
	public logisticVendors: any;
	public labVendors: any;
	public logisticVendorInt: number = 3;
	public labVendorInt: number = 2;
	public activeVendorInt: number = 1;
	//-----------------------------------------------------------------------------------------------
	async ngOnInit() {
		this.privileges = (await this.appService.getPrivileges()).locations;
		var id = this.route.snapshot.paramMap.get('id');
		
		this.showSpinner();
		this.app = await this.appService.getData();

		if (id == null) {
			var siteId = this.route.snapshot.paramMap.get('siteId');
			this.record = {
				siteId: siteId,
				active: true
			};
		}
		else {
			this.record = await this.repository.get(id);
		}

		this.record.serviceStartDate = this.appService.getNullableDate(this.record.serviceStartDate);
		this.record.serviceEndDate = this.appService.getNullableDate(this.record.serviceEndDate);
		this.data = await this.repository.getData(this.record.siteId);
		this.logisticVendors = await this.repository.listVendors({ tenantId: this.tenant.id, vendorTypeId: this.logisticVendorInt, active: this.activeVendorInt });
		this.labVendors = await this.repository.listVendors({ tenantId: this.tenant.id, vendorTypeId: this.labVendorInt, active: this.activeVendorInt });
		this.hideSpinner();

		this.form = new FormGroup({
			name: new FormControl(this.record.name, [Validators.required]),
			code: new FormControl(this.record.code, [Validators.required]),
			frequencyId: new FormControl(this.record.frequencyId, [Validators.required])
		});

		if(id == null)
		{
			this.record.siteName = this.data.siteName;
			this.record.customerName = this.data.customerName;
		}

		var $this = this;

		if ($this.data.latitude && $this.data.longitude) {
			const hasPosition = $this.record.latitude && $this.record.longitude;
			$this.mapOptions = { center: { lat: $this.data.latitude, lng: $this.data.longitude } };

			setTimeout(function () {
				const googleMap = $this.map.googleMap;

				googleMap.setOptions({ mapTypeControl: true, streetViewControl: false, });

				if (hasPosition) {
					$this.siteMarker = new google.maps.Marker({
						position: { lat: $this.record.latitude, lng: $this.record.longitude },
						map: $this.map.googleMap,
						label: $this.record.name
					});
				}

				googleMap.addListener('click', function (event) {
					$this.record.latitude = event.latLng.lat().toPrecision(9);
					$this.record.longitude = event.latLng.lng().toPrecision(9);

					if ($this.siteMarker) {
						$this.siteMarker.setMap(null);
					}

					$this.siteMarker = new google.maps.Marker({
						position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
						map: googleMap,
						label: $this.record.name
					});
				});

				if ($this.data.boundaries) {
					var boundaries = JSON.parse($this.data.boundaries);

					boundaries = boundaries.map(function (x) {
						return x.map(function (y) {
							return { lat: y[1], lng: y[0] };
						});
					});

					boundaries.forEach(function (boundaries) {
						new google.maps.Polygon({
							map: googleMap,
							paths: boundaries,
							strokeColor: "#FF0000",
							strokeOpacity: 0.8,
							strokeWeight: 2,
							fillColor: "#FF0000",
							fillOpacity: 0.35
						});
					});

					googleMap.fitBounds($this.getBounds(boundaries));
				}
			}, 0);
		}
	}
	//-----------------------------------------------------------------------------------------------
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
	//-----------------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!");
			return;
		}

		Object.assign(this.record, this.form.value);

		this.record.latitude = parseFloat(this.record.latitude);
		this.record.longitude = parseFloat(this.record.longitude);

		var add = !this.record.id;
		this.record.tenantId = this.tenant.id;
		this.showSpinner();
		var returnValue = await this.repository.save(this.record);
		this.hideSpinner();

		if (returnValue && returnValue.error) {
			this.showErrorMessage(returnValue.description);
		}
		else {
			var success = returnValue && returnValue.updated;
			this.showSaveMessage(success);

			if (success) {
				this.record = returnValue;
			}

			if (success && add) {
				this.record.id = returnValue.id;
				history.pushState('', '', `/auth/location/edit/${returnValue.id}`);
			}
		}
	}
	//-----------------------------------------------------------------------------------------------
    delete() {
        this.deleteDialog = DialogUtility.confirm({
            title: 'Delete Location',
            content: `Are you sure you want to delete the location <b>${this.record.name}</b>?`,
            okButton: { click: this.deleteOK.bind(this) }
        });
    }
	//-----------------------------------------------------------------------------------------------
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
            setTimeout(() => this.router.navigate(['/auth/site/edit', this.record.siteId]), 1000);
        }
    }
	//-----------------------------------------------------------------------------------------------
	close() {
		if (history.state.from == 'locations') {
			this.router.navigate(['/auth/location/list'], { state: { formState: true } });
		}
		else {
			this.router.navigate(['/auth/site/edit', this.record.siteId], { state: { locations: true } });
		}
	}
	//-----------------------------------------------------------------------------------------------
}
