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
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';

@NgModule({
	declarations: [
		NewsArticleListComponent,
		NewsArticleEditComponent
	],
	imports: [
		FormsModule, ReactiveFormsModule, GridModule, RadioButtonModule, ButtonModule, TextBoxModule, UploaderModule, 
		CheckBoxModule, ToastAllModule, DropDownListModule, DatePickerModule, CommonModule, TabModule, RichTextEditorModule,
		RouterModule.forChild([
			{ path: 'list', component: NewsArticleListComponent },
			{ path: 'add', component: NewsArticleEditComponent },
			{ path: 'edit/:id', component: NewsArticleEditComponent }
		])
	],
	providers: [
		PageService, SortService, EditService, ToolbarService, CommandColumnService
	]
})
export class NewsArticleModule { }
