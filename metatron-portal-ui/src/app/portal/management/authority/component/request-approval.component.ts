import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Page, Sort} from '../../../common/value/result-value';
import {PaginationComponent} from '../../../../common/component/pagination/pagination.component';
import {Subject} from 'rxjs/Subject';
import {TranslateService} from 'ng2-translate';
import {DialogService} from '../../../../common/component/dialog/dialog.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import {Loading} from '../../../../common/util/loading-util';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Observable} from 'rxjs/Observable';
import {Authentication} from '../../../common/value/authentication';
import {Alert} from '../../../../common/util/alert-util';
import {RequestApprovalService} from '../service/request-approval.service';

@Component({
	selector: '[request-approval]',
	templateUrl: 'request-approval.component.html',
	host: { '[class.page-management-authority]': 'true' }
})
export class RequestApprovalComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	 * 권한 상태 ( ALL )
	 *
	 * @type {Authentication.Status}
	 */
	public requestRoleAllStatus: Authentication.Status = Authentication.Status.ALL;

	/**
	 * 권한 상태 ( REQUEST )
	 *
	 * @type {Authentication.Status}
	 */
	public requestRoleRequestStatus: Authentication.Status = Authentication.Status.REQUEST;

	/**
	 * 권한 상태 ( ACCEPT )
	 *
	 * @type {Authentication.Status}
	 */
	public requestRoleAcceptStatus: Authentication.Status = Authentication.Status.ACCEPT;

	/**
	 * 선택된 권한 신청 상태
	 *
	 * @type {Authentication.Status.ACCEPT}
	 */
	public selectedRequestRoleStatus: Authentication.Status;

	/**
	 * 페이지
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 검색
	 *
	 * @type {Subject<string>}
	 */
	public search$: Subject<string> = new Subject<string>();

	/**
	 * 승인 요청건 카운트
	 *
	 * @type {number}
	 */
	public requestAllCount: number = 0;

	/**
	 * 승인대기 카운트
	 *
	 * @type {number}
	 */
	public waitingApprovalCount: number = 0;

	/**
	 * 승인완료 카운트
	 *
	 * @type {number}
	 */
	public approvalCompletedCount: number = 0;

	/**
	 * 권한 신청 목록
	 *
	 * @type {any[]}
	 */
	public requestRoleList = [];

	/**
	 * 검색어
	 */
	@ViewChild('searchWord')
	public searchWord: ElementRef;

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
	 * @param {RequestApprovalService} requestApprovalService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private dialogService: DialogService,
				private requestApprovalService: RequestApprovalService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.selectedRequestRoleStatus = Authentication.Status.ALL;

		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		// 검색
		// noinspection JSUnusedLocalSymbols
		this.subscriptions.push(
			this.search$
				.switchMap((value) => Observable.of<string>(value))
				.subscribe((value) => {
					this.getRequestRoleList(value.trim());
				})
		);

		this.getRequestRoleList();
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

		this.getRequestRoleList();
	}

	/**
	 * Role 신청 승인
	 *
	 * @param authentication
	 */
	public acceptRoleRequest(authentication: Authentication.Entity): void {

		let userNm: string = `${authentication.user.userNm}${authentication.user.orgNm === '' ? '' : ' (' + authentication.user.orgNm + ')'}`;

		this.dialogService
			.confirm(
				this.translateService.instant('MANAGEMENT.AUTHENTICATION.LAYER.ADD.TITLE', '권한 승인'),
				this.translateService
					.instant('MANAGEMENT.AUTHENTICATION.LAYER.ADD.MESSAGE', '‘${userNm}‘님에게 ‘${appNm}’ 권한을\n부여하시겠습니까?')
					.replace('${appNm}', '<span>' + (authentication.analysisApp ? authentication.analysisApp.appNm : authentication.reportApp.appNm) + '</span>')
					.replace('${userNm}', '<span>' + userNm + '</span>'),
				null,
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.CONFIRM', '확인'),
				() => {
					this.logger.debug(`Role 신청 승인 컨펌 취소 클릭`);
				},
				() => {

					Loading.show();

					this.requestApprovalService
						.acceptRoleRequest(authentication.id)
						.then(result => {

							if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
								Alert.success(`${this.translateService.instant('COMMON.MESSAGE.APPROVAL', '승인되었습니다.')}`);
								this.resetSearchWord();
								this.pagingInit();
								this.getRequestRoleList();
							}

							Loading.hide();
						})
						.catch(error => {
							this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
						});
				});
	}

	/**
	 * Role 신청 삭제
	 *
	 * @param {string} id
	 */
	public deleteRoleRequest(id: string): void {

		this.dialogService.confirm(
			this.translateService.instant('COMMON.DELETE', '삭제'),
			this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제'),
			null,
			this.translateService.instant('COMMON.CANCEL', '취소'),
			this.translateService.instant('COMMON.CONFIRM', '확인'),
			() => {
				this.logger.debug('cancel');
			},
			() => {

				Loading.show();

				this.requestApprovalService
					.deleteRoleRequest(id)
					.then(result => {

						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
							Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
							this.resetSearchWord();
							this.pagingInit();
							this.getRequestRoleList();
						}

						Loading.hide();
					})
					.catch(error => {
						this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
					});
			});
	}

	/**
	 * 권한 신청 상태 필터 실행
	 *
	 * @param {Authentication.Status} requestRoleStatus
	 */
	public execRequestRoleStatusFilter(requestRoleStatus: Authentication.Status | string): void {
		this.selectedRequestRoleStatus = Authentication.Status[ requestRoleStatus ];
		this.pagingInit();
		this.getRequestRoleList(this.searchWord.nativeElement.value);
	}

	/**
	 * 검색 클릭
	 * @param searchValue
	 */
	public searchClick(searchValue: string) {
		this.pagingInit();
		this.search$.next(searchValue);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 권한 신청 목록 조회
	 *
	 * @param {string} searchWord
	 * @param isLoadingShow
	 */
	private getRequestRoleList(searchWord = '', isLoadingShow: boolean = true): void {

		if (isLoadingShow) {
			Loading.show();
		}

		Promise
			.resolve()
			.then(() => this.getRolesRequestCount(searchWord))
			.then(() => {
				this.requestApprovalService
					.getRequestRoleList(searchWord, this.page, this.selectedRequestRoleStatus)
					.then(result => {

						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
							this.setPageInfo(result.data.requestRoleList);
							this.pagination.init(this.page);
							this.requestRoleList = result.data.requestRoleList.content;
						} else {
							this.requestRoleList = [];
							this.pagingInit();
						}

						Loading.hide();
					});
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 승인대기, 승인완료 카운트 조회
	 *
	 * @param {string} searchWord
	 * @returns {Promise<void>}
	 */
	private getRolesRequestCount(searchWord: string): Promise<void> {
		return this.requestApprovalService
			.getRolesRequestCount(searchWord)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.requestAllCount = result.data.count.ALL;
					this.waitingApprovalCount = result.data.count.REQUEST;
					this.approvalCompletedCount = result.data.count.ACCEPT;
				} else {
					this.requestAllCount = 0;
					this.waitingApprovalCount = 0;
					this.approvalCompletedCount = 0;
				}
			});
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
	 * 검색어 초기화
	 */
	private resetSearchWord(): void {
		this.searchWord.nativeElement.value = '';
	}

}
