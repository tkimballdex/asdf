import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties, ExcelExportService, Column, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { PageComponent } from '../shared/page.component';
import { AppService } from '../shared/app.service';

@Component({
    selector: 'sample-import',
    templateUrl: './import.component.html',
})
export class SampleTestImportComponent extends PageComponent implements OnInit {

	constructor(private appService: AppService) {
        super();
    }
    //------------------------------------------------------------------------------------------------------------------------
    public result: any;
    public dateFormat: any;
	public accessToken: string;
   @ViewChild('grid') public grid: GridComponent;
	//-------------------------------------------------------------------------------------------
	public uploadSettings = {
		saveUrl: this.appService.getFullUrl('/sampletestImport/upload')
	};
   //------------------------------------------------------------------------------------------------------------------------
    async ngOnInit() {
        this.dateFormat = {type:'date', format:'MM/dd/yyyy'};
		this.accessToken = await this.appService.getAccessToken();
    }
	//-------------------------------------------------------------------------------------------
	onUpload(args: any) {
		args.currentRequest.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
		args.customFormData = [{ 'userId': this.accessToken }, { 'name': args.fileData.name }];
		this.result = null;
	}
	//-------------------------------------------------------------------------------------------
	async onUploadSuccess(args) {
		this.result = JSON.parse(args.e.currentTarget.response);
	}
   //------------------------------------------------------------------------------------------------------------------------
}
