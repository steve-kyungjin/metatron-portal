import {ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import * as _ from 'lodash';
import {Loading} from '../../../../../common/util/loading-util';
import {Code} from '../../../../common/value/code';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {Utils} from '../../../../../common/util/utils';
import {Alert} from '../../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import {DialogService} from '../../../../../common/component/dialog/dialog.service';
import {Validate} from '../../../../../common/util/validate-util';
import {CookieService} from 'ng2-cookies';
import {CookieConstant} from '../../../../common/constant/cookie-constant';

export abstract class BaseCategoryManagementClass extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 수정중인 카테고리 없음
	 *
	 * @type {number}
	 * @private
	 */
	private editingCategoryEmpty = -1;

	/**
	 * 편집중인 카테고리 원본 데이터
	 */
	private originalDataForCategoryBeingEdit: Code.Entity;

	/**
	 * 편집중인 카테고리 엘리먼트 인덱스
	 */
	private elementIndexForCategoryBeingEdit: number = this.editingCategoryEmpty;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 그룹 코드
	 *
	 * @type {string}
	 */
	protected groupCode: string = '';

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 카테고리 목록
	 *
	 * @type {any[]}
	 */
	public categoryList: Code.Entity[] = [];

	/**
	 * UUID
	 *
	 * @type {string}
	 */
	public uuid: string = Utils.Generate.UUID();

	/**
	 * 카테고리 수정 모드인지 검사하기 위한 플래그
	 *
	 * @type {boolean}
	 */
	public isCategoryEditMode: boolean = false;

	/**
	 *
	 *
	 * @type {boolean}
	 */
	public isCreateCategoryLayerShow: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param translateService
	 * @param dialogService
	 * @param cookieService
	 */
	protected constructor(protected elementRef: ElementRef,
						  protected injector: Injector,
						  protected translateService: TranslateService,
						  protected dialogService: DialogService,
						  protected cookieService: CookieService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		if (_.isEmpty(this.groupCode)) {
			return;
		}

		this.getCategoryList();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 카테고리 수정 모드로 변경
	 *
	 * @param index
	 */
	protected changeEditModeByCategoryElementIndex(index: number): void {

		if (this.isCategoryEditMode) {
			this.initializeChangedCategoryData();
		}

		this.isCategoryEditMode = true;
		this.elementIndexForCategoryBeingEdit = index;
		this.originalDataForCategoryBeingEdit = _.cloneDeep(this.categoryList[ index ]);

		const $categoryDisplayInput = this.jQuery(`#${this.uuid}${index}-display-input`);
		$categoryDisplayInput.attr('aria-hidden', 'true');

		const $categoryEditModeInput = this.jQuery(`#${this.uuid}${index}-edit-mode-input`);
		$categoryEditModeInput.attr('aria-expanded', 'true');
	}

	/**
	 * 카테고리 뷰 모드로 변경
	 *
	 * @param index
	 */
	protected changeViewModeByCategoryElementIndex(index: number): void {

		this.isCategoryEditMode = false;
		this.elementIndexForCategoryBeingEdit = this.editingCategoryEmpty;
		this.categoryList[ index ] = this.originalDataForCategoryBeingEdit;

		const $categoryDisplayInput = this.jQuery(`#${this.uuid}${index}-display-input`);
		$categoryDisplayInput.attr('aria-hidden', 'false');

		const $categoryEditModeInput = this.jQuery(`#${this.uuid}${index}-edit-mode-input`);
		$categoryEditModeInput.attr('aria-expanded', 'false');
	}

	/**
	 * 삭제
	 *
	 * @param categoryId
	 */
	protected deleteByCategoryId(category: Code.Entity): void {

		if (category.extra) {
			this.dialogService.alert(
				this.translateService.instant('COMMON.NOTICE', '알림'),
				this.translateService.instant(`MANAGEMENT.CATEGORY.CREATE.LAYER.VALIDATION.EXIST.APP`, '카테고리에 연결된 앱이 존재합니다.연결해제 후 다시 시도해 주세요.'),
				null,
				this.translateService.instant('COMMON.CONFIRM', '확인'),
				() => {
				}
			);
		} else {
			this.dialogService
				.confirm(
					this.translateService.instant('COMMON.CANCEL', '취소'),
					this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제하시겠습니까?'),
					null,
					this.translateService.instant('COMMON.CANCEL', '취소'),
					this.translateService.instant('COMMON.CONFIRM', '확인'),
					() => {
						this.logger.debug(`카테고리 삭제 컨펌 취소 클릭`);
					},
					() => {

						Loading.show();

						this.codeService
							.deleteByCodeId(category.id)
							.then(result => {

								if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

									this.initialize();

									Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));

									this.getCategoryList();
								}
							})
							.catch(error => {
								this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
							});
					});
		}
	}

	/**
	 * 수정
	 *
	 * @param index
	 */
	protected updateByCategoryElementIndex(index: number): void {

		const category = this.categoryList[ index ];

		if (_.isEmpty(category.cd)) {
			category.isCdValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (Validate.checkMaxLength(category.cd, 3)) {
			category.isCdValidationFail = true;
			Alert.warning(
				`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.MAX.CHARACTERS`, `최대 ? 자까지 입력할 수 있습니다.`)
					.replace('?',
						this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
							? '3'
							: 'three'
					)}`);
			return;
		}

		if (this.codeService.passCodeRegularExpression(category.cd) === false) {
			category.isCdValidationFail = true;
			Alert.warning(`${this.translateService.instant(`MANAGEMENT.CATEGORY.CREATE.LAYER.VALIDATION.NOT.PASS.CODE`, `사용할 수 없는 코드입니다.`)}`);
			return;
		}

		if (_.isEmpty(category.nmKr)) {
			category.isNmKrValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (Validate.checkMaxLength(category.nmKr, 16)) {
			category.isNmKrValidationFail = true;
			Alert.warning(
				`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.MAX.CHARACTERS`, `최대 ? 자까지 입력할 수 있습니다.`)
					.replace('?',
						this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
							? '16'
							: 'sixteen'
					)}`);
			return;
		}

		if (Validate.isOnlyKor(category.nmKr) === false) {
			category.isNmKrValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ONLY.KOREAN`, `한글만 입력할 수 있습니다.`)}`);
			return;
		}

		if (_.isEmpty(category.nmEn)) {
			category.isNmEnValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (Validate.checkMaxLength(category.nmEn, 16)) {
			category.isNmEnValidationFail = true;
			Alert.warning(
				`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.MAX.CHARACTERS`, `최대 ? 자까지 입력할 수 있습니다.`)
					.replace('?',
						this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
							? '16'
							: 'sixteen'
					)}`);
			return;
		}

		if (Validate.isOnlyEng(category.nmEn) === false) {
			category.isNmEnValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ONLY.ENGLISH`, `영어만 입력할 수 있습니다.`)}`);
			return;
		}

		if (_.isEmpty(category.cdDesc)) {
			category.isCdDescValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (Validate.checkMaxLength(category.cdDesc, 85)) {
			category.isCdDescValidationFail = true;
			Alert.warning(
				`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.MAX.CHARACTERS`, `최대 ? 자까지 입력할 수 있습니다.`)
					.replace('?',
						this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
							? '85'
							: 'eighty-five'
					)}`);
			return;
		}

		Loading.show();

		this.codeService
			.updateCode(category)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.initialize();
					Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));
					this.getCategoryList();
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 카테고리 순서 값 증가
	 *
	 * @param {number} index
	 */
	protected increaseCategoryOrderValue(index: number): void {

		if (index === 0) {
			return;
		}

		Loading.show();

		const selectedCategory: Code.Entity = _.cloneDeep(this.categoryList[ index ]);

		const remove = (element, eIndex) => eIndex != index;
		this.categoryList = this.categoryList.filter(remove);

		const insert = (arr, index, newItem) => [ ...arr.slice(0, index), newItem, ...arr.slice(index) ];
		this.categoryList = insert(this.categoryList, index - 1, selectedCategory);

		this.categoryList
			.map((category, index) => {
				category.cdOrder = index;
			});

		this.codeService
			.updateCodes(this.categoryList)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					this.initialize();

					Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));

					this.getCategoryList();
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});

	}

	/**
	 * 카테고리 순서 값 감소
	 *
	 * @param {number} index
	 */
	protected reduceCategoryOrderValue(index: number): void {

		if (index === this.categoryList.length - 1) {
			return;
		}

		Loading.show();

		const selectedCategory: Code.Entity = _.cloneDeep(this.categoryList[ index ]);

		const remove = (element, eIndex) => eIndex != index;
		this.categoryList = this.categoryList.filter(remove);

		const insert = (arr, index, newItem) => [ ...arr.slice(0, index), newItem, ...arr.slice(index) ];
		this.categoryList = insert(this.categoryList, index + 1, selectedCategory);

		this.categoryList
			.map((category, index) => {
				category.cdOrder = index;
			});

		this.codeService
			.updateCodes(this.categoryList)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					this.initialize();

					Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));

					this.getCategoryList();
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 카테고리 생성
	 *
	 * @param {Code.Entity} code
	 */
	protected createCategory(code: Code.Entity): void {

		Loading.show();

		code.groupCd = this.groupCode;
		code.cdOrder = this.categoryList.length;

		this.codeService
			.createCode(code)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					this.initialize();

					Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));

					this.getCategoryList();
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 카테고리 목록 조회
	 */
	protected getCategoryList(): void {

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 변수 값 초기화
	 */
	private initialize(): void {
		this.isCategoryEditMode = false;
		this.isCreateCategoryLayerShow = false;
		this.elementIndexForCategoryBeingEdit = -1;
	}

	/**
	 * 변경된 카테고리 데이터 초기화
	 */
	private initializeChangedCategoryData(): void {
		this.categoryList[ this.elementIndexForCategoryBeingEdit ] = this.originalDataForCategoryBeingEdit;
	}

}
