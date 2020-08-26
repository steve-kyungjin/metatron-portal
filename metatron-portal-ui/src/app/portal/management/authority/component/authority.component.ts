import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Page, Sort} from '../../../common/value/result-value';
import {PaginationComponent} from '../../../../common/component/pagination/pagination.component';
import {TranslateService} from 'ng2-translate';
import {DialogService} from '../../../../common/component/dialog/dialog.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import {RequestApprovalService} from '../service/request-approval.service';
import {RoleGroup} from '../../../common/value/role-group';
import {AuthorityService} from '../service/authority.service';
import {Observable, Subject} from 'rxjs';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Loading} from '../../../../common/util/loading-util';
import {Authority} from '../value/authority.value';

@Component({
	selector: 'authority',
	templateUrl: 'authority.component.html'
})
export class AuthorityComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 검색
	 *
	 * @type {Subject<string>}
	 */
	public search$: Subject<string> = new Subject<string>();

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
	 * 검색어
	 */
	public searchText: string;

	/**
	 * 페이지
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 그룹/조직 목록
	 */
	public authorityList: Authority.Entity[];

	/**
	 * 선택 탭 인덱스
	 * @type {number}
	 */
	public selectedTabIndex: number = 0;

	/**
	 * 그룹 총 카운트
	 * @type {number}
	 */
	public groupCount: number = 0;

	/**
	 * 조직 총 카운트
	 * @type {number}
	 */
	public orgCount: number = 0;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param translateService
	 * @param dialogService
	 * @param translateService
	 * @param dialogService
	 * @param {RequestApprovalService} authenticationService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private dialogService: DialogService,
				private authorityService: AuthorityService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.pageReset();
		this.getAuthorityList();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	public selectTab(index: number) {
		this.selectedTabIndex = index;
		this.searchText = '';
		this.pageReset();
		this.getAuthorityList();
	}

	/**
	 * 검색 클릭
	 * @param searchValue
	 */
	public searchClick() {
		this.pageReset();
		this.getAuthorityList();
	}

	/**
	 * 페이징에서 선택한 페이지로 리로드
	 *
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {

		this.currentPage = currentPage;
		this.page.number = this.currentPage;

		this.getAuthorityList();
	}

	/**
	 * 권한 클릭
	 * @param authority
	 */
	public authorityClick(authority: Authority.Entity) {
		this.router.navigate([ `view/management/authority/${authority.id}` ]);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 권한 목록 조회
	 */
	private getAuthorityList() {
		Loading.show();

		const type = this.selectedTabIndex == 0 ? RoleGroup.RoleGroupType.GENERAL : RoleGroup.RoleGroupType.ORGANIZATION;
		this.authorityService.getAuthorityList(type, this.searchText, this.page).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.groupCount = result.data.counts.GENERAL;
				this.orgCount = result.data.counts.ORGANIZATION;
				this.page = result.data.groupList;
				this.pagination.init(this.page);
				this.authorityList = result.data.groupList.content;
			}
			Loading.hide();
		}).catch(reason => {
			Loading.hide();
		});
	}

	// 페이지 초기화
	private pageReset() {
		this.page = new Page();
		// 현재 페이지
		this.page.number = 0;
		// 페이지 사이즈
		this.page.size = 10;
		this.page.sort = new Sort();
		// sort
		this.page.sort.property = 'createdDate,desc';
		// sort
		this.page.sort.direction = 'desc';
	}
}
