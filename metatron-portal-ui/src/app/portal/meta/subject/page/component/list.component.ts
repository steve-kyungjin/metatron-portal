import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {MetaService} from '../../../service/meta.service';
import {Meta} from '../../../value/meta';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {Page, Sort} from '../../../../common/value/result-value';
import {PaginationComponent} from '../../../../../common/component/pagination/pagination.component';
import {Observable, Subject} from 'rxjs';
import {SelectValue} from '../../../../../common/component/select/select.value';
import * as _ from 'lodash';
import {TreeNode} from '../../../../common/value/tree-node';

@Component({
	selector: '[subject-list]',
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
	 * 현재 페이지
	 *
	 * @type {number}
	 */
	private currentPage: number = 0;

	/**
	 * 검색어 인풋
	 */
	@ViewChild('keyWordInputElement')
	private keyWordInputElement: ElementRef;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 *
	 */
	public list: Meta.Subject[] = [];

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 테이블 목록 총 카운트
	 *
	 * @type {number}
	 */
	public tableTotalElements: number = 0;

	/**
	 *
	 */
	public keyWord: string = '';

	/**
	 * 검색
	 *
	 * @type {Subject<string>}
	 */
	public search$: Subject<string> = new Subject<string>();

	/**
	 * DW 페이지 사이즈 셀렉트 아이템 목록
	 */
	public pageSizeList = _.cloneDeep(this.metaService.createDwPageSizeSelectValueList());

	/**
	 * 트리에서 선택된 주제영역
	 */
	public treeNodeSelectedSubject: TreeNode<Meta.Subject> = null;

	/**
	 * 선택된 주제영역
	 */
	public selectedSubject: Meta.Subject = null;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param metaService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private metaService: MetaService) {
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

		// this.getList();

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

	public onAllSelected() {
		this.treeNodeSelectedSubject = null;
		this.selectedSubject = null;
		this.keyWord = '';
		this.keyWordInputElement.nativeElement.value = '';
		this.pagingInit();
		this.getList();
	}

	public onSubjectSelected($event) {
		this.treeNodeSelectedSubject = $event;
		this.selectedSubject = null;
		this.keyWord = '';
		this.keyWordInputElement.nativeElement.value = '';
		this.pagingInit();
		this.getList();
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
	 *
	 * @param isLoading
	 */
	private getList(isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		this.metaService
			.getSubjectList(this.keyWord, this.treeNodeSelectedSubject === null ? null : this.treeNodeSelectedSubject.value.id, this.page)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.subjectList);
					this.pagination.init(this.page);
					this.list = result.data.subjectList.content;
					this.tableTotalElements = result.data.subjectList.totalElements;
				} else {
					this.pagingInit();
					this.list = [];
					this.tableTotalElements = 0;
				}

				if (isLoading) {
					Loading.hide();
				}
			});
	}

}
