import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class NewsArticleRepository {
	constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/newsArticle/save`, record);
    }

    public delete(id: string) {
		return this.http.post<boolean>(`/newsArticle/delete/${id}`);
    }

    public get(id: string) {
		return this.http.post(`/newsArticle/get/${id}`);
    }

    public list(filter: any) {
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
}
