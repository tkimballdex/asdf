import { Injectable } from "@angular/core";
import { GridComponent, PageSettingsModel, SortSettingsModel } from '@syncfusion/ej2-angular-grids';

export class GridFormParams {
	public pageSettings: PageSettingsModel;
	public sortSettings: SortSettingsModel;
	public sortSettingsCurrent: SortSettingsModel;

	constructor() {
		this.pageSettings = { pageSizes: true, pageSize: 12, currentPage: 1 };
	}

	gridAction(grid: GridComponent, e) {
		this.pageSettings.currentPage = grid?.pagerModule.pagerObj.currentPage;

		if (e.requestType == 'sorting') {
			this.sortSettingsCurrent = e.columnName ? { columns: [{ field: e.columnName, direction: e.direction }] } : null;
		}
		else if (e.requestType == 'paging') {
			this.pageSettings.currentPage = grid?.pagerModule.pagerObj.currentPage;
			this.pageSettings.pageSize = grid?.pagerModule.pagerObj.pageSize;
		}
	}

	resetGrid(grid) {
		this.pageSettings.currentPage = grid.pagerModule.pagerObj.currentPage = 1;
	}
}

@Injectable({ providedIn: 'root' })
export class FormState {
	public componentState = {};
	public readonly GuidEmpty = "00000000-0000-0000-0000-000000000000";

	constructor() {
	}

	public save(page: any) {
		this.componentState[page.constructor.name] = page.form;
	}

	public get(page: any) {
		var form = this.componentState[page.constructor.name];

		if (form && form.sortSettingsCurrent) {
			form.sortSettings = form.sortSettingsCurrent;
		}

		return form;
	}

	public setup(page: any, form?: GridFormParams) {
		page.form = this.get(page);

		if (!page.form || !history.state.formState) {
			page.form = form || new GridFormParams();
		}
	}
}
