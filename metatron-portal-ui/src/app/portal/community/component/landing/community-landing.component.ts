import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {TranslateService} from 'ng2-translate';
import {CommunityService} from '../../service/community.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Community} from '../../value/community.value';
import {Page, Sort} from "../../../common/value/result-value";
import {PaginationComponent} from "../../../../common/component/pagination/pagination.component";
import {Loading} from "../../../../common/util/loading-util";
import Summary = Community.Summary;
import {SelectValue} from "../../../../common/component/select/select.value";

@Component({
	selector: 'community-landing',
	templateUrl: 'community-landing.component.html'
})
export class CommunityLandingComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Private Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 페이징 컴포넌트
	 */
	@ViewChild(PaginationComponent)
	private pagination: PaginationComponent;

	private noticeBoardList: SelectValue[];
	private guideBoardList: SelectValue[];
	private defaultBoardList: SelectValue[];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Protected Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Public Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public masterInfo: Community.Master = new Community.Master();

	public PostType: typeof Community.PostType = Community.PostType;
	public ListType: typeof Community.ListType = Community.ListType;
	public Status: typeof Community.Status = Community.Status;

	public page: Page;

	public postList: Community.Post[];

	public summaryAll: Community.Summary = new Community.Summary();
	public summaryMy: Community.Summary = new Community.Summary();
	public summaryNotice: Community.Summary = new Community.Summary();

	public category: Community.PostType;
	public slug: string = '';
	public searchKey: string = '';
	public searchInputText: string;
	public filterType: Community.FilterType;
	public filterMy: boolean;
	public sort: string;

	// 탭 목록
	public categoryList: Array<Object>;
	// 게시판 목록
	public boardList: Array<SelectValue>;
	// 정렬 목록
	public sortList: Array<Object>;
	// 필터 목록
	public filterList: Array<Object>;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Constructor
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private communityService: CommunityService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Override Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		super.ngOnInit();

		this.pageReset();

		// this.subscriptions.push(
		// 	this.activatedRoute
		// 		.params
		// 		.subscribe(params => {
		// 			if (params[ 'slug' ]) {
		// 				let slug = params[ 'slug' ];
		//
		// 				this.communityService.getLandinSummary().then(result => {
		// 					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
		//
		// 						this.summaryAll = result.data.allCount;
		// 						this.summaryMy = result.data.myCount;
		//
		// 						this.pagination.init(this.page);
		// 					}
		// 				});
		// 			}
		// 		})
		// );

		// 정렬 목록
		this.sortList = [
			{ title: this.translateService.instant('COMMUNITY.LANDING.SORT.TITLE1'), sort: 'createdDate', direction: 'desc', checked: true },
			{ title: this.translateService.instant('COMMUNITY.LANDING.SORT.TITLE2'), sort: 'title', direction: 'asc', checked: false },
			{ title: this.translateService.instant('COMMUNITY.LANDING.SORT.TITLE3'), sort: 'viewCnt', direction: 'desc', checked: false }
		];

		// 카테고리 목록
		this.categoryList = [
			{ title: this.translateService.instant('COMMUNITY.LANDING.CATEGORY.TITLE1'), value: Community.PostType.WORKFLOW, checked: true },
			{ title: this.translateService.instant('COMMUNITY.LANDING.CATEGORY.TITLE2'), value: Community.PostType.GENERAL, checked: false },
			{ title: this.translateService.instant('COMMUNITY.LANDING.CATEGORY.TITLE3'), value: Community.PostType.NOTICE, checked: false }
		];

		this.communityService.getLandinSummary().then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.summaryAll = result.data.allCount;
				this.summaryMy = result.data.myCount;
				this.summaryNotice = result.data.noticeCount;
			}
		});

		this.changeCategory(0);

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.VIEW, this.gnbService.permission.name);
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

		this.page.number = currentPage;
		this.doSearch();
	}

	/**
	 * 검색 클릭
	 * @param keyword
	 */
	public searchClick(keyword: string) {
		this.searchKey = keyword;
		this.page.number = 0;
		this.doSearch();

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.BTN, this.searchKey);
	}

	/**
	 * category 변경
	 * @param index
	 */
	public changeCategory(index: number, filterIndex: number = 0, option: string = null) {
		this.searchKey = '';
		this.slug = '';

		this.changeSort(0, false);

		Array.from(this.categoryList).forEach((value, idx) => {
			if (idx == index) {
				value['checked'] = true;
				this.category = value['value'];
			} else {
				value['checked'] = false;
			}
		});

		// 필터 목록
		if (this.category == Community.PostType.WORKFLOW) {
			this.filterList = [
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.VIEW.ALL'), value: Community.FilterType.REQ_ALL, my: false, checked: true },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE1'), value: Community.FilterType.REQ_LAST_3D, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE2'), value: Community.FilterType.REQ_ALL, my: true, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE3'), value: Community.FilterType.REQ_NOT_PROC, my: true, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE4'), value: Community.FilterType.REQ_INCOMPL, my: true, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE5'), value: Community.FilterType.REQ_COMPL, my: true, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE6'), value: Community.FilterType.REQ_NOT_PROC, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE7'), value: Community.FilterType.REQ_INCOMPL, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE8'), value: Community.FilterType.REQ_COMPL, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE9'), value: Community.FilterType.REQ_REVIEW, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE10'), value: Community.FilterType.REQ_PROG_NOR, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE11'), value: Community.FilterType.REQ_PROG_REV, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE12'), value: Community.FilterType.REQ_NO_WOR, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE13'), value: Community.FilterType.REQ_NO_COWOR, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE14'), value: Community.FilterType.REQ_WOR, my: true, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.REQUEST.TITLE15'), value: Community.FilterType.REQ_COWOR, my: true, checked: false }
			];
		} else if (this.category == Community.PostType.GENERAL) {
			this.filterList = [
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.VIEW.ALL'), value: Community.FilterType.QNA_ALL, my: false, checked: true },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.QNA.TITLE1'), value: Community.FilterType.QNA_NO_ANS, my: true, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.QNA.TITLE2'), value: Community.FilterType.QNA_ANS, my: true, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.QNA.TITLE3'), value: Community.FilterType.QNA_ALL, my: true, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.QNA.TITLE4'), value: Community.FilterType.QNA_NO_ANS, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.QNA.TITLE5'), value: Community.FilterType.QNA_ANS, my: false, checked: false }
			];
		} else {
			this.filterList = [
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.VIEW.ALL'), value: Community.FilterType.GUD_ALL, my: false, checked: true },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.NOTICE.TITLE1'), value: Community.FilterType.GUD_LAST_3D, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.NOTICE.TITLE2'), value: Community.FilterType.GUD_LAST_7D, my: false, checked: false },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.NOTICE.TITLE3'), value: Community.FilterType.GUD_ALL, my: false, checked: false, option: 'notice' },
				{ title: this.translateService.instant('COMMUNITY.LANDING.FILTER.NOTICE.TITLE4'), value: Community.FilterType.GUD_TIP, my: false, checked: false, option: 'guide' }
			];
		}

		Array.from(this.filterList).forEach((value, idx) => {
			if (idx == filterIndex) {
				value['checked'] = true;
				this.filterType = value['value'];
				this.filterMy = value['my'];
			} else {
				value['checked'] = false;
			}
		});

		// 게시판 목록 조회
		this.communityService.getMasterList(this.category).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				let list: SelectValue[] = [];
				this.noticeBoardList = [];
				this.guideBoardList = [];
				this.defaultBoardList = [];

				Array.from(result.data.masterList).forEach(value => {
					list.push(new SelectValue(value.name, value.slug, false));

					// NOTICE 형일 경우 선택한 필터마다 게시판 목록이 다르게 나와야 함
					if (this.category == Community.PostType.NOTICE) {
						if (value.slug == 'notice') {
							this.noticeBoardList.push(new SelectValue(value.name, value.slug, false));
						} else {
							this.guideBoardList.push(new SelectValue(value.name, value.slug, false));
						}

						this.defaultBoardList.push(new SelectValue(value.name, value.slug, false));
					}
				});

				if (this.category == Community.PostType.NOTICE) {
					this.setNoticeBoardList(option);
				} else {
					this.boardList = list;
				}
			}
		});

		if (option == 'notice') {
			this.slug = option;
		}

		this.doSearch();

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.ITEM, this.categoryList[index]['title']);
	}

	/**
	 * 게시판 선택
	 * @param item
	 */
	public boardSelect(item: SelectValue) {
		this.slug = item.value == 'ALL' ? '' : item.value;

		this.doSearch();

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.ITEM, this.slug);
	}

	/**
	 * 정렬 변경
	 */
	public changeSort(index, search: boolean = true) {
		const sort = this.sortList[ index ][ 'sort' ];
		const direction = this.sortList[ index ][ 'direction' ];
		this.page.sort.property = sort;
		this.page.sort.direction = direction;
		this.page.number = 0;
		this.sort = this.sortList[index]['sort'];

		if (search) {
			this.doSearch();
		}

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.BTN, this.sortList[ index ][ 'title' ]);
	}

	/**
	 * 필터 변경
	 * @param index
	 */
	public changeFilter(index) {
		let option;
		Array.from(this.filterList).forEach((value, idx) => {
			if (idx == index) {
				value['checked'] = true;
				this.filterType = value['value'];
				this.filterMy = value['my'];
				option = value['option'];
			} else {
				value['checked'] = false;
			}
		});

		if (this.category == Community.PostType.NOTICE) {
			this.setNoticeBoardList(option);
		}

		this.page.number = 0;
		this.doSearch();

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.ITEM, this.filterList[ index ][ 'title' ]);
	}

	/**
	 * 건수 표시
	 */
	public displayCount(cnt: number) {
		return cnt > 99 ? '99+' : cnt;
	}

	/**
	 * 포스트 클릭
	 * @param {Community.Post} item
	 */
	public postClick(item: Community.Post) {
		this.router.navigate([ `view${item.master.prePath}/${item.master.slug}/post/${item.id}` ]);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Protected Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Private Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 페이지 초기화
	private pageReset() {
		this.page = new Page();
		// 현재 페이지
		this.page.number = 0;
		// 페이지 사이즈
		this.page.size = 10;
		this.page.sort = new Sort();
		// sort
		this.page.sort.property = 'createdDate';
		// sort
		this.page.sort.direction = 'desc';
	}

	/**
	 * 포스트 목록 조회
	 */
	private doSearch() {
		Loading.show();
		this.searchInputText = this.searchKey;

		this.communityService.getLandingPostList(this.category, this.filterType, this.filterMy, this.slug, this.page, this.searchKey).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.postList = result.data.postList.content;
				this.page = result.data.postList;

				Array.from(this.postList).forEach(value => {
					value.className = this.communityService.getStatus(value);
				});

				this.pagination.init(this.page);
			}

			Loading.hide();
		});
	}

	/**
	 * 게시판 목록 설정(NOTICE 형일 경우만)
	 * @param option
	 */
	private setNoticeBoardList(option: string) {
		this.slug = '';
		let boardList = [];

		if (option == 'notice') {
			// 게시판 선택 초기화
			Array.from(this.noticeBoardList).forEach((value, idx) => {
				let checked = false;
				if (idx == 0) {
					value.checked = true;
				}
				boardList.push(new SelectValue(value.label, value.value, checked));
			});
			this.slug = 'notice';
		} else if (option == 'guide') {
			// 게시판 선택 초기화
			Array.from(this.guideBoardList).forEach((value, idx) => {
				let checked = false;
				if (idx == 0) {
					value.checked = true;
				}
				boardList.push(new SelectValue(value.label, value.value, checked));
			});
		} else {
			// 게시판 선택 초기화
			Array.from(this.defaultBoardList).forEach((value, idx) => {
				let checked = false;
				if (idx == 0) {
					value.checked = true;
				}
				boardList.push(new SelectValue(value.label, value.value, checked));
			});
		}

		this.boardList = boardList;
	}

}
