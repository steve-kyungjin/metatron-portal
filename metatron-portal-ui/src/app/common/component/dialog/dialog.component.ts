// noinspection TypeScriptCheckImport
import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {AbstractComponent} from '../../../portal/common/component/abstract.component';
import {DialogService} from './dialog.service';
import {Dialog, DialogType} from './dialog.value';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
	selector: 'dialog-confirm',
	templateUrl: './dialog.component.html'
})
export class DialogComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
   	| Private Variables
   	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public DialogType = DialogType;

	public option: Dialog;

	public showPopup: boolean = false;

	public message;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				public sanitized: DomSanitizer,
				private dialogService: DialogService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		super.ngOnInit();

		this.option = new Dialog(this.translateService);

		this.subscriptions.push(
			this.dialogService
				.getMessage()
				.subscribe(message => {
					if (message) {
						this.message = message;
						this.option = message.dialog;
						this.showPopup = true;
					}
				})
		);
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 취소 클릭
	 */
	public cancelClick() {
		if (this.message.cancelFn) {
			this.message.cancelFn();
		}
		this.close();
	}

	/**
	 * 확인 클릭
	 */
	public confirmClick() {
		if (this.message.confirmFn) {
			this.message.confirmFn();
		}
		this.close();
	}

	/**
	 * 닫기
	 */
	public close() {
		this.showPopup = false;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
