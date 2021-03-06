import {Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import {Meta} from '../../../value/meta';
import * as _ from 'lodash';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {TranslateService} from 'ng2-translate';
import {MetaService} from '../../../service/meta.service';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {Page, Sort} from '../../../../common/value/result-value';
import {SelectValue} from '../../../../../common/component/select/select.value';
import {PaginationComponent} from '../../../../../common/component/pagination/pagination.component';
import {Observable, Subject} from 'rxjs';
import {TableService} from '../../../service/table.service';
import {CookieConstant} from '../../../../common/constant/cookie-constant';
import {CookieService} from 'ng2-cookies';
import {PERMISSION_CODE} from '../../../../common/value/page-permission';

@Component({
	selector: '[subject-content]',
	templateUrl: './subject-content.component.html',
	host: { '[class.data-area]': 'true' }
})
export class SubjectContentComponent extends AbstractComponent implements OnInit {

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
	 * 선택된 타겟 값
	 */
	private selectedTarget: Meta.Target;

	/**
	 * 현재 페이지
	 *
	 * @type {number}
	 */
	private currentPage: number = 0;

	/**
	 *
	 */
	private selectedLayer: SelectValue;

	/**
	 * 타겟 목록 전체
	 *
	 * @type {SelectValue}
	 */
	private defaultTargetAllItem: SelectValue = new SelectValue(this.translateService.instant('META.DATA.SELECT.ALL', '전체'), 'ALL', true);

	/**
	 * 기본 - 데이터 레이어 셀렉트박스 아이템 목록
	 */
	private defaultDataLayerItemList: SelectValue[] = [];

	/**
	 * 타겟 목록
	 *
	 * @type {SelectValue[]}
	 */
	private DEFAULT_TARGET_LIST: SelectValue[] = [
		_.cloneDeep(this.defaultTargetAllItem),
		new SelectValue(this.translateService.instant('META.DATA.SELECT.PHYSICAL', '물리명'), Meta.Target.PHYSICAL, false),
		new SelectValue(this.translateService.instant('META.DATA.SELECT.LOGICAL', '논리명'), Meta.Target.LOGICAL, false)
	];

	/**
	 * criteriaId
	 */
	private criteriaId: string = null;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 서브젝트 테이블 목록
	 *
	 * @type {any[]}
	 */
	public subjectTableList: Meta.Table[] = [];

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 타겟 목록
	 *
	 * @type {SelectValue[]}
	 */
	public targetSelectBoxItemList: SelectValue[] = [];

	/**
	 * 데이터 레이어 셀렉트박스 아이템 목록
	 *
	 * @type {SelectValue[]}
	 */
	public dataLayerItemList: SelectValue[] = [];

	/**
	 * 테이블 목록 총 카운트
	 *
	 * @type {number}
	 */
	public tableTotalElements: number = 0;

	/**
	 * 검색어
	 *
	 * @type {string}
	 */
	public keyWord: string = '';

	/**
	 * 검색
	 *
	 * @type {Subject<string>}
	 */
	public search$: Subject<string> = new Subject<string>();

	/**
	 * 선택된 서브젝트
	 */
	public selectedSubject: Meta.Subject = null;

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
	 * @param tableService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private metaService: MetaService,
				private cookieService: CookieService,
				private tableService: TableService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 셀렉트 박스 기본 아이템 세팅
		this.targetSelectBoxItemList = _.cloneDeep(this.DEFAULT_TARGET_LIST);

		// 셀렉트 박스 첫 번째 값을 기본 선택된 값으로 처리
		this.selectedTarget = Meta.Target.ALL;

		// 선택된 데이터 레이어 셀렉트박스
		this.selectedLayer = _.cloneDeep(this.defaultTargetAllItem);

		//
		this.getDataLayerDiscriminationCode();

		// 페이징 기본값 세팅
		this.page.number = 0;
		this.page.size = this.metaService.convertDwPageSizeNumber(this.metaService.getCookieDwPageSize());
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		this.subscriptions.push(
			this.search$
				.switchMap((value) => Observable.of<string>(value))
				.subscribe((value) => {
					this.keyWord = value.trim();
					this.pagingInit();
					this.getTable();
				})
		);

		this.subscriptions.push(
			this.tableService
				.getTable$
				.subscribe(() => {
					this.getTable();
				})
		);

		this.subscriptions.push(
			this.tableService
				.selectedCriteriaId$
				.subscribe(criteriaId => {
					this.criteriaId = criteriaId;
				})
		);

		this.subscriptions.push(
			this.tableService
				.selected$
				.subscribe(subject => {
					this.selectedSubject = subject;
				})
		);

		this.subscriptions.push(
			this.tableService
				.initialize$
				.subscribe(() => {
					this.initialize();
				})
		);

		this.subscriptions.push(
			this.tableService
				.changePageSize$
				.subscribe(() => {
					this.pageSizeList = _.cloneDeep(this.metaService.createDwPageSizeSelectValueList());
					this.page.size = this.metaService.convertDwPageSizeNumber(this.metaService.getCookieDwPageSize());
					this.getTable();
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
	 * 페이징에서 선택한 페이지로 리로드
	 *
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {
		this.currentPage = currentPage;
		this.page.number = this.currentPage;
		this.getTable();
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
	 * 데이터 레이어 선택 이벤트
	 *
	 * @param $event
	 */
	public onDataLayerSelect($event): void {
		this.selectedLayer = $event;
		this.pagingInit();
		this.getTable();
	}

	/**
	 *
	 */
	public getSelectedSubjectName() {

		let name: string = '';
		const value = _.cloneDeep(this.selectedSubject);
		if (_.isUndefined(value) === false && value !== null) {
			name = value.nmKr;
		}

		return name;
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
		this.getTable();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 테이블 목록 조회
	 *
	 * @param isLoading
	 */
	private getTable(isLoading: boolean = true) {

		this.keyWordInputElement.nativeElement.value = this.keyWord;

		const entity: Meta.Subject | Meta.Instance = this.selectedSubject;

		if (_.isUndefined(entity)) {
			return;
		}

		if (_.isUndefined(entity.id) || _.isEmpty(entity.id)) {
			return;
		}

		if (isLoading) {
			Loading.show();
		}

		this.metaService
			.getSubjectTable(this.criteriaId ? 'all' : entity.id, this.selectedTarget, this.selectedLayer.value === `ALL` ? null : this.selectedLayer.value.id, this.keyWord, this.page, this.criteriaId)
			.then((result: Meta.Result.Subject.TableList) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.tableList);
					this.pagination.init(this.page);
					this.subjectTableList = result.data.tableList.content;
					this.tableTotalElements = result.data.tableList.totalElements;
				} else {
					this.pagingInit();
					this.subjectTableList = [];
					this.tableTotalElements = 0;
				}

				if (isLoading) {
					Loading.hide();
				}
			})
			.catch(error => {

				if (isLoading) {
					Loading.hide();
				}

				this.pagingInit();
				this.subjectTableList = [];
				this.tableTotalElements = 0;

				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
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

	/**
	 * 페이징 처리
	 *
	 * @param totalPage
	 */
	public pagingInit(totalPage: number = 0): void {
		this.page.totalPages = totalPage;
		this.page.number = 0;
		this.page.totalElements = 0;
		this.pagination.init(this.page);
	}

	/**
	 *
	 */
	public initialize() {
		this.selectedLayer = _.cloneDeep(this.defaultTargetAllItem);
		this.dataLayerItemList = _.cloneDeep(this.defaultDataLayerItemList);
		this.subjectTableList = [];
		this.targetSelectBoxItemList = _.cloneDeep(this.DEFAULT_TARGET_LIST);
		this.keyWordInputElement.nativeElement.value = '';
		this.tableTotalElements = 0;
		this.selectedTarget = Meta.Target.ALL;
		this.pagingInit();
	}

	/**
	 * 데이터 계층(LAYER) 구분 코드 조회
	 */
	private getDataLayerDiscriminationCode() {

		this.codeService
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

				Loading.hide();
			})
			.catch(error => {
				Loading.hide();
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 데이터 레이어 셀렉트박스 "전체" 아이템 넣기
	 */
	private setDataLayerSelectBoxAllItem() {
		this.dataLayerItemList.unshift(_.cloneDeep(this.defaultTargetAllItem));
	}

}
