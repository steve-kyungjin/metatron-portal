import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {ReportApp} from '../../../../report-app/value/report-app.value';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import {TranslateService} from 'ng2-translate';
import {ReportAppService} from '../../../../report-app/service/report-app.service';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {PaginationComponent} from '../../../../../common/component/pagination/pagination.component';
import {DialogService} from '../../../../../common/component/dialog/dialog.service';
import {Page, Sort} from '../../../../common/value/result-value';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {Alert} from '../../../../../common/util/alert-util';
import {SelectValue} from '../../../../../common/component/select/select.value';
import {Code} from '../../../../common/value/code';

@Component({
	selector: 'report-app-management',
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
	public reportAppList: ReportApp.Entity[] = [];
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
				private reportAppService: ReportAppService,
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
					this.getReportApps();
				})
		);

		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		// 카테고리 목록 조회
		this.reportAppService.getCategoryList().then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				let data: Code.Entity[] = result.data.categoryList;
				let categoryList = [];
				Array.from(data).forEach(value => {
					categoryList.push(new SelectValue(value.nmKr, value.id));
				});

				this.categoryList = categoryList;
			}
		});
		this.getReportApps();
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
	 * 리포트 목록 카타고리 콤마처리
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
	 * 리포트 정보 입력화면으로 앱 아이디 보내기
	 *
	 * @param {string} appId
	 */
	public sendAppIdToReportAppEnterInformationModifyPage(appId: string): void {
		const param: ReportApp.CreateReportAppPageParameter = new ReportApp.CreateReportAppPageParameter();
		param.id = appId;
		this.router.navigateByData({
			url: [ `view/management/report-app/report/${param.id}` ],
			data: param
		});
	}

	/**
	 * 리포트 삭제 컨펌 열기
	 *
	 * @param {string} appId
	 */
	public openDeleteReportAppConfirmModal(appId: string): void {
		this.dialogService
			.confirm(
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제하시겠습니까?'),
				null,
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.CONFIRM', '확인'),
				() => {
					this.logger.debug(`리포트 삭제 컨펌 취소 클릭`);
				},
				() => {
					this.deleteReportAppByAppId(appId);
				});
	}

	/**
	 * 페이징에서 선택한 페이지로 리로드
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {

		this.currentPage = currentPage;
		this.page.number = this.currentPage;

		this.getReportApps();
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
		this.router.navigate([ `view/report-app/${appId}` ]);
	}

	/**
	 * 카테고리 선택 이벤트
	 * @param item
	 */
	public categorySelect(item: SelectValue) {
		this.searchCategoryId = item.value != 'ALL' ? item.value : null;
		this.pagingInit();
		this.getReportApps();
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
	 * 리포트 목록 조회
	 *
	 * @param {string} searchText
	 */
	private getReportApps(): void {

		Loading.show();

		this.reportAppService
			.getReportApps(this.searchCategoryId, this.searchText.trim(), this.page)
			.then((result) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data[ 'reportAppList' ]);
					this.pagination.init(this.page);
					this.reportAppList = result.data[ 'reportAppList' ].content;
				} else {
					this.pagingInit();
					this.reportAppList = [];
					throw new Error(`getReportApps API fail.`)
				}

				Loading.hide();
			})
			.catch((error) => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > error`, error);
			});
	}

	/**
	 * 리포트 삭제
	 *
	 * @param {string} appId
	 */
	private deleteReportAppByAppId(appId: string): void {

		Loading.show();

		this.reportAppService
			.deleteReportAppByAppId(appId)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					Alert.success(`삭제되었습니다.`);

					// LNB 메뉴 데이터 다시 생성
					this.layoutService.createDataSetUsedByLnb();

					this.page.number = 0;
					this.getReportApps();
				}
			})
			.catch(error => {
				Loading.hide();
			});
	}

}
