import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {Loading} from '../../../../common/util/loading-util';
import {GlobalSearchService} from '../../service/global-search.service';
import {BaseComponent} from '../base.component';
import {getTypeIndex, GlobalSearch} from '../../value/global-search';
import {CommonConstant} from '../../../common/constant/common-constant';
import * as _ from 'lodash';
import {Meta} from '../../../meta/value/meta';
import {Utils} from '../../../../common/util/utils';
import {Project} from '../../../project/value/project';
import {TranslateService} from "ng2-translate";

@Component({
	selector: 'search-global',
	templateUrl: './all.component.html'
})
export class AllComponent extends BaseComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 현제 글로벌 검색 타입 Enum 인덱스
	 */
	public currentGlobalSearchTypeEnumIndex = getTypeIndex(GlobalSearch.Type.ALL);

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 검색 결과 타입별 엔티티
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 분석 앱
	 *
	 * @type {GlobalSearch.AnalysisAppEntity}
	 */
	public analysisAppEntity: GlobalSearch.AnalysisAppEntity = new GlobalSearch.AnalysisAppEntity();

	/**
	 * 리포트
	 *
	 * @type {GlobalSearch.ReportAppEntity}
	 */
	public reportAppEntity: GlobalSearch.ReportAppEntity = new GlobalSearch.ReportAppEntity();

	/**
	 * 데이터 웨어하우스 컬럼
	 *
	 * @type {GlobalSearch.MetaColumnEntity}
	 */
	public metaColumnEntity: GlobalSearch.MetaColumnEntity = new GlobalSearch.MetaColumnEntity();

	/**
	 * 데이터 웨어하우스 테이블
	 *
	 * @type {GlobalSearch.MetaTableEntity}
	 */
	public metaTableEntity: GlobalSearch.MetaTableEntity = new GlobalSearch.MetaTableEntity();

	/**
	 * 프로젝트 ( DT 과제 )
	 *
	 * @type {GlobalSearch.ProjectEntity}
	 */
	public projectEntity: GlobalSearch.ProjectEntity = new GlobalSearch.ProjectEntity();

	/**
	 * 커뮤니케이션
	 *
	 * @type {GlobalSearch.CommunicationEntity}
	 */
	public communicationEntity: GlobalSearch.CommunicationEntity = new GlobalSearch.CommunicationEntity();

	/**
	 * 선택된 서브젝트 테이블
	 *
	 * @type {null}
	 */
	public selectedSubjectTable: Meta.Table = null;

	/**
	 * 선택된 서브젝트 컬럼
	 */
	public selectedSubjectColumn: Meta.Column = null;

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

		this.subscriptions.push(
			this.activatedRoute
				.queryParams
				.subscribe(params => {
					this.globalSearchService.searchType = GlobalSearch.Type.ALL;
					const q = params[ 'q' ];
					this.keyWord = typeof q === 'undefined' ? '' : decodeURIComponent(q);
					this.search(this.keyWord);
				})
		);

		this.metaColumnEntity.contentsList = [];
		this.metaTableEntity.contentsList = [];
		this.projectEntity.contentsList = [];
		this.analysisAppEntity.contentsList = [];
		this.reportAppEntity.contentsList = [];
		this.communicationEntity.contentsList = [];
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 진행현황 라벨 가져오기
	 *
	 * @param progress
	 */
	public getProgressLabel(progress): string {
		return Project.getProgressLabel(progress)
	};

	/**
	 * 테이블 상세 팝업에 컬럼 그리드 서브젝트 컬럼 선택 시
	 *
	 * @param column
	 * @constructor
	 */
	public onTableDetailPopupColumnGridInSubjectColumnSelected(column: Meta.Column): void {
		this.selectedSubjectColumn = column;
	}

	/**
	 * 컬럼 상세 팝업에 테이블 그리드 서브젝트 테이블 선택 시
	 *
	 * @param table
	 * @constructor
	 */
	public onColumnDetailPopupTableGridInSubjectTableSelected(table: Meta.Table): void {
		this.selectedSubjectTable = null;
		this.selectedSubjectColumn = null;
		setTimeout(() => {
			const metaTable = new Meta.Table();
			metaTable.id = table.id;
			this.selectedSubjectTable = metaTable;
		}, 10);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 검색
	 *
	 * @param keyWord
	 */
	private search(keyWord: string): void {

		if (_.isUndefined(keyWord) === false && _.isEmpty(keyWord) === false) {

			Loading.show();

			this.globalSearchService
				.executeGlobalSearchByType(keyWord, GlobalSearch.Type.ALL, null)
				.then((result: GlobalSearch.Result.AllList) => {

					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

						this.globalSearchService.searchResultCount = 0;

						this.globalSearchService.resultPageTabList = [];
						this.globalSearchService.resultPageTabList.push({
							'label': this.translateService.instant('COMMON.TOTAL', '전체'),
							'index': GlobalSearch.TypeIndex.ALL
						});

						if (result.data.communication) {
							this.communicationEntity = result.data.communication;
							this.globalSearchService.searchResultCount += this.communicationEntity.total;
							this.globalSearchService.resultPageTabList.push({
								'label': this.translateService.instant('GLOBAL.SEARCH.COMMUNICATION.TITLE', '커뮤니케이션') + '(' + Utils.NumberUtil.addComma(this.communicationEntity.total) + ')',
								'index': GlobalSearch.TypeIndex.COMMUNICATION
							});
						} else {
							this.communicationEntity = null;
						}

						if (result.data.reportApp) {
							this.reportAppEntity = result.data.reportApp;
							this.globalSearchService.searchResultCount += this.reportAppEntity.total;
							this.globalSearchService.resultPageTabList.push({
								'label': this.translateService.instant('GLOBAL.SEARCH.REPORT.TITLE', '리포트') + '(' + Utils.NumberUtil.addComma(this.reportAppEntity.total) + ')',
								'index': GlobalSearch.TypeIndex.REPORT_APP
							});
						} else {
							this.reportAppEntity = null;
						}

						if (result.data.analysisApp) {
							this.analysisAppEntity = result.data.analysisApp;
							this.globalSearchService.searchResultCount += this.analysisAppEntity.total;
							this.globalSearchService.resultPageTabList.push({
								'label': this.translateService.instant('GLOBAL.SEARCH.ANALYSIS.TITLE', '분석 앱') + '(' + Utils.NumberUtil.addComma(this.analysisAppEntity.total) + ')',
								'index': GlobalSearch.TypeIndex.ANALYSIS_APP
							});
						} else {
							this.analysisAppEntity = null;
						}

						if (result.data.metaTable) {
							this.metaTableEntity = result.data.metaTable;
							this.globalSearchService.searchResultCount += this.metaTableEntity.total;
							this.globalSearchService.resultPageTabList.push({
								'label': this.translateService.instant('GLOBAL.SEARCH.DATA.TABLE.TITLE', '데이터 테이블') + '(' + Utils.NumberUtil.addComma(this.metaTableEntity.total) + ')',
								'index': GlobalSearch.TypeIndex.META_TABLE
							});
						} else {
							this.metaTableEntity = null;
						}

						if (result.data.metaColumn) {
							this.metaColumnEntity = result.data.metaColumn;
							this.globalSearchService.searchResultCount += this.metaColumnEntity.total;
							this.globalSearchService.resultPageTabList.push({
								'label': this.translateService.instant('GLOBAL.SEARCH.DATA.COLUMN.TITLE', '데이터 컬럼') + '(' + Utils.NumberUtil.addComma(this.metaColumnEntity.total) + ')',
								'index': GlobalSearch.TypeIndex.META_COLUMN
							});
						} else {
							this.metaColumnEntity = null;
						}

						// 글로벌 검색 서비스에 검색어 저장
						this.globalSearchService.keyWord = this.keyWord;

						// 검색 서비스에 검색 타입 저장
						this.globalSearchService.searchType = GlobalSearch.Type.ALL;

						// GNB 서비스에 검색이 실행 되었음을 알림
						this.gnbService.search.next();

						if (this.globalSearchService.isTabClick === false) {
							this.tagging(this.TaggingType.SEARCH, this.TaggingAction.VIEW, this.globalSearchService.searchResultCount.toString(), this.globalSearchService.keyWord);
						}

						this.globalSearchService.isTabClick = false;
					}

					Loading.hide();
				})
				.catch(error => {
					this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
				});
		}
	}

}
