import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerRepository } from './repository';
import { AppRepository, EventQueueService, AppEvent, AppEventType } from '../shared/app.repository';

@Component({
    selector: 'customer-home',
    templateUrl: './home.component.html'
})
export class CustomerHomeComponent {  
    constructor(private repository: CustomerRepository, private router: Router, private appRepository: AppRepository, private eventQueue: EventQueueService) {
        console.dir('CustomerHomeComponent');
    }
}
