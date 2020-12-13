import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent extends PageComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {
    }
}
