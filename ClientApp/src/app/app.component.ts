import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, AuthenticationResult } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-root',
	styleUrls: ['app.component.css'],
	templateUrl: 'app.component.html',
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
	constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService) { }

	ngOnInit(): void {
		console.dir('AppComponent OnInit');
		this.msalBroadcastService.msalSubject$
			.pipe(
				filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
			)
			.subscribe((result: EventMessage) => {
				console.log('LOGIN_SUCCESS');
				console.dir(result);
				const payload = result.payload as AuthenticationResult;
				this.authService.instance.setActiveAccount(payload.account);
			});


		this.msalBroadcastService.inProgress$
			.pipe(
				filter((status: InteractionStatus) => status === InteractionStatus.None)
			)
			.subscribe(() => {
				this.setLoginDisplay();
			})
	}

	setLoginDisplay() {
	}
};
