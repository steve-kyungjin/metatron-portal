import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {MetaService} from '../../service/meta.service';
import {TranslateService} from 'ng2-translate';
import {CookieService} from 'ng2-cookies';
import * as _ from 'lodash';
import {Observable, Subject} from 'rxjs';
import {Page, Sort} from '../../../common/value/result-value';
import {PaginationComponent} from '../../../../common/component/pagination/pagination.component';
import {SelectValue} from '../../../../common/component/select/select.value';
import {Loading} from '../../../../common/util/loading-util';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Meta} from '../../value/meta';

@Component({
	selector: '[dictionary-list]',
	templateUrl: './list.component.html'
})
export class ListComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 현재 페이지
	 *
	 * @type {number}
	 */
	private currentPage: number = 0;

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

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * DW 페이지 사이즈 셀렉트 아이템 목록
	 */
	public pageSizeList = _.cloneDeep(this.metaService.createDwPageSizeSelectValueList());

	/**
	 * 검색
	 *
	 * @type {Subject<string>}
	 */
	public search$: Subject<string> = new Subject<string>();

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 총 엘리먼트 카운트
	 */
	public totalElements: number = 0;

	/**
	 * 목록
	 */
	public list: (Meta.Dictionary)[] = [];

	/**
	 *
	 */
	public selectedDictionary: Meta.Dictionary = null;

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
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private metaService: MetaService,
				private translateService: TranslateService,
				private cookieService: CookieService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

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
					this.getList();
				})
		);

		this.getList();

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
		this.getList();
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
		this.getList();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private getList() {

		Loading.show();

		this.metaService
			.getDictionarys(this.keyWord, this.page)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.dictionaryList);
					this.pagination.init(this.page);
					this.list = result.data.dictionaryList.content;
					this.totalElements = this.page.totalElements;
				} else {
					this.pagingInit();
					this.list = [];
					this.totalElements = 0;
				}

				Loading.hide();
			});
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
