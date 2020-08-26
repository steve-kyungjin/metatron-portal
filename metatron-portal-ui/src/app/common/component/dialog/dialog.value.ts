/**
 * Dialog
 */
import {TranslateService} from 'ng2-translate';

export class Dialog {
	constructor(
		private translateService: TranslateService = null
	) {
	}

	public type: DialogType = DialogType.CONFIRM;
	public title: string = '';
	public text: string = '';
	public accentText: string = '';
	public cancelText = this.translateService.instant('COMMON.CANCEL', '취소');
	public confirmText = this.translateService.instant('COMMON.CONFIRM', '확인');
}

export enum DialogType {
	CONFIRM,
	ALERT
}
