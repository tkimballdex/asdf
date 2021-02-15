import { Component, OnInit } from '@angular/core';
import { AppService } from '../shared/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './splash.component.html',
})
export class SplashComponent {
	constructor(public appService: AppService) {
	}
}
