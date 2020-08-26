import {Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {Code} from '../../../../common/value/code';
import * as _ from 'lodash';
import {Validate} from '../../../../../common/util/validate-util';
import {Alert} from '../../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import {CookieService} from 'ng2-cookies';
import {CookieConstant} from '../../../../common/constant/cookie-constant';

@Component({
	selector: '[create-category-layer]',
	templateUrl: './create-category-layer.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class CreateCategoryLayerComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 취소
	 *
	 * @type {EventEmitter<any>}
	 */
	@Output()
	private oHide: EventEmitter<any> = new EventEmitter();

	/**
	 * 적용
	 *
	 * @type {EventEmitter<any>}
	 */
	@Output()
	private oComplete: EventEmitter<any> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public category: Code.Entity = new Code.Entity();

	/**
	 * 유효성 검사 플래그
	 */
	public validation = {
		isCdValidationFail: false,
		isNmKrValidationFail: false,
		isNmEnValidationFail: false,
		isCdDescValidationFail: false
	};

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private cookieService: CookieService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public cancel(): void {
		this.oHide.emit();
	}

	public create(): void {

		if (_.isEmpty(this.category.cd)) {
			this.validation.isCdValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (Validate.checkMaxLength(this.category.cd, 3)) {
			this.validation.isCdValidationFail = true;
			Alert.warning(
				`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.MAX.CHARACTERS`, `최대 ? 자까지 입력할 수 있습니다.`)
					.replace('?',
						this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
							? '3'
							: 'three'
					)}`);
			return;
		}

		if (this.codeService.passCodeRegularExpression(this.category.cd) === false) {
			this.validation.isCdValidationFail = true;
			Alert.warning(`${this.translateService.instant(`MANAGEMENT.CATEGORY.CREATE.LAYER.VALIDATION.NOT.PASS.CODE`, `사용할 수 없는 코드입니다.`)}`);
			return;
		}

		if (_.isEmpty(this.category.nmKr)) {
			this.validation.isNmKrValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (Validate.checkMaxLength(this.category.nmKr, 16)) {
			this.validation.isNmKrValidationFail = true;
			Alert.warning(
				`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.MAX.CHARACTERS`, `최대 ? 자까지 입력할 수 있습니다.`)
					.replace('?',
						this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
							? '16'
							: 'sixteen'
					)}`);
			return;
		}

		if (Validate.isOnlyKor(this.category.nmKr) === false) {
			this.validation.isNmKrValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ONLY.KOREAN`, `한글만 입력할 수 있습니다.`)}`);
			return;
		}

		if (_.isEmpty(this.category.nmEn)) {
			this.validation.isNmEnValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (Validate.checkMaxLength(this.category.nmEn, 16)) {
			this.validation.isNmEnValidationFail = true;
			Alert.warning(
				`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.MAX.CHARACTERS`, `최대 ? 자까지 입력할 수 있습니다.`)
					.replace('?',
						this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
							? '16'
							: 'sixteen'
					)}`);
			return;
		}

		if (Validate.isOnlyEng(this.category.nmEn) === false) {
			this.validation.isNmEnValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ONLY.ENGLISH`, `영어만 입력할 수 있습니다.`)}`);
			return;
		}

		if (_.isEmpty(this.category.cdDesc)) {
			this.validation.isCdDescValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (Validate.checkMaxLength(this.category.cdDesc, 85)) {
			this.validation.isCdDescValidationFail = true;
			Alert.warning(
				`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.MAX.CHARACTERS`, `최대 ? 자까지 입력할 수 있습니다.`)
					.replace('?',
						this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
							? '85'
							: 'eighty-five'
					)}`);
			return;
		}

		this.oComplete.emit(this.category);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
