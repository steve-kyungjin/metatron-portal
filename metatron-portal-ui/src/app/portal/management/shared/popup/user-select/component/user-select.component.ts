import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {AbstractComponent} from '../../../../../common/component/abstract.component';
import {Page, Sort} from '../../../../../common/value/result-value';
import {Group} from '../../../../../common/value/group';
import {CommonConstant} from '../../../../../common/constant/common-constant';
import {Loading} from '../../../../../../common/util/loading-util';
import {PaginationComponent} from '../../../../../../common/component/pagination/pagination.component';
import {User} from '../../../../../common/value/user';
import * as _ from 'lodash';
import {Utils} from '../../../../../../common/util/utils';
import {GroupService} from '../../../../../common/service/group.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Organization} from '../../../../../common/value/organization';
import {OrganizationService} from '../../../../../common/service/organization.service';
import {UserService} from '../../../../../common/service/user.service';

@Component({
	selector: '[user-select]',
	templateUrl: 'user-select.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class UserSelectComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 닫기
	 *
	 * @type {EventEmitter<any>}
	 */
	@Output('oClose')
	private close: EventEmitter<any> = new EventEmitter();

	/**
	 * 적용
	 */
	@Output('oDone')
	private done: EventEmitter<User.Entity[]> = new EventEmitter();

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

	@Input()
	public isUserMultipleSelectMode: boolean = false;

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 그룹 선택 모드인지
	 *
	 * @type {boolean}
	 */
	public isGroupSearchMode: boolean = true;

	/**
	 * 검색어
	 *
	 * @type {string}
	 */
	public keyWord: string = '';

	/**
	 * 선택된 롤 그룹
	 *
	 * @type {null}
	 */
	public selectedRoleGroup: Group.Entity | Organization.Entity = null;

	/**
	 * 사용자 목록
	 *
	 * @type {any[]}
	 */
	public userList: User.Entity[] = [];

	/**
	 * 선택된 사용자 목록
	 *
	 * @type {any[]}
	 */
	public selectedUserList: User.Entity[] = [];

	/**
	 * 기존에 선택된 사용자 목록
	 *
	 * @type {any[]}
	 */
	@Input()
	public defaultSelectedUserList: User.Entity[] = [];

	/**
	 * Search subject
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
	 * @param {TranslateService} translateService
	 * @param userService
	 * @param groupService
	 * @param organizationService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private userService: UserService,
				private groupService: GroupService,
				private organizationService: OrganizationService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 검색어 입력
		this.subscriptions.push(
			this.search$
				.switchMap((value) => Observable.of<string>(value))
				.subscribe((text) => {

					this.keyWord = text.trim();

					// 페이지 객체 초기화
					this.pageReset();

					// 선택된 그룹이 없는 경우
					if (this.selectedRoleGroup === null) {
						// 전체 사용자 목록 조회
						this.getUserList();
					}

					// 선택된 그룹이 있는 경우
					else {
						// 그룹의 사용자 목록 조회
						this.getUserListByGroupAndKeyWord(this.selectedRoleGroup.id);
					}
				})
		);

		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		// 사용자 멀티 선택 모드인 경우
		if (this.isUserMultipleSelectMode === true) {
			if (_.isUndefined(this.defaultSelectedUserList) === false && this.defaultSelectedUserList.length > 0) {
				this.selectedUserList = _.cloneDeep(this.defaultSelectedUserList);
			}
		}

		this.getUserList();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 닫기
	 */
	public closeClick(): void {
		this.close.emit();
	}

	/**
	 * 적용
	 */
	public doneClick(): void {
		this.done.emit(this.selectedUserList);
	}

	/**
	 * 그룹 선택시
	 *
	 * @param {Group.Entity} group
	 */
	public groupSelected(group: Group.Entity): void {
		this.selectedRoleGroup = group;
		this.keyWord = '';
		this.pageReset();
		this.getUserListByGroupAndKeyWord(group.id);
	}

	/**
	 * 조직 선택시
	 *
	 * @param org
	 */
	public orgSelected(org: Organization.Entity): void {
		this.selectedRoleGroup = org;
		this.keyWord = '';
		this.pageReset();
		this.getUserListByOrgAndKeyWord(org.id);
	}

	/**
	 * 페이징에서 선택한 페이지로 리로드
	 *
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {

		this.currentPage = currentPage;
		this.page.number = this.currentPage;

		// 선택된 그룹이 없는 경우
		if (this.selectedRoleGroup === null) {
			// 전체 사용자 목록 조회
			this.getUserList();
		}

		// 선택된 그룹이 있는 경우
		else {
			// 그룹의 사용자 목록 조회
			this.getUserListByGroupAndKeyWord(this.selectedRoleGroup.id);
		}
	}

	/**
	 * 선택된 사용자 목록에 추가
	 *
	 * @param {User.Entity} user
	 */
	public addSelectedUserList(user: User.Entity) {
		const equalUserList: User.Entity[] = this.selectedUserList.filter(selectedUser => selectedUser.userId === user.userId);
		if (equalUserList.length === 0) {
			this.selectedUserList.push(user);
		}
	}

	/**
	 * 선택된 사용자 리턴
	 *
	 * @param user
	 */
	public selectUser(user: User.Entity) {
		this.done.emit([ user ]);
	}

	/**
	 * 선택된 사용자 삭제
	 *
	 * @param index
	 */
	public deleteSelectedUser(index: number) {
		this.selectedUserList = Utils.ArrayUtil.remove(this.selectedUserList, index);
	}

	/**
	 * 선택된 사용자 전체 삭제
	 */
	public allDeleteSelectedUserList(): void {
		this.selectedUserList = [];
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 사용자 목록 조회
	 */
	private getUserList(): void {

		Loading.show();

		this.userService
			.getList(this.keyWord, this.page)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.userList);
					this.pagination.init(this.page);
					this.userList = result.data.userList.content;
				} else {
					this.pagingInit();
					this.userList = [];
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

	/**
	 * 페이지 초기화
	 */
	private pageReset() {
		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';
	}

	/**
	 * 그룹의 사용자 목록 조회
	 *
	 * @param {string} groupId
	 */
	private getUserListByGroupAndKeyWord(groupId: string): void {

		Loading.show();

		this.groupService
			.getUserListByGroupId(groupId, this.keyWord, this.page)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.memberList);
					this.pagination.init(this.page);
					this.userList = result.data.memberList.content;
				} else {
					this.pagingInit();
					this.userList = [];
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 조직의 사용자 목록 조회
	 *
	 * @param {string} orgId
	 */
	private getUserListByOrgAndKeyWord(orgId: string): void {

		Loading.show();

		this.organizationService
			.getUserListByOrgId(orgId, this.keyWord, this.page)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.memberList);
					this.pagination.init(this.page);
					this.userList = result.data.memberList.content;
				} else {
					this.pagingInit();
					this.userList = [];
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

}
