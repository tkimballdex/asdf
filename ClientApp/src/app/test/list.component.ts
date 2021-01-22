import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SiteRepository } from './repository';
import { PageComponent } from '../shared/page.component';
import { AppRepository } from "../shared/app.repository";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent extends PageComponent implements OnInit {
  constructor(private repository: SiteRepository, private router: Router, private appRepository: AppRepository) {
    super();
}

public list: any;
public name: any;

async ngOnInit() {
    if (this.appRepository.tenantId) {
        this.search();
    }
}

async search() {
    this.showSpinner();
    this.list = await this.repository.list({ tenantId: this.appRepository.tenantId, name: this.name });
    this.hideSpinner();
}
}

