import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';
import {Dialog, DialogType} from './dialog.value';
import {TranslateService} from 'ng2-translate';

@Injectable()
export class DialogService {

	private subject = new Subject<any>();

	constructor(private translateService: TranslateService) {}

	/**
	 * Confirm
	 */
	confirm(title: string, text: string, accentText: string, cancelText: string, confirmText: string,
			cancelFn: () => void, confirmFn: () => void) {
		let self = this;
		let dialog = new Dialog(this.translateService);
		if (title) dialog.title = title;
		if (text) dialog.text = text;
		if (accentText) dialog.accentText = accentText;
		if (cancelText) dialog.cancelText = cancelText;
		if (confirmText) dialog.confirmText = confirmText;

		this.subject.next({
			dialog: dialog,
			cancelFn:
				function () {
					self.subject.next(); //this will close the modal
					cancelFn();
				},
			confirmFn:
				function () {
					self.subject.next();
					confirmFn();
				}
		});
	}

	/**
	 * Alert
	 */
	alert(title: string, text: string, accentText: string, confirmText: string, confirmFn: () => void) {
		let self = this;
		let dialog = new Dialog(this.translateService);
		dialog.type = DialogType.ALERT;
		if (title) dialog.title = title;
		if (text) dialog.text = text;
		if (accentText) dialog.accentText = accentText;
		if (confirmText) dialog.confirmText = confirmText;

		this.subject.next({
			dialog: dialog,
			confirmFn:
				function () {
					self.subject.next();
					confirmFn();
				}
		});
	}

	getMessage(): Observable<any> {
		return this.subject.asObservable();
	}
}
