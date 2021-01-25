import { NgModule } from '@angular/core';
import { PageComponent } from './page.component';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

@NgModule({
	declarations: [
		PageComponent
	],
	exports: [
		PageComponent
    ],
    imports: [
        DialogModule
    ]
})
export class SharedModule { }
