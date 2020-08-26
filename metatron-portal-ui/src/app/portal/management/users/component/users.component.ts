import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Loading} from '../../../../common/util/loading-util';
import {CommonConstant} from '../../../common/constant/common-constant';
import {PaginationComponent} from '../../../../common/component/pagination/pagination.component';
import {Page, Sort} from '../../../common/value/result-value';
import {User} from '../../../common/value/user';
import {connectRoleNmWithCommaInRoleList, Role} from '../../../common/value/role';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {RoleService} from '../../../common/service/role.service';
import {Alert} from '../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import {UserService} from '../../../common/service/user.service';

@Component({
	selector: '[users]',
	templateUrl: './users.component.html',
	host: { '[class.page-management-user]': 'true' }
})
export class UsersComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	public list: User.Entity[] = [];

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
	 * @param {UserService} userService
	 * @param roleService
	 * @param translateService
	 * @param roleService
	 * @param translateService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private userService: UserService,
				private roleService: RoleService,
				private translateService: TranslateService) {
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
	 * 권한 목록에서 권한 이름을 콤마로 연결
	 *
	 * @param {Role[]} roleList
	 * @returns {string}
	 */
	public connectRoleNmWithCommaInRoleList: Function = (roleList: Role[]): string => connectRoleNmWithCommaInRoleList(roleList);

	/**
	 * 상세 화면 이동
	 *
	 * @param {string} userId
	 */
	public goDetailPage(userId: string): void {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ `view/management/users/${userId}` ]);
	}

	/**
	 * 관리자 체크
	 */
	public adminCheckChange(user: User.Entity) {
		user.admin = !user.admin;

		Loading.show();

		if (user.admin) {
			this.roleService.addSystemAdmin(user.userId).then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
				}
				Loading.hide();
			});
		} else {
			this.roleService.deleteSystemAdmin(user.userId).then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
				}
				Loading.hide();
			});
		}

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private getList(isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		this.userService
			.getList(this.keyWord, this.page)
			.then((result) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.userList);
					this.pagination.init(this.page);
					this.list = result.data.userList.content;
				} else {
					this.pagingInit();
					this.list = [];
				}

				if (isLoading) {
					Loading.hide();
				}
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
