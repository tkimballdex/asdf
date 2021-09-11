import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogUtility, Dialog } from '@syncfusion/ej2-popups';
import { AppService } from "../shared/app.service";
import { PageComponent } from '../shared/page.component';
import { NewsArticleRepository } from './repository';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
	selector: 'NewsArticle-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss'],
	providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class NewsArticleEditComponent extends PageComponent implements OnInit {
	constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private appService: AppService, private repository: NewsArticleRepository) {
		super();
	}
	//-------------------------------------------------------------------------------------------
	public form: FormGroup;
	public record: any;
	public deleteDialog: Dialog;
	public propertyAccounts: any;
	public tenants: any;
	public accessToken: string;
	public documentUrl: string;
	@ViewChild('grid') public grid: GridComponent;
	//-------------------------------------------------------------------------------------------
	public uploadSettings = {
		saveUrl: this.appService.getFullUrl('/newsArticleDocument/upload')
	};
	//-------------------------------------------------------------------------------------------
	async ngOnInit() {
		this.app = await this.appService.getData();
		this.privileges = (await this.appService.getPrivileges()).newsArticles;
		this.accessToken = await this.appService.getAccessToken();

		var id = this.route.snapshot.paramMap.get('id');

		if (id) {
			this.record = await this.repository.get(id);
			this.setDocument();
		}
		else {
			var today = new Date();
			this.record = {
				publishedDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
			};
		}

		this.form = this.fb.group({
			title: [this.record.title, [Validators.required]],
			publishedDate: [this.record.publishedDate, [Validators.required]],
			description: [this.record.description, [Validators.required]],
			body: [this.record.body, [Validators.required]]
		});
	}
	//-------------------------------------------------------------------------------------------
	async save() {
		this.form.markAllAsTouched();		

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!")
			return;
		}

		Object.assign(this.record, this.form.value);

		var add = !this.record.id;
		this.showSpinner();
		var returnValue = await this.repository.save(this.record);
		this.hideSpinner();

		if (returnValue && returnValue.error) {
			this.showErrorMessage(returnValue.description);
		}
		else {
			var success = returnValue && returnValue.updated;
			this.showSaveMessage(success);

			if (success && add) {
				setTimeout(() => this.router.navigate(['/auth/newsArticle/edit', returnValue.id]), 1000);
			}
		}
	}
	//-------------------------------------------------------------------------------------------
	delete() {
		this.deleteDialog = DialogUtility.confirm({
			title: 'Delete News Article',
			content: `Are you sure you want to delete the news article <b>${this.record.title}</b>?`,
			okButton: { click: this.deleteOK.bind(this) }
		});
	}
	//-------------------------------------------------------------------------------------------
	async deleteOK() {
		this.showSpinner();
		this.deleteDialog.close();
		var success = await this.repository.delete(this.record.id);
		this.hideSpinner();
		this.showDeleteMessage(success);

		if (success) {
			setTimeout(() => this.router.navigate(['/auth/newsArticle/list'], { state: { formState: true } }), 1000);
		}
	}
	//-------------------------------------------------------------------------------------------
	async setDocument() {
		if (this.record.documentId) {
			this.record.documentUrl = this.appService.getFullUrl(`/newsArticleDocument/get/${this.record.documentId}`);
		}
	}
	//-------------------------------------------------------------------------------------------
	onUpload(args: any) {
		this.record.documentUrl = null;
		args.currentRequest.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
		args.customFormData = [{ 'id': this.record.id }, { 'name': args.fileData.name }];
	}
	//-------------------------------------------------------------------------------------------
	async onUploadSuccess(e) {
		this.record = await this.repository.get(this.record.id);
		this.setDocument();
	}
	//-------------------------------------------------------------------------------------------
	async downloadDocument(file: any) {
		var blob = await this.repository.downloadDocument(file.id);
		this.downloadFile(blob, file.name);
	}
	//-------------------------------------------------------------------------------------------
	async deleteDocument(file: any) {
		var result = await this.repository.deleteDocument(file.id);
		if (result === true) {
			this.setDocument();
		}
		else {
			this.showErrorMessage("Unable to delete document");
		}
	}	
	//-------------------------------------------------------------------------------------------
}
