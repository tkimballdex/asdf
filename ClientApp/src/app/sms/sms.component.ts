import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
	public form: FormGroup;
	@Output() onClose = new EventEmitter<boolean>();

    async ngOnInit() {
        this.app = await this.appService.getData();

		this.form = new FormGroup({
			message: new FormControl('', [Validators.required])
		});
   }

    setList(list: []) {
        this.list = list;
	}

	close() {
		this.onClose.emit(true);
	}

    async send() {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			this.showErrorMessage("Please complete all required fields!");
			return;
		}

		if (!this.list || !this.list.length) {
			this.showErrorMessage('No recipients were selected!');
			return;
        }

        var msg = {
			message: this.form.get('message').value,
            contacts: this.list
        };

        var messageCount = await this.repository.sendEmail(msg);
		this.showSuccessMessage(`Sent ${messageCount} text messages!`); this.form.get('message')
		this.form.get('message').setValue('');
    }
}
