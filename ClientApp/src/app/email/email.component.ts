import { Component, OnInit } from '@angular/core';
import { EmailRepository } from './repository';
import { AppRepository, AppData } from '../shared/app.repository';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
    constructor(private appRepository: AppRepository, private repository: EmailRepository) { }

    public app: AppData;
    public list: [];
    public subject: string;
    public body: string;

    async ngOnInit() {
        this.app = await this.appRepository.getData();
    }

    sendEmail() {
        var email = {
            subject: this.subject,
            body: this.body,
            contacts: this.list
        };

        this.repository.sendEmail(email);
    }
}
