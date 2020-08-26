import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../base.component';
import {GlobalSearchService} from '../../service/global-search.service';
import {getTypeIndex, GlobalSearch} from '../../value/global-search';
import {Page, Sort} from '../../../common/value/result-value';
import {Loading} from '../../../../common/util/loading-util';
import * as _ from 'lodash';
import {CommonConstant} from '../../../common/constant/common-constant';
import {PaginationComponent} from '../../../../common/component/pagination/pagination.component';
import {Utils} from '../../../../common/util/utils';
import {TranslateService} from "ng2-translate";

@Component({
	selector: 'communication',
	templateUrl: './communication.component.html'
})
export class CommunicationComponent extends BaseComponent implements OnInit, OnDestroy {

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
	 * 검색 타입 인덱스 가져오기
	 */
	public currentGlobalSearchTypeEnumIndex = getTypeIndex(GlobalSearch.Type.COMMUNICATION);

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 커뮤니케이션
	 *
	 * @type {GlobalSearch.CommunicationEntity}
	 */
	public communicationEntity: GlobalSearch.CommunicationEntity = new GlobalSearch.CommunicationEntity();

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
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public globalSearchService: GlobalSearchService,
				public translateService: TranslateService) {
		super(elementRef, injector, globalSearchService);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.communicationEntity.contentsList = [];

		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		this.subscriptions.push(
			this.activatedRoute
				.queryParams
				.subscribe(params => {
					this.pageReset();
					this.globalSearchService.searchType = GlobalSearch.Type.COMMUNICATION;
					const q = params[ 'q' ];
					this.keyWord = typeof q === 'undefined' ? '' : decodeURIComponent(q);
					this.globalSearchService.keyWord = this.keyWord;
					this.search(this.keyWord);
					this.gnbService.search.next();
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
		this.search(this.keyWord);
	}

	/**
	 * 페이징 처리
	 *
	 * @param totalPage
	 */
	public pagingInit(totalPage: number = 0): void {
		this.page.totalPages = totalPage;
		this.page.number = this.currentPage;
		this.page.totalElements = 0;
		this.pagination.init(this.page);
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

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 검색
	 */
	private search(keyWord: string): void {

		if (_.isUndefined(keyWord) === false && _.isEmpty(keyWord) === false) {

			Loading.show();

			Promise.resolve()
				.then(() => {
					this.globalSearchService
						.executeGlobalSearchByType(keyWord, GlobalSearch.Type.ALL, null)
						.then((result: any) => {

							if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

								this.globalSearchService.searchResultCount = 0;
								this.globalSearchService.resultPageTabList = [];
								this.globalSearchService.resultPageTabList.push({
									'label': this.translateService.instant('COMMON.TOTAL', '전체'),
									'index': GlobalSearch.TypeIndex.ALL
								});

								if (result.data.communication) {
									this.globalSearchService.searchResultCount += result.data.communication.total;
									this.globalSearchService.resultPageTabList.push({
										'label': this.translateService.instant('GLOBAL.SEARCH.COMMUNICATION.TITLE', '커뮤니케이션') + '(' + Utils.NumberUtil.addComma(result.data.communication.total) + ')',
										'index': GlobalSearch.TypeIndex.COMMUNICATION
									});
								}
								if (result.data.reportApp) {
									this.globalSearchService.searchResultCount += result.data.reportApp.total;
									this.globalSearchService.resultPageTabList.push();
									this.globalSearchService.resultPageTabList.push({
										'label': this.translateService.instant('GLOBAL.SEARCH.REPORT.TITLE', '리포트') + '(' + Utils.NumberUtil.addComma(result.data.reportApp.total) + ')',
										'index': GlobalSearch.TypeIndex.REPORT_APP
									});
								}
								if (result.data.analysisApp) {
									this.globalSearchService.searchResultCount += result.data.analysisApp.total;
									this.globalSearchService.resultPageTabList.push({
										'label': this.translateService.instant('GLOBAL.SEARCH.ANALYSIS.TITLE', '분석 앱') + '(' + Utils.NumberUtil.addComma(result.data.analysisApp.total) + ')',
										'index': GlobalSearch.TypeIndex.ANALYSIS_APP
									});
								}
								if (result.data.metaTable) {
									this.globalSearchService.searchResultCount += result.data.metaTable.total;
									this.globalSearchService.resultPageTabList.push({
										'label': this.translateService.instant('GLOBAL.SEARCH.DATA.TABLE.TITLE', '데이터 테이블') + '(' + Utils.NumberUtil.addComma(result.data.metaTable.total) + ')',
										'index': GlobalSearch.TypeIndex.META_TABLE
									});
								}
								if (result.data.metaColumn) {
									this.globalSearchService.searchResultCount += result.data.metaColumn.total;
									this.globalSearchService.resultPageTabList.push({
										'label': this.translateService.instant('GLOBAL.SEARCH.DATA.COLUMN.TITLE', '데이터 컬럼') + '(' + Utils.NumberUtil.addComma(result.data.metaColumn.total) + ')',
										'index': GlobalSearch.TypeIndex.META_COLUMN
									});
								}

								this.gnbService.search.next();

								if (this.globalSearchService.isTabClick === false) {
									this.tagging(this.TaggingType.SEARCH, this.TaggingAction.VIEW, this.globalSearchService.searchResultCount.toString(), this.globalSearchService.keyWord);
								}

								this.globalSearchService.isTabClick = false;
							}

							Loading.hide();
						});
				})
				.then(() => {
					this.globalSearchService
						.executeGlobalSearchByType(keyWord, GlobalSearch.Type.COMMUNICATION, this.page)
						.then((result: any) => {

							if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

								this.page.first = result.data.result.pageable.pageNumber === 0;
								this.page.last = Math.ceil(result.data.result.total / result.data.result.pageable.pageSize) === result.data.result.pageable.pageNumber;
								this.page.number = result.data.result.pageable.pageNumber;
								this.page.numberOfElements = result.data.result.total;
								this.page.size = result.data.result.pageable.pageSize;
								this.page.totalElements = result.data.result.total;
								this.page.totalPages = Math.ceil(result.data.result.total / result.data.result.pageable.pageSize);

								this.pagination.init(this.page);

								this.communicationEntity = result.data.result;
							} else {
								this.pagingInit();
								this.communicationEntity.contentsList = [];
							}

							Loading.hide();
						})
						.catch(error => {
							this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
						});
				})
		}
	}

	// 페이지 초기화
	private pageReset() {
		this.page = new Page();
		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';
	}

}
