import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { AppRepository, EventQueueService, AppEvent, AppEventType } from '../shared/app.repository';

@Component({
    selector: 'master-page',
    templateUrl: './master.component.html'
})
export class MasterPageComponent {  
    constructor() {
        console.dir('MasterPageComponent');
    }
}
