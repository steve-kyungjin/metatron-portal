import {ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../common/component/abstract.component';
import {GlobalSearchService} from '../service/global-search.service';
import {GlobalSearch} from '../value/global-search';
import * as _ from 'lodash';
import {environment} from '../../../../environments/environment';

export abstract class BaseComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 검색어
	 *
	 * @type {string}
	 */
	protected keyWord: string = '';

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param globalSearchService
	 */
	protected constructor(protected elementRef: ElementRef,
						  protected injector: Injector,
						  protected globalSearchService: GlobalSearchService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 탭 선택
	 *
	 * @param selectedTabLabelIndex
	 */
	public selectedTab(selectedTabLabelIndex: number): void {
		this.globalSearchService.isTabClick = true;
		this.tagging(this.TaggingType.DETAIL, this.TaggingAction.BTN, GlobalSearch.Type[ GlobalSearch.TypeIndex[ selectedTabLabelIndex ] ]);
		this.moveDetailSearchResultPage(GlobalSearch.Type[ GlobalSearch.TypeIndex[ selectedTabLabelIndex ] ], this.keyWord);
	}

	/**
	 * 커뮤니티 상세 검색
	 */
	public searchForCommunityDetail(): void {
		this.moveDetailSearchResultPage(GlobalSearch.Type.COMMUNICATION, this.keyWord);
	}

	/**
	 * 리포트 상세 검색
	 */
	public searchForReportAppDetail(): void {
		this.moveDetailSearchResultPage(GlobalSearch.Type.REPORT_APP, this.keyWord);
	}

	/**
	 * 분석 앱 상세 검색
	 */
	public searchForAnalysisAppDetail(): void {
		this.moveDetailSearchResultPage(GlobalSearch.Type.ANALYSIS_APP, this.keyWord);
	}

	/**
	 * 데이터 웨어하우스 테이블 상세 검색
	 */
	public searchForMetaTableDetail(): void {
		this.moveDetailSearchResultPage(GlobalSearch.Type.META_TABLE, this.keyWord);
	}

	/**
	 * 데이터 웨어하우스 컬럼 상세 검색
	 */
	public searchForMetaColumnDetail(): void {
		this.moveDetailSearchResultPage(GlobalSearch.Type.META_COLUMN, this.keyWord);
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * checkEmptyImageLink
	 *
	 * @param mediaId
	 */
	public checkEmptyImageLink(mediaId: string) {
		return _.isUndefined(mediaId) === false && _.isEmpty(mediaId) === false;
	}

	/**
	 * 커뮤니케이션 이미지 가져오기
	 *
	 * @param {string} mediaId
	 * @returns {string}
	 */
	public getCommunityImage(mediaId?: string) {
		return _.isUndefined(mediaId) === false && _.isEmpty(mediaId) === false
			? `${environment.apiUrl}/media/${mediaId}/t`
			: environment.isLocalMode
				? `/assets/images/default_community_search.png`
				: `${environment.contextPath}/assets/images/default_community_search.png`;
	}

	/**
	 * 리포트 이미지 가져오기
	 *
	 * @param {string} mediaId
	 * @returns {string}
	 */
	public getReportAppImage(mediaId?: string) {
		return this.getImage(mediaId);
	}

	/**
	 * 분석 앱 이미지 가져오기
	 *
	 * @param {string} mediaId
	 * @returns {string}
	 */
	public getAnalysisAppImage(mediaId?: string) {
		return this.getImage(mediaId);
	}

	/**
	 * 페이지 이동
	 *
	 * @param source
	 * @param {string} type
	 */
	public goPage(source: any, type: string) {

		if ('communication' === type) {
			// noinspection JSIgnoredPromiseFromCall
			this.router.navigate([ `view${source.postLink}` ]);
		}

		if ('report-app' === type) {
			// noinspection JSIgnoredPromiseFromCall
			this.router.navigate([ `view/report-app/${source.id}` ]);
		}

		if ('analysis-app' === type) {
			// noinspection JSIgnoredPromiseFromCall
			this.router.navigate([ `view/analysis-app/${source.id}` ]);
		}

		if ('project' === type) {
			// noinspection JSIgnoredPromiseFromCall
			this.router.navigate([ `view/project/${source.id}` ]);
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 상세 검색화면으로 이동
	 *
	 * @param type
	 * @param keyWord
	 */
	protected moveDetailSearchResultPage(type: GlobalSearch.Type, keyWord: string): void {
		if (GlobalSearch.Type.ALL === type) {
			this.globalSearchService.moveIntegratedSearchPage(keyWord);
		} else {
			this.globalSearchService.moveIntegratedSearchDetailPage(keyWord, type);
		}
	}

	/**
	 * 이미지 가져오기
	 *
	 * @param {string} mediaId
	 */
	protected getImage(mediaId: string): string {
		return (_.isUndefined(mediaId) === false || _.isEmpty(mediaId) === false)
			? `${environment.apiUrl}/media/${mediaId}/t`
			: environment.isLocalMode
				? `assets/images/default_search.png`
				: `${environment.contextPath}/assets/images/default_search.png`;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
