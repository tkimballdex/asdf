import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
	public form: FormGroup;
	@Output() onClose = new EventEmitter<boolean>();

    async ngOnInit() {
        this.app = await this.appService.getData();

		this.form = new FormGroup({
			body: new FormControl('', [Validators.required]),
			subject: new FormControl('', [Validators.required])
		});
   }

	close() {
		this.onClose.emit(true);
	}

    setList(list: []) {
        this.list = list;
    }

    async sendEmail() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!");
			return;
		}

        if (!this.list || !this.list.length) {
			this.showErrorMessage('No recipients were selected!');
			return;
        }

        var email = {
            contacts: this.list
		};

		Object.assign(email, this.form.value);

        var emailCount = await this.repository.sendEmail(email);
        this.showSuccessMessage(`Sent ${emailCount} emails!`);
		this.form.get('body').setValue('');
		this.form.get('subject').setValue('');
   }
}
