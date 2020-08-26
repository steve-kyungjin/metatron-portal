import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {PaginationComponent} from '../../../../common/component/pagination/pagination.component';
import * as _ from 'lodash';
import {Page, Sort} from '../../../common/value/result-value';
import {Observable, Subject} from 'rxjs';
import {SelectValue} from '../../../../common/component/select/select.value';
import {Meta} from '../../value/meta';
import {TranslateService} from 'ng2-translate';
import {MetaService} from '../../service/meta.service';
import {Loading} from '../../../../common/util/loading-util';
import {CommonConstant} from '../../../common/constant/common-constant';
import {CookieConstant} from '../../../common/constant/cookie-constant';
import {CookieService} from 'ng2-cookies';

@Component({
	selector: '[database-list]',
	templateUrl: './list.component.html',
	host: {
		'[class.page-data-search]': 'true',
		'[class.type-database]': 'true',
		'[class.type-fixed]': 'true'
	}
})
export class ListComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 페이징 컴포넌트
	 */
	@ViewChild(PaginationComponent)
	private pagination: PaginationComponent;

	/**
	 * 검색어 인풋
	 */
	@ViewChild('keyWordInputElement')
	private keyWordInputElement: ElementRef;

	/**
	 * 현재 페이지
	 *
	 * @type {number}
	 */
	private currentPage: number = 0;

	/**
	 *
	 */
	private selectedTarget: Meta.Target;

	/**
	 *
	 */
	private selectedLayer: SelectValue;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 타겟 목록 전체
	 *
	 * @type {SelectValue}
	 */
	public defaultTargetAllItem: SelectValue = new SelectValue(this.translateService.instant('META.DATA.SELECT.ALL', '전체'), 'ALL', true);

	/**
	 * 타겟 목록
	 *
	 * @type {SelectValue[]}
	 */
	public defaultTargetList: SelectValue[] = [
		_.cloneDeep(this.defaultTargetAllItem),
		new SelectValue(this.translateService.instant('META.DATA.SELECT.PHYSICAL', '물리명'), Meta.Target.PHYSICAL, false),
		new SelectValue(this.translateService.instant('META.DATA.SELECT.LOGICAL', '논리명'), Meta.Target.LOGICAL, false)
	];

	/**
	 * 기본 - 데이터 레이어 셀렉트박스 아이템 목록
	 */
	public defaultDataLayerItemList: SelectValue[] = [];

	/**
	 * 데이터 레이어 셀렉트박스 아이템 목록
	 *
	 * @type {SelectValue[]}
	 */
	public dataLayerItemList: SelectValue[] = [];

	/**
	 * 타겟 셀렉트박스 아이템 목록
	 */
	public targetSelectBoxItemList: SelectValue[] = [];

	/**
	 * 검색
	 *
	 * @type {Subject<string>}
	 */
	public search$: Subject<string> = new Subject<string>();

	/**
	 * 검색어
	 *
	 * @type {string}
	 */
	public keyWord: string = '';

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 *
	 */
	public databaseList: Meta.Database[] = [];

	/**
	 *
	 */
	public tableTotalElements: number = 0;

	/**
	 * 선택된 인스턴스
	 */
	public selectedInstance: Meta.Instance = null;

	/**
	 * 선택된 데이터베이스
	 *
	 * @type {null}
	 */
	public selectedDatabase: Meta.Database = null;

	/**
	 * 선택된 서브젝트 테이블
	 *
	 * @type {null}
	 */
	public selectedSubjectTable: Meta.Table = null;

	/**
	 * 선택된 서브젝트 컬럼
	 */
	public selectedSubjectColumn: Meta.Column = null;

	/**
	 * 트리에서 전체를 선택했는지 구분하기 위한 값
	 */
	public isInstanceAllSelected: boolean = true;

	/**
	 * DW 페이지 사이즈 셀렉트 아이템 목록
	 */
	public pageSizeList = _.cloneDeep(this.metaService.createDwPageSizeSelectValueList());

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param translateService
	 * @param metaService
	 * @param cookieService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private metaService: MetaService,
				private cookieService: CookieService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.tagging(this.TaggingType.LIST, this.TaggingAction.VIEW, this.gnbService.permission.name);

		Loading.show();

		// 셀렉트 박스 첫 번째 값을 기본 선택된 값으로 처리
		this.selectedTarget = Meta.Target.ALL;

		// 선택된 데이터 레이어 셀렉트박스
		this.selectedLayer = _.cloneDeep(this.defaultTargetAllItem);

		// 타겟 셀렉트박스 기본 아이템 세팅
		this.targetSelectBoxItemList = _.cloneDeep(this.defaultTargetList);

		// 트리에서 전체를 선택했는지 구분하기 위한 값
		this.isInstanceAllSelected = true;

		// 페이징 기본값 세팅
		this.page.number = 0;
		this.page.size = this.metaService.convertDwPageSizeNumber(this.metaService.getCookieDwPageSize());
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
					this.getDatabaseListService();
				})
		);

		Promise.resolve()
			.then(() => {
				return this.getDataLayerDiscriminationCode();
			})
			.then(() => {
				return this.initialize();
			})
			.then(() => {
				return this.getDatabaseList(false);
			})
			.then(() => {
				return Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
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
	 * 페이징에서 선택한 페이지로 리로드
	 *
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {
		this.currentPage = currentPage;
		this.page.number = this.currentPage;
		this.getDatabaseListService();
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 데이터 레이어 선택 이벤트
	 *
	 * @param $event
	 */
	public onDataLayerSelect($event): void {
		this.selectedLayer = $event;
		this.pagingInit();
		this.getDatabaseListService();
	}

	/**
	 * onInstanceAllSelected
	 *
	 * @param $event
	 */
	public onInstanceAllSelected($event) {
		this.isInstanceAllSelected = true;
		this.initialize();
		this.getDatabaseListService();
	}

	/**
	 * 인스턴스 선택시
	 *
	 * @param $event
	 */
	public onSelectedInstance($event) {
		this.isInstanceAllSelected = false;
		this.logger.debug(`[${this[ '__proto__' ].constructor.name} onSelectedInstance() $event`, $event);
		this.initialize();
		this.selectedInstance = $event.value;
		this.getDatabaseListService();
	}

	/**
	 * 타겟 선택 이벤트
	 *
	 * @param {SelectValue} $event
	 */
	public targetSelect($event: SelectValue) {
		this.selectedTarget = $event.value;
	}

	/**
	 *
	 * @param column
	 * @constructor
	 */
	public OnSelectedSubjectColumn(column: Meta.Column) {
		this.selectedSubjectColumn = column;
	}

	/**
	 *
	 * @param table
	 * @constructor
	 */
	public OnSelectedSubjectTable(table: Meta.Table) {
		this.selectedSubjectTable = null;
		this.selectedSubjectColumn = null;
		setTimeout(() => {
			const metaTable = new Meta.Table();
			metaTable.id = table.id;
			this.selectedSubjectTable = metaTable;
		}, 10);
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
		this.getDatabaseListService();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

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

	/**
	 * 데이터베이스 목록 조회
	 *
	 * @param isLoading
	 */
	private getDatabaseList(isLoading: boolean = true) {

		let instanceId: string = null;

		if (this.isInstanceAllSelected === true) {
			instanceId = 'all';
		} else {

			if (this.selectedInstance === null) {
				return;
			}

			instanceId = this.selectedInstance.id
		}

		if (!instanceId) {
			return;
		}

		if (isLoading) {
			Loading.show();
		}

		this.metaService
			.getDatabaseList(instanceId, this.selectedTarget, this.selectedLayer.value === `ALL` ? null : this.selectedLayer.value.id, this.keyWord, this.page)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.databaseList);
					this.pagination.init(this.page);
					this.databaseList = result.data.databaseList.content;
					this.tableTotalElements = result.data.databaseList.totalElements;
				} else {
					this.pagingInit();
					this.databaseList = [];
					this.tableTotalElements = 0;
				}

				if (isLoading) {
					Loading.hide();
				}
			})
			.catch(error => {
				throw new Error(error);
			});
	}

	/**
	 * 데이터 계층(LAYER) 구분 코드 조회
	 */
	private getDataLayerDiscriminationCode() {

		return this.codeService
			.getCodesByGrpCdKey('GRPID_DAT_L0')
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
					this.dataLayerItemList = typeListTemp;
				} else {
					this.dataLayerItemList = [];
				}

				this.setDataLayerSelectBoxAllItem();

				this.defaultDataLayerItemList = _.cloneDeep(this.dataLayerItemList);
			})
			.catch(error => {
				throw new Error(error);
			});
	}

	/**
	 * 데이터 레이어 셀렉트박스 "전체" 아이템 넣기
	 */
	private setDataLayerSelectBoxAllItem() {
		this.dataLayerItemList.unshift(_.cloneDeep(this.defaultTargetAllItem));
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
	 *
	 */
	private initialize() {
		this.databaseList = [];
		this.keyWordInputElement.nativeElement.value = '';
		this.selectedInstance = null;
		this.selectedTarget = Meta.Target.ALL;
		this.targetSelectBoxItemList = _.cloneDeep(this.defaultTargetList);
		this.selectedLayer = _.cloneDeep(this.defaultTargetAllItem);
		this.dataLayerItemList = _.cloneDeep(this.defaultDataLayerItemList);
		this.tableTotalElements = 0;
		this.pagingInit();
	}

	/**
	 * 에러 로그 출력
	 *
	 * @param error
	 */
	private errorLogPrint(error): void {
		this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
	}

	/**
	 * 데이터베이스 조회
	 *
	 * @param isLoading
	 */
	private getDatabaseListService(isLoading: boolean = true): void {

		this.keyWordInputElement.nativeElement.value = this.keyWord;

		Promise.resolve()
			.then(() => {
				return this.getDatabaseList();
			})
			.catch(error => {
				Loading.hide();
				this.errorLogPrint(error);
			});
	}

}
