import { Component, ViewChild } from "@angular/core";
import { AppData, PrivilegeSet } from "./app.service";
import { ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { createSpinner } from '@syncfusion/ej2-angular-popups';
import { showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

@Component({
	selector: 'component-page',
	template: ''
})
export class PageComponent {
	public loading: boolean;
	public deleting: boolean;
	public privileges: PrivilegeSet;
    public notify: Notify;
    public app: AppData;

    @ViewChild('toast') public toast: ToastComponent;

    constructor() {
        this.notify = new Notify();
        this.loadStart = this.loadStart.bind(this);
        this.loadEnd = this.loadEnd.bind(this);
    }

	invalidControl(controlName) {
		var c = this['form'].get(controlName);
		return c.touched && c.invalid;
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
                content: 'Record saved successfully!', timeOut: 2000, width:400, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-success e-toast-gen'
            });
        }
        else {
            this.toast.show({
                content: 'Error occurred!', timeOut: 2000, width:400, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-danger e-toast-gen'
            });
        }
    }

    public showSuccessMessage(message: string) {
        this.toast.show({
            content: message, timeOut: 2000, width:400, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-success e-toast-gen'
        });
    }

    public showErrorMessage(message: string) {
        this.toast.show({
            content: message, timeOut: 2000, width:400, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-danger'
        });
    }

    public showDeleteMessage(success: boolean) {
        if (success) {
            this.toast.show({
                content: 'Deleted successfully!', timeOut: 2000, width:400, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-success'
            });
        }
        else {
            this.toast.show({
                content: 'Error occurred while deleting!', timeOut: 2000, width:400, position: { X: 'center', Y: 'bottom' }, cssClass: 'e-toast-danger'
            });
        }
    }

    public showSpinner() {
        createSpinner({ target: document.getElementById('wrapper') });
        showSpinner(document.getElementById('wrapper'));
        this.loadStart();
    }

    public hideSpinner() {
        hideSpinner(document.getElementById('wrapper'));
        this.loadEnd();
    }

	public downloadFile(blob: any, filename: string) {
		var url = URL.createObjectURL(blob);

		var a = document.createElement("a");
		document.body.appendChild(a);

		a.href = url;
		a.download = filename;
		a.target = '_blank';
		a.style.display = "none";
		a.click();
	}

    public datePickerFocus(e) {
		const localVariable = e.model.placeholder.replace(/\s+/g, '');
        this[localVariable].show();
    }
}

class Notify {
}
