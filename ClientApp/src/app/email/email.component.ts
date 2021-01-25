import { Component, OnInit } from '@angular/core';
import { EmailRepository } from './repository';
import { AppRepository, AppData } from '../shared/app.repository';
import { PageComponent } from '../shared/page.component';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css']
})
export class EmailComponent extends PageComponent implements OnInit {
    constructor(private appRepository: AppRepository, private repository: EmailRepository) {
        super();
    }

    public list: [];
    public subject: string;
    public body: string;

    async ngOnInit() {
        this.app = await this.appRepository.getData();
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
