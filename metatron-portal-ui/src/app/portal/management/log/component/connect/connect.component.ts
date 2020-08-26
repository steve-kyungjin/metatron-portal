import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {PaginationComponent} from '../../../../../common/component/pagination/pagination.component';
import {Page, Sort} from '../../../../common/value/result-value';
import {Subject} from '../../../../../../../node_modules/rxjs/Subject';
import {Observable} from '../../../../../../../node_modules/rxjs/Observable';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {LogService} from '../../service/log.service';
import {ConnectLog} from '../../value/connect';

@Component({
	selector: '[connect]',
	templateUrl: './connect.component.html',
	host: { '[class.page-management-user]': 'true' }
})
export class ConnectComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 페이징 컴포넌트
	 */
	@ViewChild(PaginationComponent)
	private pagination: PaginationComponent;

	/**
	 * 현재 페이지
	 *
	 * @type {number}
	 */
	private currentPage: number = 0;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 목록
	 *
	 * @type {any[]}
	 */
	public list: ConnectLog.Entity[] = [];

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

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param logService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private logService: LogService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 검색
		this.subscriptions.push(
			this.search$
				.switchMap((value) => Observable.of<string>(value))
				.subscribe((value) => {
					this.pagingInit();
					this.keyWord = value.trim();
					this.getList();
				})
		);

		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'accessTime,desc';
		this.page.sort.direction = 'desc';

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

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private getList(isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		this.logService
			.getSystemConnectList(this.keyWord, this.page)
			.then((result) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.logList);
					this.pagination.init(this.page);
					this.list = result.data.logList.content;
				} else {
					this.pagingInit();
					this.list = [];
				}

				if (isLoading) {
					Loading.hide();
				}
			})
			.catch(error => {
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
	private pagingInit(totalPage: number = 0): void {
		this.page.totalPages = totalPage;
		this.page.number = 0;
		this.page.totalElements = 0;
		this.pagination.init(this.page);
	}

}
