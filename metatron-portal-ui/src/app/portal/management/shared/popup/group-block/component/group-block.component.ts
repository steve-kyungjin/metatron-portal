import {Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../../common/component/abstract.component';
import {PaginationComponent} from '../../../../../../common/component/pagination/pagination.component';
import {Page, Sort} from '../../../../../common/value/result-value';
import {Group} from '../../../../../common/value/group';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {CommonConstant} from '../../../../../common/constant/common-constant';
import {GroupService} from '../../../../../common/service/group.service';

@Component({
	selector: '[group-block]',
	templateUrl: './group-block.component.html',
	host: { '[class.group-block]': 'true' }
})
export class GroupBlockComponent extends AbstractComponent implements OnInit, OnDestroy {

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

	/**
	 * 선택시
	 *
	 * @type {EventEmitter<any>}
	 */
	@Output('oSelected')
	private selectedEvent: EventEmitter<Group.Entity> = new EventEmitter();

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
	public list: Group.Entity[] = [];

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
	 * @param {GroupService} groupService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private groupService: GroupService) {
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
		this.page.sort.property = 'createdDate,desc';
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

	/**
	 * 선택시
	 *
	 * @param {Group.Entity} group
	 */
	public selected(group: Group.Entity): void {
		this.selectedEvent.emit(group);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Loading show
	 */
	private showLoading() {
		this.elementRef.nativeElement.querySelector('.component-loading').setAttribute('aria-hidden', 'false');
	}

	/**
	 * Loading hide
	 */
	private hideLoading() {
		this.elementRef.nativeElement.querySelector('.component-loading').setAttribute('aria-hidden', 'true');
	}

	/**
	 * 목록 조회
	 */
	private getList(): void {

		this.showLoading();

		this.groupService
			.getList(this.keyWord, this.page)
			.then((result) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.groupList);
					this.pagination.init(this.page);
					this.list = result.data.groupList.content;
				} else {
					this.pagingInit();
					this.list = [];
				}

				this.hideLoading();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
				this.hideLoading();
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
