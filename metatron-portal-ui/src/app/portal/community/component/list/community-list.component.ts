import {ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {TranslateService} from 'ng2-translate';
import {CommunityService} from '../../service/community.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Page, Sort} from 'app/portal/common/value/result-value';
import {Community} from '../../value/community.value';
import {Loading} from '../../../../common/util/loading-util';
import {DialogService} from '../../../../common/component/dialog/dialog.service';
import {PERMISSION_CODE} from '../../../common/value/page-permission';

export class CommunityListComponent extends AbstractComponent implements OnInit, OnDestroy, OnChanges {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	protected pageSize: number = 10;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Input()
	public masterInfo: Community.Master = new Community.Master();

	public page: Page;

	public postList: Community.Post[];

	public searchKey: string = '';

	public searchInputText: string;

	public searchStatus: Community.Status = Community.Status.NONE;

	// 작성 가능 여부
	public enableCreate: boolean = true;

	public PostType: typeof Community.PostType = Community.PostType;

	public Status: typeof Community.Status = Community.Status;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				protected communityService: CommunityService,
				protected dialogService: DialogService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		super.ngOnInit();

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.VIEW, this.gnbService.permission.name);
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		for (let propName in changes) {
			if (propName === 'masterInfo') {
				if ((this.gnbService.permission.permission >= PERMISSION_CODE.RW && this.masterInfo.postType != Community.PostType.NOTICE) ||
					this.gnbService.permission.permission == PERMISSION_CODE.SA && this.masterInfo.postType == Community.PostType.NOTICE) {
					this.enableCreate = true;
				} else {
					this.enableCreate = false;
				}

				this.pageReset();

				this.searchKey = '';
				this.searchStatus = Community.Status.NONE;
				this.postList = null;
				this.doSearch();
			}
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * get post list
	 * @param {boolean} isMoreView
	 */
	protected doSearch(isMoreView: boolean = false) {
		Loading.show();
		this.searchInputText = this.searchKey;

		this.communityService.getPostList(this.masterInfo.slug, this.page, this.searchKey, this.searchStatus).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				let postList = result.data.postList.content;
				this.page = result.data.postList;

				this.initList(postList, isMoreView);
			}
			Loading.hide();
		});
	}

	/**
	 * 목록 초기화
	 * @param {Community.Post[]} postList
	 * @param {boolean} isMoreView
	 */
	protected initList(postList: Community.Post[], isMoreView: boolean) {
		if (isMoreView) {
			if (!this.postList) {
				this.postList = [];
			}
			this.postList = this.postList.concat(postList);
		} else {
			this.postList = postList;
		}
	}

	/**
	 * 상세 페이지 이동
	 * @param {Community.Post} post
	 */
	protected goDetail(post: Community.Post) {
		this.router.navigate([ `view${this.masterInfo.prePath}/${this.masterInfo.slug}/post/${post.id}` ]);
	}

	/**
	 * 등록 페이지 이동
	 */
	protected goCreate() {
		this.router.navigate([ `view${this.masterInfo.prePath}/${this.masterInfo.slug}/post/create` ]);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 페이지 초기화
	private pageReset() {
		this.page = new Page();
		// 현재 페이지
		this.page.number = 0;
		// 페이지 사이즈
		this.page.size = this.pageSize;
		this.page.sort = new Sort();
		// sort
		this.page.sort.property = 'createdDate,asc';
		// sort
		this.page.sort.direction = 'desc';
		this.page.last = true;
	}

}
