import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../common/component/abstract.component';
import {ProjectService} from '../service/project.service';
import {Loading} from '../../../common/util/loading-util';
import {CommonConstant} from '../../common/constant/common-constant';
import {SelectValue} from '../../../common/component/select/select.value';
import {SelectComponent} from '../../../common/component/select/select.component';
import * as _ from 'lodash';
import {PaginationComponent} from '../../../common/component/pagination/pagination.component';
import {Page, Sort} from '../../common/value/result-value';
import {PERMISSION_CODE} from '../../common/value/page-permission';
import {Project} from '../value/project';

@Component({
	selector: '[list]',
	templateUrl: './list.component.html',
	host: { '[class.page-assignment]': 'true' }
})
export class ListComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 선택된 년도
	 *
	 * @type {number}
	 */
	private selectedYear: number = -1;

	/**
	 * 셀렉트 박스
	 */
	@ViewChild('selectBox')
	private selectBox: SelectComponent;

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
	 * 셀렉트 박스 년도 목록 아이템
	 *
	 * @type {SelectValue[]}
	 */
	public selectBoxYearListItem: SelectValue[] = [
		new SelectValue('전체', -1, true)
	];

	/**
	 * 프로젝트 목록
	 *
	 * @type {any[]}
	 */
	public list: Project.Entity[] = [];

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 진행 현황 한글 라벨
	 */
	public projectProgressLabel = Project.ProgressLabel;

	// 등록 가능 여부
	public enableCreate: boolean;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param {ProjectService} projectService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private projectService: ProjectService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.VIEW, this.gnbService.permission.name);

		// 권한 체크
		if (this.gnbService.permission.permission >= PERMISSION_CODE.RW) {
			this.enableCreate = true;
		} else {
			this.enableCreate = false;
		}

		// 셀렉트 박스 아이템 목록 생성
		this.createSelectBoxItemList();

		this.page.number = 0;
		this.page.size = 10;
		this.page.totalElements = 0;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		// 목록 조회
		this.getList();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// noinspection JSMethodCanBeStatic
	/**
	 * 진행현황 라벨 가져오기
	 *
	 * @param progress
	 */
	public getProgressLabel(progress): string {
		return Project.getProgressLabel(progress)
	};

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 페이징에서 선택한 페이지로 리로드
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {

		this.currentPage = currentPage;
		this.page.number = this.currentPage;

		this.getList();
	}

	/**
	 * 년도 셀렉트 박스 선택시
	 *
	 * @param $event
	 */
	public oSelectedYear($event): void {
		this.selectedYear = $event.value;
		this.pagingInit();
		this.getList();
	}

	/**
	 * 상세 페이지 이동
	 *
	 * @param {string} id
	 */
	public goDetail(id: string): void {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ `view/project/${id}` ]);
	}

	/**
	 * 등록 페이지로 이동
	 */
	public goCreatePage(): void {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ `view/project/create` ]);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 셀렉트박스 아이템 생성
	 */
	private createSelectBoxItemList(): void {

		const selectBoxYearListItemStartFullYear: number = 2017;
		const currentFullYear: number = new Date().getFullYear();
		_
			.range(selectBoxYearListItemStartFullYear, currentFullYear + 1)
			.forEach(year => this.selectBoxYearListItem.push(new SelectValue(year.toString(), year, false)));
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
	 * 목록 조회
	 */
	private getList(): void {

		Loading.show();

		this.projectService
			.getList(this.selectedYear, this.page)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.projectList);
					this.pagination.init(this.page);
					this.list = result.data.projectList.content;
				} else {
					this.list = [];
					this.pagingInit();
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}
}
