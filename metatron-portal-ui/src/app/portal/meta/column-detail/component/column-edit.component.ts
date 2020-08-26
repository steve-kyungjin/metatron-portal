import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {MetaService} from '../../service/meta.service';
import {Meta} from '../../value/meta';
import {Loading} from '../../../../common/util/loading-util';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Page} from 'app/portal/common/value/result-value';
import {SelectValue} from '../../../../common/component/select/select.value';
import {Code} from '../../../common/value/code';
import * as _ from 'lodash';
import {CookieConstant} from '../../../common/constant/cookie-constant';
import {CookieService} from 'ng2-cookies';
import {Alert} from '../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';

@Component({
	selector: '[column-edit]',
	templateUrl: './column-edit.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class ColumnEditComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	 * Druid 컬럼유형 그룹코드
	 */
	private druidColumnGroupCode: string = 'GRPID_DRT_01';

	/**
	 * 개인정보 처리유형 그룹코드
	 */
	private privacyProcGroupCode: string = 'GRPID_PDP_01';

	/**
	 * 개인정보항목 그룹코드
	 */
	private privacyGroupCode: string = 'GRPID_PRIV';

	/**
	 * 그룹 코드 목록
	 */
	private groupCodeList: string[] = [ this.druidColumnGroupCode, this.privacyProcGroupCode, this.privacyGroupCode ];

	/**
	 * Y / N 셀렉트 박스 아이템
	 *
	 * @type {SelectValue[]}
	 */
	private Y_N_LIST: SelectValue[] = [
		new SelectValue('Y', true, false),
		new SelectValue('N', false, false)
	];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 컬럼
	 */
	public column: Meta.Column = new Meta.Column();

	/**
	 * 데이터 웨어하우스 컬럼 아이디
	 */
	@Input()
	public metaColumnId: string;

	/**
	 * Druid 컬럼유형
	 */
	public druidColumnSelectValueList: SelectValue[] = [];

	/**
	 * 개인정보 처리유형
	 */
	public privacyProcSelectValueList: SelectValue[] = [];

	/**
	 * 개인정보항목
	 */
	public privacySelectValueList: SelectValue[] = [];

	/**
	 * Primary Key 여부
	 */
	public primaryKeySelectValueList: SelectValue[] = _.cloneDeep(this.Y_N_LIST);

	/**
	 * NULL 허용 여부
	 */
	public nullableSelectValueList: SelectValue[] = _.cloneDeep(this.Y_N_LIST);

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

		this.column.isPhysicalNmValidation = false;

		Loading.show();

		Promise.resolve()
			.then(() => {
				return this.getColumn(this.metaColumnId, false);
			})
			.then(() => {
				return this.getCodeListByGroupCodeListService();
			})
			.then(() => {

				const primaryKeySelectValueListTemp = _.cloneDeep(this.primaryKeySelectValueList);
				if (_.isNil(this.column.primaryKey) === false && this.column.primaryKey === true) {
					primaryKeySelectValueListTemp[ 0 ].checked = true;
				} else {
					primaryKeySelectValueListTemp[ 1 ].checked = true;
				}
				this.primaryKeySelectValueList = primaryKeySelectValueListTemp;

				const nullableSelectValueListTemp = _.cloneDeep(this.nullableSelectValueList);
				if (_.isNil(this.column.nullable) === false && this.column.nullable === true) {
					nullableSelectValueListTemp[ 0 ].checked = true;
				} else {
					nullableSelectValueListTemp[ 1 ].checked = true;
				}
				this.nullableSelectValueList = nullableSelectValueListTemp;

				this.druidColumnSelectValueList = this.convertSelectValueCheckedValue(this.column.druidColumn, this.druidColumnSelectValueList);
				this.privacyProcSelectValueList = this.convertSelectValueCheckedValue(this.column.privacyProc, this.privacyProcSelectValueList);
				this.privacySelectValueList = this.convertSelectValueCheckedValue(this.column.privacy, this.privacySelectValueList);
			})
			.then(() => {
				Loading.hide();
			})
			.catch(() => {
				Loading.hide();
			})
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
	public cancel() {
		this.onCancel.emit();
	}

	/**
	 * 적용
	 */
	public done() {

		if (_.isNil(this.column.physicalNm)) {
			this.column.isPhysicalNmValidation = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		this.updateColumn();
	}

	/**
	 * Primary Key 여부
	 *
	 * @param $event
	 */
	public selectPrimaryKey($event) {
		this.column.primaryKey = $event.value;
	}

	/**
	 * NULL 허용 여부
	 *
	 * @param $event
	 */
	public selectNullable($event) {
		this.column.nullable = $event.value;
	}

	/**
	 * 개인정보 처리유형
	 *
	 * @param $event
	 */
	public selectPrivacy($event) {
		this.column.privacyId = $event.value.id;
	}

	/**
	 * 개인정보 처리유형
	 *
	 * @param $event
	 */
	public selectPrivacyProc($event) {
		this.column.privacyProcId = $event.value.id;
	}

	/**
	 * Druid 컬럼유형
	 *
	 * @param $event
	 */
	public selectDruidColumn($event) {
		this.column.druidColumnId = $event.value.id;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 *
	 *
	 * @param codeList
	 */
	private createSelectValues(codeList: Code.Entity[]): SelectValue[] {
		const tempList: SelectValue[] = [];
		codeList
			.forEach(code => {
				tempList.push(
					new SelectValue(
						this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
							? code.nmKr
							: code.nmEn
						, code
						, false
					)
				)
			});
		return tempList;
	}

	/**
	 *
	 */
	private getCodeListByGroupCodeListService() {
		return this.codeService
			.getCodeListByGroupCodeList(this.groupCodeList)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.druidColumnSelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.druidColumnGroupCode, result.data));
					this.privacyProcSelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.privacyProcGroupCode, result.data));
					this.privacySelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.privacyGroupCode, result.data));
				} else {
					this.druidColumnSelectValueList = [];
					this.privacyProcSelectValueList = [];
					this.privacySelectValueList = [];
				}
			});
	}

	/**
	 *
	 *
	 * @param code
	 * @param codeAllList
	 */
	private codeAllListFindGroupCode(code: string, codeAllList: { [ id: string ]: Code.Entity[] }[]) {
		const codeList: Code.Entity[] = codeAllList[ code ];
		return _.isNil(codeList)
			? []
			: codeList;
	}

	/**
	 * 컬럼 조회
	 *
	 * @param {string} id
	 * @param isLoading
	 */
	private getColumn(id: string, isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		const page = new Page().createNonPagingValueObject();
		page.size = 1;
		return this.metaService
			.getColumn(id, page)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.column = result.data.column;
				} else {
					this.column = new Meta.Column();
				}

				this.column.isPhysicalNmValidation = false;

				if (isLoading) {
					Loading.hide();
				}
			});
	}

	/**
	 * 컬럼 조회
	 *
	 * @param {string} id
	 * @param isLoading
	 */
	private getColumnService(id: string, isLoading: boolean = true) {
		return Promise.resolve()
			.then(() => {
				return this.getColumn(id, isLoading);
			})
			.catch(() => {
				if (isLoading) {
					Loading.hide();
				}
			});
	}

	/**
	 *
	 *
	 * @param code
	 * @param selectValueList
	 */
	private convertSelectValueCheckedValue(code: Code.Entity, selectValueList: SelectValue[]) {

		if (_.isNil(code) === false) {
			const temp = _.cloneDeep(selectValueList);
			temp.map(data => {
				return data.checked = data.value.id === code.id;
			});
			return temp;
		}

		return selectValueList;
	}

	/**
	 *
	 *
	 * @param isLoading
	 */
	private updateColumn(isLoading: boolean = true) {

		Promise.resolve()
			.then(() => {
				this.updateColumnService(isLoading);
			})
			.catch(error => {
				if (isLoading) {
					Loading.hide();
				}
			});
	}

	/**
	 *
	 *
	 * @param isLoading
	 */
	private updateColumnService(isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		return this.metaService
			.updateColumnByTableId(this.column)
			.then(result => {

				if (isLoading) {
					Loading.hide();
				}

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.onDone.emit();
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

			});
	}

}
