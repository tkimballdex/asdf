import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { NewsArticleRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppService } from '../shared/app.service';

@Component({
	selector: 'NewsArticle-list',
	templateUrl: './list.component.html',
})
export class NewsArticleListComponent extends PageComponent implements OnInit {
	constructor(private appService: AppService, private repository: NewsArticleRepository) {
		super();
	}
	//----------------------------------------------------------------------------
	public form: FormParams;
	public list: any;
	@ViewChild('grid') public grid: GridComponent;
	//----------------------------------------------------------------------------
	async ngOnInit() {
		this.app = await this.appService.getData();
		this.privileges = (await this.appService.getPrivileges()).newsArticles;
		this.form = this.appService.getFormState(this);

		if (this.form && history.state.formState) {
			this.search();
		}
		else {
			this.form = new FormParams();
		}
	}
	//----------------------------------------------------------------------------
	async search() {
		this.appService.saveFormState(this);
		this.showSpinner();
		this.list = await this.repository.list({ title: this.form.title, startDate: this.form.startDate, endDate: this.form.endDate });
		this.hideSpinner();
	}
	//----------------------------------------------------------------------------
	clickGrid() {
		this.form.pageSettings.currentPage = this.grid.pagerModule.pagerObj.currentPage;
		this.appService.saveFormState(this);
	}
}
///////////////////////////////////////////////////////////////////////////////////
class FormParams {
	constructor() {
		this.title = "";

		var today = new Date();
		this.endDate = new Date(today.getFullYear(), today.getMonth()+4, 0);
		this.pageSettings = { pageSizes: true, pageCount: 5, currentPage: 1 };
	}

	public tenantId: string;
    public title: string;
	public startDate: Date;
    public endDate: Date;
	public pageSettings: PageSettingsModel;
}
///////////////////////////////////////////////////////////////////////////////////
