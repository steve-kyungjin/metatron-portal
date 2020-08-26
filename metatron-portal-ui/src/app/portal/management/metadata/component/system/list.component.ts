import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {MetaService} from '../../../../meta/service/meta.service';
import * as _ from 'lodash';
import {SelectValue} from '../../../../../common/component/select/select.value';
import {PaginationComponent} from '../../../../../common/component/pagination/pagination.component';
import {Meta} from '../../../../meta/value/meta';
import {Page, Sort} from '../../../../common/value/result-value';
import {Observable, Subject} from 'rxjs';
import {TranslateService} from 'ng2-translate';
import {CookieService} from 'ng2-cookies';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {CookieConstant} from '../../../../common/constant/cookie-constant';
import {DialogService} from '../../../../../common/component/dialog/dialog.service';
import {Alert} from '../../../../../common/util/alert-util';

@Component({
	selector: '[system-list]',
	templateUrl: './list.component.html'
})
export class ListComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 *
	 */
	private selectedOperatingSystemAndInformationSystemClassificationCode: SelectValue;

	/**
	 *
	 */
	private selectedDataWarehouseInterlinkDirectionCode: SelectValue;

	/**
	 * 타겟 셀렉트박스 아이템 목록
	 */
	public selectedTarget: SelectValue;

	/**
	 * 검색어
	 *
	 * @type {string}
	 */
	public keyWord: string = '';

	/**
	 * 페이징 컴포넌트
	 */
	@ViewChild(PaginationComponent)
	private pagination: PaginationComponent;

	/**
	 * 타겟 목록 전체
	 *
	 * @type {SelectValue}
	 */
	public defaultTargetAllItem: SelectValue = new SelectValue(this.translateService.instant('META.DATA.SELECT.ALL', '전체'), Meta.SystemTarget.ALL, true);

	// noinspection JSUnusedGlobalSymbols
	/**
	 * 시스템 타겟 목록
	 *
	 * @type {SelectValue[]}
	 */
	public defaultTargetList: SelectValue[] = [
		_.cloneDeep(this.defaultTargetAllItem),
		new SelectValue(this.translateService.instant('META.DATA.SELECT.SYSTEM.STANDARD.NAME', '시스템 표준명'), Meta.SystemTarget.STD, false),
		new SelectValue(this.translateService.instant('META.DATA.SELECT.FULL.SYSTEM.NAME', '시스템 전체명'), Meta.SystemTarget.FULL, false)
	];

	/**
	 * 현재 페이지
	 *
	 * @type {number}
	 */
	private currentPage: number = 0;

	/**
	 * 연게 시스템 생성/수정 레이어 생성/수정 구분값
	 */
	public isEditMode: boolean = false;

	/**
	 * 연계 시스템 생성/수정 레이어 팝업 보여줄지 여부
	 */
	public isShowCreateOrUpdateLayer: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 총 엘리먼트 카운트
	 */
	public totalElements: number = 0;

	/**
	 * 목록
	 */
	public list: Meta.System[] = [];

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 운영계/정보계 분류 코드 목록
	 */
	public operatingSystemAndInformationSystemClassificationCodeList: SelectValue[] = [];

	/**
	 * 데이터 웨어하우스 연동 방향 코드 목록
	 */
	public dataWarehouseInterlinkDirectionCodeList: SelectValue[] = [];

	/**
	 * 검색
	 *
	 * @type {Subject<string>}
	 */
	public search$: Subject<string> = new Subject<string>();

	/**
	 * 선택된 시스템
	 *
	 * @type {null}
	 */
	public selectedSystem: Meta.System = null;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param metaService
	 * @param translateService
	 * @param cookieService
	 * @param dialogService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private metaService: MetaService,
				private translateService: TranslateService,
				private cookieService: CookieService,
				private dialogService: DialogService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 셀렉트 박스 첫 번째 값을 기본 선택된 값으로 처리
		this.selectedTarget = _.cloneDeep(this.defaultTargetAllItem);

		// 페이징 기본값 세팅
		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		// 검색
		// noinspection JSUnusedLocalSymbols
		this.subscriptions.push(
			this.search$
				.switchMap((value) => Observable.of<string>(value))
				.subscribe((value) => {
					this.keyWord = value.trim();
					this.pagingInit();
					this.getSystemList();
				})
		);

		this.getSystemList();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 페이징에서 선택한 페이지로 리로드
	 *
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {
		this.currentPage = currentPage;
		this.page.number = this.currentPage;
		this.getSystemList();
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * 운영계/정보계 분류 코드 선택 시
	 *
	 * @param $event
	 */
	public onOperatingSystemAndInformationSystemClassificationCodeSelect($event) {
		this.selectedOperatingSystemAndInformationSystemClassificationCode = $event;
		this.pagingInit();
		this.getSystemList();
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * 데이터 웨어하우스 연동 방향 분류 코드 선택 시
	 *
	 * @param $event
	 */
	public onDataWarehouseInterlinkDirectionCodeSelect($event) {
		this.selectedDataWarehouseInterlinkDirectionCode = $event;
		this.pagingInit();
		this.getSystemList();
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * 타겟 선택 시
	 *
	 * @param $event
	 */
	public onTargetSelect($event) {
		this.logger.debug(`[${this[ '__proto__' ].constructor.name} onTargetSelect() $event`, $event);
		this.selectedTarget = $event;
	}

	/**
	 * 페이지 사이즈 변경 시
	 *
	 * @param $event
	 */
	public onPageSizeSelect($event: SelectValue) {
		this.page.number = 0;
		const pageSize = $event.value;
		this.page.size = pageSize;
		this.metaService.setDwPageSize(pageSize);
		this.getSystemList();
	}

	/**
	 * 데이터 주제영역 삭제 컨펌 모달 열기
	 *
	 * @param id
	 */
	public openDeleteSubjectConfirmModal(id: string): void {
		this.dialogService
			.confirm(
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제하시겠습니까?'),
				null,
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.CONFIRM', '확인'),
				() => {
					this.logger.debug(`연계 시스템 삭제 컨펌 취소 클릭`);
				},
				() => {
					this.deleteSystemById(id);
				});
	}

	/**
	 * 시스템 삭제
	 *
	 * @param {string} appId
	 */
	private deleteSystemById(appId: string): void {

		Loading.show();

		this.metaService
			.deleteSystemById(appId)
			.then(result => {

				Loading.hide();

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
					this.pagingInit();
					this.getSystemList();
				} else {
					Alert.warning('삭제할 수 없습니다.');
				}
			});
	}

	/**
	 * 시스템 생성 완료
	 */
	public createSystemDone(): void {
		this.isShowCreateOrUpdateLayer = false;
		this.pagingInit();
		this.getSystemList();
	}

	public selectSystem(system) {
		this.selectedSystem = system;
		this.isEditMode = true;
		this.isShowCreateOrUpdateLayer = true;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// noinspection JSUnusedLocalSymbols
	/**
	 * 운영계/정보계 분류 코드 조회
	 *
	 * @param isLoading
	 */
	private getOperatingSystemAndInformationSystemClassificationCode(isLoading: boolean = true) {

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

				this.putEntireSelectionBoxInOperatingAndInformationSystemClassificationCodeList();

				this.selectedOperatingSystemAndInformationSystemClassificationCode = this.operatingSystemAndInformationSystemClassificationCodeList[ 0 ];

				if (isLoading === true) {
					Loading.hide();
				}
			})
			.catch(error => {
				Loading.hide();
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	// noinspection JSUnusedLocalSymbols
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

				this.putEntireSelectionBoxInDataWarehouseInterlinkDirectionCodeList();

				this.selectedDataWarehouseInterlinkDirectionCode = this.dataWarehouseInterlinkDirectionCodeList[ 0 ];

				if (isLoading === true) {
					Loading.hide();
				}
			})
			.catch(error => {
				Loading.hide();
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * DW 연계시스템 목록 조회
	 *
	 * @param isLoading
	 */
	private getSystemList(isLoading: boolean = true) {

		if (isLoading === true) {
			Loading.show();
		}

		return this.metaService
			.getSystemList(this.keyWord, this.page, null, null, Meta.SystemTarget.ALL)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.systemList);
					this.pagination.init(this.page);
					this.list = result.data.systemList.content;
					this.totalElements = this.page.totalElements;
				} else {
					this.pagingInit();
					this.list = [];
					this.totalElements = 0;
				}

				if (isLoading === true) {
					Loading.hide();
				}
			})
			.catch(error => {
				Loading.hide();
				this.totalElements = 0;
				this.pagingInit();
				this.list = [];
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 운영계/정보계 분류 코드 목록에 셀렉트박스 "전체" 아이템 넣기
	 */
	private putEntireSelectionBoxInOperatingAndInformationSystemClassificationCodeList() {
		this.operatingSystemAndInformationSystemClassificationCodeList.unshift(_.cloneDeep(this.defaultTargetAllItem));
	}

	/**
	 * 데이터 웨어하우스 연동 방향 코드 목록에 셀렉트박스 "전체" 아이템 넣기
	 */
	private putEntireSelectionBoxInDataWarehouseInterlinkDirectionCodeList() {
		this.dataWarehouseInterlinkDirectionCodeList.unshift(_.cloneDeep(this.defaultTargetAllItem));
	}

	/**
	 * 페이징 처리
	 *
	 * @param totalPage
	 */
	private pagingInit(totalPage: number = 0): void {
		this.page.totalPages = totalPage;
		this.page.number = 0;
		this.page.totalElements = 0;
		this.pagination.init(this.page);
	}

	/**
	 * 페이지 정보 세팅
	 *
	 * @param page
	 */
	private setPageInfo(page): void {
		this.page.first = page.first;
		this.page.last = page.last;
		this.page.number = page.number;
		this.page.numberOfElements = page.numberOfElements;
		this.page.size = page.size;
		this.page.totalElements = page.totalElements;
		this.page.totalPages = page.totalPages;
	}

}
