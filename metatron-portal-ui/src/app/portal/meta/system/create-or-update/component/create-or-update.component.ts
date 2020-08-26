import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {TranslateService} from 'ng2-translate';
import {Meta} from '../../../value/meta';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {SelectValue} from '../../../../../common/component/select/select.value';
import {CookieConstant} from '../../../../common/constant/cookie-constant';
import {CookieService} from 'ng2-cookies';
import {UserService} from '../../../../common/service/user.service';
import {User} from '../../../../common/value/user';
import {MetaService} from '../../../service/meta.service';
import * as _ from 'lodash';
import {Alert} from '../../../../../common/util/alert-util';

@Component({
	selector: '[system-create-or-update]',
	templateUrl: './create-or-update.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class CreateOrUpdateComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 취소
	 */
	@Output()
	private onCancel = new EventEmitter();

	/**
	 * 적용
	 */
	@Output()
	private onDone = new EventEmitter();

	/**
	 * 선택된 운영계/정보계 분류 코드
	 */
	private selectedOperatingSystemAndInformationSystemClassificationCode: SelectValue;

	/**
	 * 선택된 연동방향 코드
	 */
	private selectedDataWarehouseInterlinkDirectionCode: SelectValue;

	/**
	 * 선택된 레벨구분 코드
	 */
	private selectedLevelClassificationCode: SelectValue;

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
	 * 시스템 아이디
	 */
	@Input()
	public systemId: string = '';

	/**
	 * 시스템
	 */
	public system: Meta.System = new Meta.System();

	/**
	 * 운영계/정보계 분류 코드 목록
	 */
	public operatingSystemAndInformationSystemClassificationCodeList: SelectValue[] = [];

	/**
	 * 데이터 웨어하우스 연동 방향 코드 목록
	 */
	public dataWarehouseInterlinkDirectionCodeList: SelectValue[] = [];

	/**
	 * 레벨구분 코드 목록
	 */
	public levelClassificationCodeList: SelectValue[] = [];

	/**
	 * 관리 담당자 선택 팝업 오픈 여부
	 */
	public isOpenWorkerUserSelectPopup: boolean = false;

	/**
	 * 관리 담당자(지원) 선택 팝업 오픈 여부
	 */
	public isOpenCoWorkerUserSelectPopup: boolean = false;

	/**
	 * 상위 시스템 선택 팝업 오픈 여부
	 */
	public isParentSystemSelectPopupOpen: boolean = false;

	/**
	 * 선택된 상위 시스템
	 */
	public selectedParentSystem: Meta.System = null;

	/**
	 * 상위 시스템 선택시 선택하지 못하게 처리할 시스템 아이디 목록
	 */
	public notSelectionSystemIdList: string[] = [];

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
	 * @param metaService
	 * @param cookieService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				public userService: UserService,
				private metaService: MetaService,
				private cookieService: CookieService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.initialize();

		if (this.isEditMode) {

			if (_.isNil(this.systemId) || _.isEmpty(this.systemId)) {
				Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				this.onCancel.emit();
				return;
			}

			Promise.resolve()
				.then(() => {
					return Loading.show();
				})
				.then(() => {
					return this.getOperatingSystemAndInformationSystemClassificationCodeList(false);
				})
				.then(() => {
					return this.getDataWarehouseInterlinkDirectionCode(false);
				})
				.then(() => {
					return this.getLevelClassificationCodeList(false);
				})
				.then(() => {
					return this.getSystem(this.systemId);
				})
				.then(() => {
					return Loading.hide();
				})
				.catch(error => {
					Loading.hide();
					this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
				});

		} else {
			Promise.resolve()
				.then(() => {
					return Loading.show();
				})
				.then(() => {
					return this.getOperatingSystemAndInformationSystemClassificationCodeList(false);
				})
				.then(() => {
					return this.getDataWarehouseInterlinkDirectionCode(false);
				})
				.then(() => {
					return this.getLevelClassificationCodeList(false);
				})
				.then(() => {
					return Loading.hide();
				})
				.catch(error => {
					Loading.hide();
					this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
				});

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

		if (_.isNil(this.system.stdNm) || _.isEmpty(this.system.stdNm)) {
			this.system.isStdNmValidation = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (_.isNil(this.system.fullNm) || _.isEmpty(this.system.fullNm)) {
			this.system.isFullNmValidation = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (_.isNil(this.selectedParentSystem) === false && _.isEmpty(this.selectedParentSystem) === false) {
			this.system.parentId = this.selectedParentSystem.id;
		}

		if (_.isNil(this.system.worker) === false && _.isEmpty(this.system.worker) === false) {
			this.system.workerId = this.system.worker.userId;
		}

		if (_.isNil(this.system.coworker) === false && _.isEmpty(this.system.coworker) === false) {
			this.system.coworkerId = this.system.coworker.userId;
		}

		if (_.isNil(this.selectedOperatingSystemAndInformationSystemClassificationCode) === false && _.isEmpty(this.selectedOperatingSystemAndInformationSystemClassificationCode) === false) {
			this.system.operTypeId = this.selectedOperatingSystemAndInformationSystemClassificationCode.value.id;
		}

		if (_.isNil(this.selectedDataWarehouseInterlinkDirectionCode) === false && _.isEmpty(this.selectedDataWarehouseInterlinkDirectionCode) === false) {
			this.system.directionId = this.selectedDataWarehouseInterlinkDirectionCode.value.id;
		}

		if (_.isNil(this.selectedLevelClassificationCode) === false && _.isEmpty(this.selectedLevelClassificationCode) === false) {
			this.system.levelId = this.selectedLevelClassificationCode.value.id;
		}

		this.save();
	}

	/**
	 * 연계 시스템 관리 담당자 삭제
	 */
	public deleteSystemWorker() {
		this.system.worker = undefined;
	}

	/**
	 * 연계 시스템 관리 담당자(지원) 삭제
	 */
	public deleteSystemCoWorker() {
		this.system.coworker = undefined;
	}

	/**
	 * 운영계/정보계 분류 코드 선택 시
	 *
	 * @param $event
	 */
	public onOperatingSystemAndInformationSystemClassificationCodeSelect($event): void {
		this.selectedOperatingSystemAndInformationSystemClassificationCode = $event;
	}

	/**
	 * 데이터 웨어하우스 연동 방향 분류 코드 선택 시
	 *
	 * @param $event
	 */
	public onDataWarehouseInterlinkDirectionCodeSelect($event): void {
		this.selectedDataWarehouseInterlinkDirectionCode = $event;
	}

	/**
	 * 레분구분 코드 선택 시
	 *
	 * @param $event
	 */
	public onLevelClassificationCodeSelect($event): void {
		this.selectedLevelClassificationCode = $event;
	}

	/**
	 * 담당자 선택 팝업 완료
	 *
	 * @param {User.Entity} users
	 */
	public doneWorkerUserSelectPopup(users: User.Entity[]): void {
		this.system.worker = users[ 0 ];
		this.isOpenWorkerUserSelectPopup = false;
	}

	/**
	 * 담당자 선택 팝업 닫기
	 */
	public closeWorkerUserSelectPopup(): void {
		this.isOpenWorkerUserSelectPopup = false;
	}

	/**
	 * 담당자(지원) 선택 팝업 완료
	 *
	 * @param {User.Entity} users
	 */
	public doneCoWorkerUserSelectPopup(users: User.Entity[]): void {
		this.system.coworker = users[ 0 ];
		this.isOpenCoWorkerUserSelectPopup = false;
	}

	/**
	 * 담당자(지원) 선택 팝업 닫기
	 */
	public closeCoWorkerUserSelectPopup(): void {
		this.isOpenCoWorkerUserSelectPopup = false;
	}

	/**
	 * 선택된 상위 시스템 삭제
	 */
	public deleteSelectedParentSystem(): void {
		this.selectedParentSystem = null;
	}

	/**
	 * 선택된 상위 시스템 이름
	 */
	public getSelectedParentSystemName(): string {
		return this.selectedParentSystem === null ? '' : this.selectedParentSystem.stdNm;
	}

	/**
	 * 상위 시스템 선택 완료
	 *
	 * @param systems
	 */
	public parentSystemSelectComplete(systems: Meta.System[]): void {
		this.selectedParentSystem = systems[ 0 ];
		this.isParentSystemSelectPopupOpen = false;
	}

	/**
	 * 상위 시스템 선택 취소
	 */
	public parentSystemSelectCancel(): void {
		this.isParentSystemSelectPopupOpen = false;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 초기화
	 */
	private initialize(): void {
		this.system.stdNm = '';
		this.system.fullNm = '';
		this.system.relPurpose = '';
		this.system.isStdNmValidation = false;
		this.system.isFullNmValidation = false;
	}

	/**
	 * 운영계/정보계 분류 코드 조회
	 *
	 * @param isLoading
	 */
	private getOperatingSystemAndInformationSystemClassificationCodeList(isLoading: boolean = true) {

		if (isLoading === true) {
			Loading.show();
		}

		return this.codeService
			.getCodesByGrpCdKey('GRPID_SCAT_0')
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
					this.operatingSystemAndInformationSystemClassificationCodeList = typeListTemp;
				} else {
					this.operatingSystemAndInformationSystemClassificationCodeList = [];
				}

				if (isLoading === true) {
					Loading.hide();
				}
			});
	}

	/**
	 * DW 연동 방향 코드 조회
	 *
	 * @param isLoading
	 */
	private getDataWarehouseInterlinkDirectionCode(isLoading: boolean = true) {

		if (isLoading === true) {
			Loading.show();
		}

		return this.codeService
			.getCodesByGrpCdKey('GRPID_DWI_01')
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
					this.dataWarehouseInterlinkDirectionCodeList = typeListTemp;
				} else {
					this.dataWarehouseInterlinkDirectionCodeList = [];
				}

				if (isLoading === true) {
					Loading.hide();
				}
			});
	}

	/**
	 * 레벨구분 코드 조회
	 *
	 * @param isLoading
	 */
	private getLevelClassificationCodeList(isLoading: boolean = true) {

		if (isLoading === true) {
			Loading.show();
		}

		return this.codeService
			.getCodesByGrpCdKey('GRPID_SYS_L1')
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
					this.levelClassificationCodeList = typeListTemp;
				} else {
					this.levelClassificationCodeList = [];
				}

				if (isLoading === true) {
					Loading.hide();
				}
			});
	}

	/**
	 * 시스템 상세 조회
	 *
	 * @param id
	 */
	private getSystem(id) {
		return this.metaService
			.getSystem(id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					this.system = result.data.system;

					this.notSelectionSystemIdList = [ this.system.id ];

					if (_.isNil(this.system.parentId) === false
						&& _.isEmpty(this.system.parentStdNm) === false) {

						const parentSystem = new Meta.System();
						parentSystem.id = this.system.parentId;
						parentSystem.stdNm = this.system.parentStdNm;
						this.selectedParentSystem = parentSystem;
					}

					if (_.isNil(this.system.operType) === false
						&& _.isEmpty(this.system.operType.id) === false) {

						this.operatingSystemAndInformationSystemClassificationCodeList = this.selectOperatingSystemAndInformationSystemClassificationCodeList(this.system.operType.id);
					}

					if (_.isNil(this.system.direction) === false
						&& _.isEmpty(this.system.direction.id) === false) {

						this.dataWarehouseInterlinkDirectionCodeList = this.selectDataWarehouseInterlinkDirectionCodeList(this.system.direction.id);
					}

					if (_.isNil(this.system.level) === false
						&& _.isEmpty(this.system.level.id) === false) {

						this.levelClassificationCodeList = this.selectLevelClassificationCodeList(this.system.level.id);
					}
				}
			});
	}

	/**
	 * 운영계/정보계 분류 코드 목록 선택 처리
	 *
	 * @param id
	 */
	private selectOperatingSystemAndInformationSystemClassificationCodeList(id: string): SelectValue[] {
		const temp: SelectValue[] = _.cloneDeep(this.operatingSystemAndInformationSystemClassificationCodeList);
		temp.map(data => {
			return data.checked = data.value.id === id;
		});
		return temp;
	}

	/**
	 * 데이터 웨어하우스 연동 방향 코드 목록 선택 처리
	 *
	 * @param id
	 */
	private selectDataWarehouseInterlinkDirectionCodeList(id: string): SelectValue[] {
		const temp: SelectValue[] = _.cloneDeep(this.dataWarehouseInterlinkDirectionCodeList);
		temp.map(data => {
			return data.checked = data.value.id === id;
		});
		return temp;
	}

	/**
	 * 레벨구분 코드 목록 선택 처리
	 *
	 * @param id
	 */
	private selectLevelClassificationCodeList(id: string): SelectValue[] {
		const temp: SelectValue[] = _.cloneDeep(this.levelClassificationCodeList);
		temp.map(data => {
			return data.checked = data.value.id === id;
		});
		return temp;
	}

	/**
	 * 저장
	 */
	private save(): void {
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
			.createSystem(this.system)
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

		if (_.isNil(this.selectedParentSystem) || _.isEmpty(this.selectedParentSystem)) {
			this.system.parentId = undefined;
		}

		this.metaService
			.updateSystem(this.system)
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

}
