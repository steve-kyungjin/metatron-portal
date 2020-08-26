import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Loading} from '../../../../common/util/loading-util';
import {GroupService} from '../../../common/service/group.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Observable} from 'rxjs/Observable';
import {Page, Sort} from '../../../common/value/result-value';
import {Subject} from 'rxjs/Subject';
import {PaginationComponent} from '../../../../common/component/pagination/pagination.component';
import {Group} from '../../../common/value/group';
import {Alert} from '../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import {DialogService} from '../../../../common/component/dialog/dialog.service';
import {connectRoleNmWithCommaInRoleList, Role} from '../../../common/value/role';

@Component({
	selector: '[groups]',
	templateUrl: './groups.component.html',
	host: { '[class.page-management-group]': 'true' }
})
export class GroupsComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 목록
	 *
	 * @type {any[]}
	 */
	public list: Group.Entity[] = [];

	/**
	 * 검색어
	 *
	 * @type {string}
	 */
	public keyWord: string = '';

	/**
	 * 검색
	 *
	 * @type {Subject<string>}
	 */
	public search$: Subject<string> = new Subject<string>();

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
	 * @param groupService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private dialogService: DialogService,
				private groupService: GroupService) {
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
				.subscribe((value) => {
					this.pagingInit();
					this.keyWord = value.trim();
					this.getList();
				})
		);

		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		this.getList();
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
		this.getList();
	}

	/**
	 * 삭제 클릭
	 *
	 * @param {string} groupId
	 */
	public deleteClick(groupId: string) {

		this.dialogService.confirm(
			this.translateService.instant('COMMON.DELETE', '삭제'),
			this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제'),
			null,
			this.translateService.instant('COMMON.CANCEL', '취소'),
			this.translateService.instant('COMMON.CONFIRM', '확인'),
			() => {
				this.logger.debug(`[${this[ '__proto__' ].constructor.name}] cancel`);
			},
			() => {

				Loading.show();

				this.groupService
					.deleteGroup(groupId)
					.then(result => {

						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

							Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
							this.pagingInit();
							this.keyWord = '';
							this.getList();
						} else {
							Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
						}

						Loading.hide();
					})
					.catch(error => {
						this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
					});
			});
	}

	/**
	 * 상세 화면 이동
	 *
	 * @param {string} groupId
	 */
	public goDetailPage(groupId: string): void {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ `view/management/groups/${groupId}` ]);
	}

	/**
	 * 그룹 생성화면으로 이동
	 */
	public goGroupCreatePage(): void {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ `view/management/groups/create` ]);
	}

	/**
	 * 권한 목록에서 권한 이름을 콤마로 연결
	 *
	 * @param roleList
	 */
	public connectRoleNmWithCommaInRoleList: Function = (roleList: Role[]): string => { return connectRoleNmWithCommaInRoleList(roleList); };

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 목록 조회
	 */
	private getList(): void {

		Loading.show();

		this.groupService
			.getList(this.keyWord, this.page)
			.then((result) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.groupList);
					this.pagination.init(this.page);
					this.list = result.data.groupList.content;
				} else {
					this.pagingInit();
					this.list = [];
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
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
	 * 페이징 처리
	 *
	 * @param totalPage
	 */
	private pagingInit(totalPage: number = 0): void {
		this.page.totalPages = totalPage;
		this.page.number = 0;
		this.page.totalElements = 0;
		this.pagination.init(this.page);
	}
}
