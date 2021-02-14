import { Component, OnInit } from '@angular/core';
import { AppRepository } from '../shared/app.repository';

@Component({
  selector: 'app-home',
  templateUrl: './splash.component.html',
})
export class SplashComponent {
	constructor(public appRepository: AppRepository) {
	}
}
