import { Component, OnInit } from '@angular/core';
import { EmailRepository } from './repository';
import { AppService, AppData } from '../shared/app.service';
import { PageComponent } from '../shared/page.component';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css']
})
export class EmailComponent extends PageComponent implements OnInit {
    constructor(private appService: AppService, private repository: EmailRepository) {
        super();
    }

    public list: [];
    public subject: string;
    public body: string;

    async ngOnInit() {
        this.app = await this.appService.getData();
    }

    setList(list: []) {
        this.list = list;
    }

    async sendEmail() {
        if (!this.list || !this.list.length) {
            this.showErrorMessage('No recipients were selected!');
        }

        var email = {
            subject: this.subject,
            body: this.body,
            contacts: this.list
        };

        var emailCount = await this.repository.sendEmail(email);
        this.showSuccessMessage(`Sent ${emailCount} emails!`);
    }
}
