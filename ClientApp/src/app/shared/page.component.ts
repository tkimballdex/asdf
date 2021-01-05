import { Component, ViewChild } from "@angular/core";
import { PrivilegeSet } from "./app.repository";
import { ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-angular-popups';

@Component({
	selector: 'component-page',
	template: ''
})
export class PageComponent {
	public loading: boolean;
	public deleting: boolean;
	public privileges: PrivilegeSet;
    public notify: Notify;

    @ViewChild('toast', null) public toast: ToastComponent;

    constructor() {
        this.notify = new Notify();
        this.loadStart = this.loadStart.bind(this);
        this.loadEnd = this.loadEnd.bind(this);
    }

	public loadStart() {
		this.loading = true;
	}

	public loadEnd() {
		this.loading = false;
	}

	public deleteStart() {
		this.deleting = true;
	}

	public deleteEnd() {
		this.deleting = false;
    }

    public showSaveMessage(success: boolean) {
        if (success) {
            this.toast.show({
                content: 'Saved successfully!', timeOut: 2000, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-success'
            });
        }
        else {
            this.toast.show({
                content: 'Error occurred!', timeOut: 2000, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-danger'
            });
        }
    }

    public showSuccessMessage(message: string) {
        this.toast.show({
            content: message, timeOut: 2000, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-success'
        });
    }

    public showErrorMessage(message: string) {
        this.toast.show({
            content: message, timeOut: 2000, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-danger'
        });
    }

    public showDeleteMessage(success: boolean) {
        if (success) {
            this.toast.show({
                content: 'Deleted successfully!', timeOut: 2000, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-success'
            });
        }
        else {
            this.toast.show({
                content: 'Error occurred while deleting!', timeOut: 2000, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-danger'
            });
        }
    }

    public showSpinner() {
        createSpinner({ target: document.getElementById('wrapper') });
        //showSpinner(document.getElementById('wrapper'));
        this.loadStart();
    }

    public hideSpinner() {
        //hideSpinner(document.getElementById('wrapper'));
        this.loadEnd();
    }
}

class Notify {
}
