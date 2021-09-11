import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';
import { TenantService } from '../shared/tenant.service';

@Injectable({ providedIn: 'root' })
export class NewsArticleRepository {
	constructor(private http: MsalHttpClient, private tenant: TenantService) {
	}

	public save(record: any) {
		record.tenantId = this.tenant.id;
		return this.http.post<any>(`/newsArticle/save`, record);
	}

	public delete(id: string) {
		return this.http.post<boolean>(`/newsArticle/delete/${id}`);
	}

	public get(id: string) {
		return this.http.post(`/newsArticle/get/${id}`);
	}

	public list(filter: any) {
		filter.tenantId = this.tenant.id;
		return this.http.post(`/newsArticle/list`, filter);
	}

	public listDocuments(id: string) {
		return this.http.post(`/newsArticleDocument/list/${id}`);
	}

	public downloadDocument(id: string) {
		return this.http.postBlob(`/newsArticleDocument/get/${id}`, null);
	}

	public deleteDocument(id: string) {
		return this.http.post<boolean>(`/newsArticleDocument/delete/${id}`);
	}

	public listCustomers() {
		return this.http.post(`/customer/list`, {
			tenantId: this.tenant.id
		});
	}
}
