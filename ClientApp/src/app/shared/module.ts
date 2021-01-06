import { NgModule } from '@angular/core';
import { PageComponent } from './page.component';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

@NgModule({
	declarations: [
		PageComponent
	],
	exports: [
		PageComponent, DialogModule
	]
})
export class SharedModule { }
