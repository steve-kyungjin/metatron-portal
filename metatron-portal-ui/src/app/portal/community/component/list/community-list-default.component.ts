import {Component, OnDestroy, OnInit, ViewChild, SimpleChanges} from '@angular/core';
import {PaginationComponent} from '../../../../common/component/pagination/pagination.component';
import {Community} from '../../value/community.value';
import {CommunityListComponent} from './community-list.component';
import {SelectValue} from "../../../../common/component/select/select.value";
import {Validate} from "../../../../common/util/validate-util";

@Component({
	selector: '[community-list-default]',
	templateUrl: './community-list-default.component.html'
})
export class CommunityListDefaultComponent extends CommunityListComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild(PaginationComponent)
	private pagination: PaginationComponent;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public statusList: SelectValue[] = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		super.ngOnInit();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		for (let propName in changes) {
			if (propName === 'masterInfo') {
				this.initStatusList();
			}
		}

		super.ngOnChanges(changes);
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
	 */
	public searchClick() {
		this.page.number = 0;
		this.searchKey = this.searchInputText;
		this.doSearch();

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.BTN, this.searchKey);
	}

	/**
	 * 포스트 클릭
	 * @param {Community.Post} item
	 */
	public postClick(item: Community.Post) {
		this.goDetail(item);
	}

	/**
	 * 등록 클릭
	 * @param {Community.Post} item
	 */
	public createClick() {
		this.goCreate();
	}

	/**
	 * 상태 선택
	 */
	public statusSelect(item: SelectValue) {
		this.page.number = 0;
		this.searchStatus = item.value == 'ALL' ? '' : item.value;
		this.doSearch();

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.ITEM, item.value);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 목록 초기화
	 * @param {Community.Post[]} postList
	 * @param {boolean} isMoreView
	 */
	protected initList(postList: Community.Post[], isMoreView: boolean) {
		Array.from(postList).forEach(value => {
			value.className = this.communityService.getStatus(value);
		});

		super.initList(postList, isMoreView);

		this.pagination.init(this.page);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 상태 목록 초기화
	 */
	private initStatusList() {
		let statusList;

		if (this.masterInfo.secondaryType == Community.RequestType.NORMAL) {
			statusList = [
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.REQUESTED`, '요청 등록'), Community.Status.REQUESTED, false),
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.REVIEW`, '요건 검토'), Community.Status.REVIEW, false),
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.CANCELED`, '요청 취소'), Community.Status.CANCELED, false),
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.PROGRESS.${this.masterInfo.secondaryType}`, '요청타입') + ' ' + this.translateService.instant(`COMMUNITY.STATUS.PROGRESS`, '진행'), Community.Status.PROGRESS, false),
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.COMPLETED`, '종결'), Community.Status.COMPLETED, false),
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.CLOSED`, '요청 완료 확인'), Community.Status.CLOSED, false),
			];
		} else {
			statusList = [
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.REQUESTED`, '요청 등록'), Community.Status.REQUESTED, false),
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.CANCELED`, '요청 취소'), Community.Status.CANCELED, false),
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.PROGRESS.${this.masterInfo.secondaryType}`, '요청타입') + ' ' + this.translateService.instant(`COMMUNITY.STATUS.PROGRESS`, '진행'), Community.Status.PROGRESS, false),
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.COMPLETED`, '종결'), Community.Status.COMPLETED, false),
				new SelectValue(this.translateService.instant(`COMMUNITY.STATUS.CLOSED`, '요청 완료 확인'), Community.Status.CLOSED, false),
			];
		}

		this.statusList = statusList;
	}
}
