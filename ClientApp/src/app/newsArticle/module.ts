import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsArticleListComponent } from './list.component';
import { NewsArticleEditComponent } from './edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RadioButtonModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GridModule, SortService, PageService, EditService, ToolbarService, CommandColumnService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule, ListBoxAllModule, CheckBoxSelectionService } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';

@NgModule({
	declarations: [
		NewsArticleListComponent,
		NewsArticleEditComponent
	],
	imports: [
		FormsModule, ReactiveFormsModule, GridModule, RadioButtonModule, ButtonModule, ToolbarModule, TooltipModule, TextBoxModule, UploaderModule, 
		CheckBoxModule, ToastAllModule, DropDownListModule, ListViewModule, ListBoxAllModule, DatePickerModule, CommonModule, TabModule, RichTextEditorModule,
		RouterModule.forChild([
			{ path: 'list', component: NewsArticleListComponent },
			{ path: 'add', component: NewsArticleEditComponent },
			{ path: 'edit/:id', component: NewsArticleEditComponent }
		])
	],
	providers: [
		PageService, SortService, EditService, ToolbarService, CommandColumnService, CheckBoxSelectionService
	]
})
export class NewsArticleModule { }
