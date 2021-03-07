import { Component, OnInit } from '@angular/core';
import { SmsRepository } from './repository';
import { AppService } from '../shared/app.service';
import { PageComponent } from '../shared/page.component';

@Component({
    selector: 'app-sms',
    templateUrl: './sms.component.html'
})
export class SmsComponent extends PageComponent implements OnInit {
	constructor(private appService: AppService, private repository: SmsRepository) {
        super();
    }

    public list: [];
	public message: string;

    async ngOnInit() {
        this.app = await this.appService.getData();
    }

    setList(list: []) {
        this.list = list;
    }

    async send() {
        if (!this.list || !this.list.length) {
            this.showErrorMessage('No recipients were selected!');
        }

        var msg = {
			message: this.message,
            contacts: this.list
        };

        var messageCount = await this.repository.sendEmail(msg);
		this.showSuccessMessage(`Sent ${messageCount} text messages!`);
    }
}
