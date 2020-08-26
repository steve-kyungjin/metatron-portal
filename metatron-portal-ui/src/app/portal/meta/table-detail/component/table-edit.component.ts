import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Loading} from '../../../../common/util/loading-util';
import {MetaService} from '../../service/meta.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Meta} from '../../value/meta';
import {Alert} from '../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import {Utils} from '../../../../common/util/utils';
import {UserService} from '../../../common/service/user.service';
import {User} from '../../../common/value/user';
import * as _ from 'lodash';
import {SelectValue} from '../../../../common/component/select/select.value';
import {Code} from '../../../common/value/code';
import {CookieConstant} from '../../../common/constant/cookie-constant';
import {CookieService} from 'ng2-cookies';

@Component({
	selector: '[table-edit]',
	templateUrl: './table-edit.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class TableEditComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Output()
	private onCancel = new EventEmitter();

	@Output()
	private onDone = new EventEmitter();

	// 관리 상태
	private statusGroupCode: string = 'GRPID_TMS_01';

	// 데이터 생성 특성 분류
	private featureGroupCode: string = 'GRPID_DC_TRX';

	// 데이터 LAYER
	private layerGroupCode: string = 'GRPID_DAT_L0';

	// 데이터 이력 관리 유형
	private historyGroupCode: string = 'GRPID_DHM_00';

	// 데이터 처리(변경) 주기
	private cycleGroupCode: string = 'GRPID_PC_L10';

	// 데이터 보관기간
	private retentionGroupCode: string = 'GRPID_D_SV00';

	// 보안통제등급
	private securityGroupCode: string = 'GRPID_DS_LV1';

	// 개인정보 식별가능 수준
	private privacyGroupCode: string = 'GRPID_PRIV_L0';

	/**
	 * 그룹 코드 목록
	 */
	private groupCodeList: string[] = [ this.statusGroupCode, this.featureGroupCode, this.layerGroupCode, this.historyGroupCode, this.cycleGroupCode, this.retentionGroupCode, this.securityGroupCode, this.privacyGroupCode ];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터 웨어하우스 테이블 아이디
	 */
	@Input()
	public metaTableId: string;

	/**
	 * 데이터 웨어하우스 테이블
	 *
	 * @type {Meta.Table}
	 */
	public table: Meta.Table = new Meta.Table();

	/**
	 * 서브젝트 목록
	 */
	public subjectList: Meta.Subject[] = [];

	/**
	 *
	 */
	public isOpenWorkerUserSelectPopup: boolean = false;

	/**
	 *
	 */
	public isSubjectSelectPopupOpen: boolean = false;

	/**
	 *
	 */
	public statusSelectValueList: SelectValue[] = [];

	/**
	 *
	 */
	public featureSelectValueList: SelectValue[] = [];

	/**
	 *
	 */
	public layerSelectValueList: SelectValue[] = [];

	/**
	 *
	 */
	public historySelectValueList: SelectValue[] = [];

	/**
	 *
	 */
	public cycleSelectValueList: SelectValue[] = [];

	/**
	 *
	 */
	public retentionSelectValueList: SelectValue[] = [];

	/**
	 *
	 */
	public securitySelectValueList: SelectValue[] = [];

	/**
	 *
	 */
	public privacySelectValueList: SelectValue[] = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param translateService
	 * @param userService
	 * @param cookieService
	 * @param metaService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				public userService: UserService,
				private cookieService: CookieService,
				private metaService: MetaService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.table.isPhysicalNmValidation = false;
		this.table.isSubjectListValidation = false;

		Loading.show();

		Promise.resolve()
			.then(() => {
				return this.getCodeListByGroupCodeListService();
			})
			.then(() => {
				return this.getTableService(this.metaTableId);
			})
			.then(() => {
				if (_.isNil(this.table) === false) {
					this.statusSelectValueList = this.convertSelectValueCheckedValue(this.table.status, this.statusSelectValueList);
					this.featureSelectValueList = this.convertSelectValueCheckedValue(this.table.feature, this.featureSelectValueList);
					this.layerSelectValueList = this.convertSelectValueCheckedValue(this.table.layer, this.layerSelectValueList);
					this.historySelectValueList = this.convertSelectValueCheckedValue(this.table.history, this.historySelectValueList);
					this.cycleSelectValueList = this.convertSelectValueCheckedValue(this.table.cycle, this.cycleSelectValueList);
					this.retentionSelectValueList = this.convertSelectValueCheckedValue(this.table.retention, this.retentionSelectValueList);
					this.securitySelectValueList = this.convertSelectValueCheckedValue(this.table.security, this.securitySelectValueList);
					this.privacySelectValueList = this.convertSelectValueCheckedValue(this.table.privacy, this.privacySelectValueList);
				}
			})
			.then(() => {
				Loading.hide();
			})
			.catch(() => {
				Loading.hide();
			});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 *
	 */
	public cancel() {
		this.onCancel.emit();
	}

	/**
	 *
	 */
	public done() {

		if (_.isNil(this.table.physicalNm)) {
			this.table.isPhysicalNmValidation = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (_.isNil(this.subjectList) || this.subjectList.length === 0) {
			this.table.isSubjectListValidation = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		this.table.subjectIds = this.subjectList
			.map(subject => {
				return subject.id;
			});

		if (_.isNil(this.table.worker) === false) {
			this.table.workerId = this.table.worker.userId;
		}

		this.updateTable();
	}

	/**
	 * 관리 상태 변경 시
	 *
	 * @param $event
	 */
	public selectStatus($event) {
		this.table.statusId = $event.value.id;
	}

	/**
	 * 데이터 생성 특성 분류 변경 시
	 *
	 * @param $event
	 */
	public selectFeature($event) {
		this.table.featureId = $event.value.id;
	}

	/**
	 *
	 *
	 * @param $event
	 */
	public selectLayer($event) {
		this.table.layerId = $event.value.id;
	}

	/**
	 *
	 *
	 * @param $event
	 */
	public selectHistory($event) {
		this.table.historyId = $event.value.id;
	}

	/**
	 *
	 *
	 * @param $event
	 */
	public selectCycle($event) {
		this.table.cycleId = $event.value.id;
	}

	/**
	 *
	 *
	 * @param $event
	 */
	public selectRetention($event) {
		this.table.retentionId = $event.value.id;
	}

	/**
	 *
	 *
	 * @param $event
	 */
	public selectSecurity($event) {
		this.table.securityId = $event.value.id;
	}

	/**
	 *
	 *
	 * @param $event
	 */
	public selectPrivacy($event) {
		this.table.privacyId = $event.value.id;
	}

	/**
	 * 서브젝트 삭제
	 *
	 * @param index
	 */
	public deleteSubjectByIndex(index) {
		this.subjectList = Utils.ArrayUtil.remove(this.subjectList, index);
	}

	/**
	 *
	 */
	public deleteTableWorkerByIndex() {
		this.table.worker = undefined;
	}

	/**
	 * 담당자 선택 팝업 완료
	 *
	 * @param {User.Entity} users
	 */
	public doneWorkerUserSelectPopup(users: User.Entity[]): void {
		this.table.worker = users[ 0 ];
		this.isOpenWorkerUserSelectPopup = false;
	}

	/**
	 * 담당자 선택 팝업 닫기
	 */
	public closeWorkerUserSelectPopup() {
		this.isOpenWorkerUserSelectPopup = false;
	}

	/**
	 *
	 *
	 * @param subjects
	 */
	public doneSubjectSelect(subjects: Meta.Subject[]) {
		this.subjectList = subjects;
		this.isSubjectSelectPopupOpen = false;
	}

	/**
	 *
	 */
	public closeSubjectSelect() {
		this.isSubjectSelectPopupOpen = false;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 테이블 조회
	 *
	 * @param id
	 * @param isLoading
	 */
	private getTable(id: string, isLoading: boolean = true) {
		Promise.resolve()
			.then(() => {
				this.getTableService(id, isLoading);
			})
			.catch(() => {
				if (isLoading) {
					Loading.hide();
				}
			});
	}

	/**
	 * 테이블 조회
	 *
	 * @param {string} id
	 * @param isLoading
	 */
	private getTableService(id: string, isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		return this.metaService
			.getTable(id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.table = result.data.table;
					this.subjectList = result.data.subjectList;
				} else {
					this.table = new Meta.Table();
					this.subjectList = [];
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

				this.table.isPhysicalNmValidation = false;
				this.table.isSubjectListValidation = false;

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
	private updateTable(isLoading: boolean = true) {

		Promise.resolve()
			.then(() => {
				this.updateTableService(isLoading);
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
	private updateTableService(isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		return this.metaService
			.updateTableByTableId(this.table)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.onDone.emit();
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

				if (isLoading) {
					Loading.hide();
				}
			});
	}

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
	 *
	 */
	private getCodeListByGroupCodeListService() {
		return this.codeService
			.getCodeListByGroupCodeList(this.groupCodeList)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.statusSelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.statusGroupCode, result.data));
					this.featureSelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.featureGroupCode, result.data));
					this.layerSelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.layerGroupCode, result.data));
					this.historySelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.historyGroupCode, result.data));
					this.cycleSelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.cycleGroupCode, result.data));
					this.retentionSelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.retentionGroupCode, result.data));
					this.securitySelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.securityGroupCode, result.data));
					this.privacySelectValueList = this.createSelectValues(this.codeAllListFindGroupCode(this.privacyGroupCode, result.data));
				} else {
					this.statusSelectValueList = [];
					this.featureSelectValueList = [];
					this.layerSelectValueList = [];
					this.historySelectValueList = [];
					this.cycleSelectValueList = [];
					this.retentionSelectValueList = [];
					this.securitySelectValueList = [];
					this.privacySelectValueList = [];
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

}
