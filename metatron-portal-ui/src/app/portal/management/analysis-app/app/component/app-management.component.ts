import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {AnalysisApp} from '../../../../analysis-app/value/analysis-app.value';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import {AnalysisAppService} from '../../../../analysis-app/service/analysis-app.service';
import {TranslateService} from 'ng2-translate';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {PaginationComponent} from '../../../../../common/component/pagination/pagination.component';
import {Page, Sort} from '../../../../common/value/result-value';
import {DialogService} from '../../../../../common/component/dialog/dialog.service';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {Alert} from '../../../../../common/util/alert-util';
import {SelectValue} from '../../../../../common/component/select/select.value';
import {Code} from '../../../../common/value/code';

@Component({
	selector: 'analysis-app-management',
	templateUrl: './app-management.component.html'
})
export class AppManagementComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild(PaginationComponent)
	private pagination: PaginationComponent;

	private currentPage: number = 0;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public page: Page = new Page();
	public analysisAppList: AnalysisApp.Entity[] = [];
	public search$: Subject<string> = new Subject<string>();
	public categoryList: SelectValue[] = [];
	public searchText: string = '';
	public searchCategoryId: string;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private analysisAppService: AnalysisAppService,
				private dialogService: DialogService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 검색
		this.subscriptions.push(
			this.search$
				.switchMap((value) => Observable.of<string>(value))
				.subscribe(() => {
					this.pagingInit();
					this.getAnalysisApps();
				})
		);

		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		// 카테고리 목록 조회
		this.analysisAppService.getCategoryList().then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				let data: Code.Entity[] = result.data.categoryList;
				let categoryList = [];
				Array.from(data).forEach(value => {
					categoryList.push(new SelectValue(value.nmKr, value.id));
				});

				this.categoryList = categoryList;
			}
		});
		this.getAnalysisApps();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 라우트 링크
	 *
	 * @param {string} routerLink
	 */
	public routerLink(routerLink: string): void {
		this.router.navigate([ routerLink ]);
	}

	/**
	 * 분석 앱 목록 카타고리 콤마처리
	 *
	 * @param categories
	 * @returns {string}
	 */
	public getCategoryConcat(categories): string {

		let category: string = '';

		if ((typeof categories === 'undefined') === false) {
			categories.forEach((data, index) => {
				if (index === 0) {
					category += data.nmKr;
				} else {
					category += `, ${data.nmKr}`;
				}
			});
		}

		return category;
	}

	/**
	 * 분석 앱 정보 입력화면으로 앱 아이디 보내기
	 *
	 * @param {string} appId
	 */
	public sendAppIdToAnalysisAppEnterInformationModifyPage(appId: string): void {
		const param: AnalysisApp.CreateAnalysisAppPageParameter = new AnalysisApp.CreateAnalysisAppPageParameter();
		param.id = appId;
		this.router.navigateByData({
			url: [ `view/management/analysis-app/app/${param.id}` ],
			data: param
		});
	}

	/**
	 * 분석 앱 삭제 컨펌 열기
	 *
	 * @param {string} appId
	 */
	public openDeleteAnalysisAppConfirmModal(appId: string): void {
		this.dialogService
			.confirm(
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제하시겠습니까?'),
				null,
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.CONFIRM', '확인'),
				() => {
					this.logger.debug(`분석 앱 삭제 컨펌 취소 클릭`);
				},
				() => {
					this.deleteAnalysisAppByAppId(appId);
				});
	}

	/**
	 * 페이징에서 선택한 페이지로 리로드
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {

		this.currentPage = currentPage;
		this.page.number = this.currentPage;

		this.getAnalysisApps();
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
	 * 상세 페이지 이동
	 *
	 * @param {string} appId
	 */
	public goDetail(appId: string): void {
		this.router.navigate([ `view/analysis-app/${appId}` ]);
	}

	/**
	 * 카테고리 선택 이벤트
	 * @param item
	 */
	public categorySelect(item: SelectValue) {
		this.searchCategoryId = item.value != 'ALL' ? item.value : null;
		this.pagingInit();
		this.getAnalysisApps();
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
	 * 분석 앱 목록 조회
	 *
	 * @param {string} searchText
	 */
	private getAnalysisApps(): void {

		Loading.show();

		this.analysisAppService
			.getAnalysisApps(this.searchCategoryId, this.searchText.trim(), this.page)
			.then((result) => {

				this.analysisAppList = [];

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data[ 'analysisAppList' ]);
					this.pagination.init(this.page);
					this.analysisAppList = result.data[ 'analysisAppList' ].content;
				} else {
					this.pagingInit();
					this.analysisAppList = [];
					throw new Error(`getAnalysisApps API fail.`)
				}

				Loading.hide();
			})
			.catch((error) => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > error`, error);
			});
	}

	/**
	 * 분석 앱 삭제
	 *
	 * @param {string} appId
	 */
	private deleteAnalysisAppByAppId(appId: string): void {

		Loading.show();

		this.analysisAppService
			.deleteAnalysisAppByAppId(appId)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					Alert.success(`삭제되었습니다.`);

					// LNB 메뉴 데이터 다시 생성
					this.layoutService.createDataSetUsedByLnb();

					this.page.number = 0;
					this.getAnalysisApps();
				}
			})
			.catch(error => {
				Loading.hide();
			});
	}

}
