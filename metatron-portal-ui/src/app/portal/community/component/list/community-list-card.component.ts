import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {CommunityListComponent} from './community-list.component';
import {Community} from '../../value/community.value';
import {environment} from '../../../../../environments/environment';
import {TranslateService} from 'ng2-translate';
import {CommunityService} from '../../service/community.service';
import {DialogService} from '../../../../common/component/dialog/dialog.service';

@Component({
	selector: '[community-list-card]',
	templateUrl: './community-list-card.component.html'
})
export class CommunityListCardComponent extends CommunityListComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 이미지 없는 카드 배경색 순번
	private currentCardType: number = 0;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				protected communityService: CommunityService,
				protected dialogService: DialogService) {

		super(elementRef, injector, translateService, communityService, dialogService);

		this.pageSize = 17;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		super.ngOnInit();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/**
	 * 목록 초기화
	 * @param {Community.Post[]} postList
	 * @param {boolean} isMoreView
	 */
	protected initList(postList: Community.Post[], isMoreView: boolean) {
		Array.from(postList).forEach(value => {
			value.imageUrl = this.getPostImage(value);
			value.className = this.getItemClass(value);
		});

		// 배경색 순번 초기화
		this.currentCardType = 0;

		super.initList(postList, isMoreView);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 더보기 클릭
	 */
	public moreClick() {
		this.page.number++;
		this.doSearch(true);
	}

	/**
	 * 검색 클릭
	 */
	public searchClick() {
		this.page.number = 0;
		this.currentCardType = 0;
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

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * get li class
	 * @param {Community.Post} item
	 * @returns {string}
	 */
	private getItemClass(item: Community.Post) {
		let className = '';

		if (item.mediaGroup) {
			className = 'type-thumb';
		} else {
			let type = String.fromCharCode(97 + this.currentCardType % 8);

			className = `type-${type}`;
			this.currentCardType++;
		}

		return className;
	}

	/**
	 * get image url
	 * @param {Community.Post} item
	 * @returns {any}
	 */
	private getPostImage(item: Community.Post) {
		if (item.mediaGroup && item.mediaGroup.medias) {
			return `${environment.apiUrl}/media/${item.mediaGroup.medias[ 0 ].id}/t`;
		}
		return '';
	}

}
