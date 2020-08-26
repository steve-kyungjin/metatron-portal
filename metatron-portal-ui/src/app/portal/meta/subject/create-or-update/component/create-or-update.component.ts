import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {Meta} from '../../../value/meta';
import {SelectValue} from '../../../../../common/component/select/select.value';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {CookieConstant} from '../../../../common/constant/cookie-constant';
import * as _ from 'lodash';
import {CookieService} from 'ng2-cookies';
import {TranslateService} from 'ng2-translate';
import {Alert} from '../../../../../common/util/alert-util';
import {MetaService} from '../../../service/meta.service';
import {Utils} from '../../../../../common/util/utils';
import {Validate} from '../../../../../common/util/validate-util';
import {Loading} from '../../../../../common/util/loading-util';

@Component({
	selector: '[subject-create-update]',
	templateUrl: './create-or-update.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class CreateOrUpdateComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 *
	 */
	@Output()
	private onCancel = new EventEmitter();

	/**
	 *
	 */
	@Output()
	private onDone = new EventEmitter();

	/**
	 * 데이터 주제영역 분류 기준
	 */
	private metaSubjectClassificationCriteriaGroupCode = 'GC0001001';

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 수정모드인지
	 */
	@Input()
	public isEditMode: boolean = false;

	/**
	 * 서브젝트 아이디
	 */
	@Input()
	public subjectId: string = '';

	/**
	 * 주제영역
	 */
	public subject: Meta.Subject = new Meta.Subject();

	/**
	 * 주제영역 분류 기준 셀렉트 박스 목록
	 */
	public criteriaSelectValueList: SelectValue[] = [];

	/**
	 * 주제영역 분류 기준 셀렉트 박스 목록 ( 기본값 )
	 */
	public defaultCriteriaSelectValueList: SelectValue[] = [];

	/**
	 * 선택된 상위 주제영역 목록
	 */
	public selectedParentSubjectList: Meta.Subject[] = [];

	/**
	 * 상위 주제영역 선택 팝업 오픈 여부
	 */
	public isParentSubjectSelectPopupOpen: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param translateService
	 * @param cookieService
	 * @param metaService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private cookieService: CookieService,
				private metaService: MetaService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.initialize();

		if (this.isEditMode) {

			if (_.isNil(this.subjectId) || _.isEmpty(this.subjectId)) {
				Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				this.onCancel.emit();
				return;
			}

			Loading.show();

			Promise.resolve()
				.then(() => {
					this.getCriteriaCodeList(false);
				})
				.then(() => {
					this.getSubject(this.subjectId);
				});

		} else {
			this.getCriteriaCodeList();
		}

	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 취소
	 */
	public cancel(): void {
		this.onCancel.emit();
	}

	/**
	 * 적용
	 */
	public done(): void {

		if (_.isNil(this.subject.criteriaId) || _.isEmpty(this.subject.criteriaId)) {
			this.subject.isCriteriaIdValidation = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (_.isNil(this.subject.nmKr) || _.isEmpty(this.subject.nmKr)) {
			this.subject.isNmKrValidation = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (Validate.isOnlyKor(this.subject.nmKr) === false) {
			this.subject.isNmKrValidation = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ONLY.KOREAN`, `한글만 입력할 수 있습니다.`)}`);
			return;
		}

		if (_.isNil(this.subject.nmEn) || _.isEmpty(this.subject.nmEn)) {
			this.subject.isNmEnValidation = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (Validate.isOnlyEng(this.subject.nmEn) === false) {
			this.subject.isNmEnValidation = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ONLY.ENGLISH`, `영문만 입력할 수 있습니다.`)}`);
			return;
		}

		if (this.selectedParentSubjectList.length > 0) {
			this.selectedParentSubjectList.forEach(subject => {
				this.subject.parentId = subject.id;
			});
		}

		this.save();
	}

	/**
	 * 상위 주제영역 분류 기준 선택 시
	 *
	 * @param $event
	 */
	public parentCriteriaSelect($event): void {
		this.subject.criteriaId = $event.value.id;
	}

	/**
	 * 상위 주제영역 선택 팝업 닫기
	 */
	public parentSubjectSelectClose(): void {
		this.isParentSubjectSelectPopupOpen = false;
	}

	/**
	 * 해당 인덱스의 서브젝트 삭제
	 *
	 * @param index
	 */
	public deleteSubjectByIndex(index: number): void {

		this.selectedParentSubjectList = Utils.ArrayUtil.remove(this.selectedParentSubjectList, index);

		this.initializeParentId();
		this.initializeCriteriaSelectValueList();
		this.initializeCriteriaId();
	}

	/**
	 * 상위 주제영역 선택 완료시
	 *
	 * @param subjects
	 */
	public parentSubjectSelectDone(subjects: Meta.Subject[]) {

		this.selectedParentSubjectList = subjects;
		this.isParentSubjectSelectPopupOpen = false;

		const criteriaId: string = this.selectedParentSubjectList[ 0 ].criteria.id;
		this.criteriaSelectValueList = this.selectCriteriaSelectValueList(criteriaId);
		this.subject.criteriaId = criteriaId;
		this.subject.isCriteriaIdValidation = false;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터 주제영역 분류 기준 코드 조회
	 */
	private getCriteriaCodeList(isLoading: boolean = true): Promise<void | never> {

		if (isLoading) {
			Loading.show();
		}

		return this.codeService
			.getCodesByGrpCdKey(this.metaSubjectClassificationCriteriaGroupCode)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					const typeListTemp: SelectValue[] = [];
					result.data.codeList
						.forEach(code => {
							typeListTemp.push(
								new SelectValue(
									this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
										? code.nmKr
										: code.nmEn
									, code
									, false
								)
							)
						});
					this.criteriaSelectValueList = typeListTemp;
				} else {
					this.criteriaSelectValueList = [];
				}

				this.defaultCriteriaSelectValueList = _.cloneDeep(this.criteriaSelectValueList);

				if (isLoading) {
					Loading.hide();
				}
			})
			.catch(() => {
				this.criteriaSelectValueList = [];
			});
	}

	/**
	 * 저장
	 */
	private save() {
		if (this.isEditMode) {
			this.update();
		} else {
			this.create();
		}
	}

	/**
	 * 생성
	 */
	private create(): void {

		Loading.show();

		this.metaService
			.createSubject(this.subject)
			.then(result => {

				Loading.hide();

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
					this.onDone.emit();
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}
			});
	}

	/**
	 * 수정
	 */
	private update(): void {

		Loading.show();

		this.metaService
			.updateSubject(this.subject)
			.then(result => {

				Loading.hide();

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));
					this.onDone.emit();
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}
			});
	}

	/**
	 * 초기화
	 */
	private initialize(): void {
		this.subject.nmEn = '';
		this.subject.nmKr = '';
		this.subject.level = '';
		this.subject.description = '';
		this.subject.isNmKrValidation = false;
		this.subject.isNmEnValidation = false;
		this.subject.isCriteriaIdValidation = false;
	}

	/**
	 * 주제영역 분류 기준 셀렉트 박스 초기화
	 */
	private initializeCriteriaSelectValueList(): void {
		this.criteriaSelectValueList = _.cloneDeep(this.defaultCriteriaSelectValueList);
	}

	/**
	 * 주제영역 분류 기준 셀렉트 박스 선택 처리
	 *
	 * @param criteriaId
	 */
	private selectCriteriaSelectValueList(criteriaId): SelectValue[] {
		const temp: SelectValue[] = _.cloneDeep(this.criteriaSelectValueList);
		temp.map(data => {
			return data.checked = data.value.id === criteriaId;
		});
		return temp;
	}

	/**
	 * 상위 주제영역 아이디 초기화
	 */
	private initializeParentId(): void {
		this.subject.parentId = '';
	}

	/**
	 * 주제영역 분류 기준 아이디 초기화
	 */
	private initializeCriteriaId(): void {
		this.subject.criteriaId = '';
	}

	/**
	 * 테이블 조회
	 *
	 * @param {string} id
	 * @param isLoading
	 */
	private getSubject(id: string, isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		return this.metaService
			.getSubject(id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					this.subject = result.data.subject;

					const parentId: string = this.subject.parentId;
					const parentNm: string = this.subject.parentNm;

					if (_.isNil(parentId) === false
						&& _.isEmpty(parentNm) === false) {

						const parentSubject = new Meta.Subject();
						parentSubject.id = parentId;
						parentSubject.nmKr = parentNm;
						this.selectedParentSubjectList.push(parentSubject);
					}

					if (_.isNil(this.subjectId) === false
						&& _.isEmpty(this.subjectId) === false
						&& _.isNil(this.subject.criteria) === false
						&& _.isEmpty(this.subject.criteria.id) === false) {

						this.subject.criteriaId = this.subject.criteria.id;

						this.criteriaSelectValueList = this.selectCriteriaSelectValueList(this.subject.criteria.id);
					}

				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
					this.initialize();
				}

				if (isLoading) {
					Loading.hide();
				}
			});
	}

}
