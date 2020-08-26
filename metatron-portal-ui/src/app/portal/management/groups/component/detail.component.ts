import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {GroupService} from '../../../common/service/group.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Loading} from '../../../../common/util/loading-util';
import {Group} from '../../../common/value/group';
import * as _ from 'lodash';
import {Alert} from '../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import {DialogService} from '../../../../common/component/dialog/dialog.service';
import {User} from '../../../common/value/user';
import {Page, Sort} from '../../../common/value/result-value';
import {Ia} from '../../../common/value/ia';
import {UserService} from '../../../common/service/user.service';

@Component({
	selector: '[detail]',
	templateUrl: './detail.component.html',
	host: { '[class.page-management-group]': 'true' }
})
export class DetailComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	 * 그룹
	 */
	public group: Group.Entity = new Group.Entity();

	/**
	 * IaAndPermissionListEntity
	 */
	public iaAndPermissionList: Ia.IaAndPermissionListEntity[] = [];

	/**
	 * 수정할 떄 사용할 그룹 객체
	 *
	 * @type {Group.Entity}
	 */
	public editGroup: Group.Entity = new Group.Entity();

	/**
	 * 그룹 사용자 추가 팝업 SHOW/HIDE 플래그
	 *
	 * @type {boolean}
	 */
	public isOpenGroupUserAddPopup: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param userService
	 * @param translateService
	 * @param dialogService
	 * @param groupService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public userService: UserService,
				public translateService: TranslateService,
				private dialogService: DialogService,
				private groupService: GroupService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		Loading.show();

		this.subscriptions.push(
			this.activatedRoute
				.params
				.subscribe((params: { id }) => {

					this.group.members = [];

					Promise.resolve()
						.then(() => {
							return this.getDetail(params.id, false);
						})
						// .then(() => {
						// 	return this.getUserListByGroupId(params.id, false);
						// })
						.then(() => {
							return Loading.hide();
						})
						.catch(error => {
							Loading.hide();
							this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
						});
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
	 * 목록 화면 이동
	 */
	public goListPage(): void {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ `view/management/groups` ]);
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * Connect ia name permission with comma
	 *
	 * @param iaAndPermissionListEntityList
	 */
	public connectIaNamePermissionWithComma(iaAndPermissionListEntityList: Ia.IaAndPermissionListEntity[]) {
		return Ia.connectIaNamePermissionWithComma(iaAndPermissionListEntityList);
	}

	/**
	 * 수정
	 *
	 * @param {Group.Entity} group
	 */
	public updateGroup(group: Group.Entity): void {

		Loading.show();

		this.groupService
			.updateGroup(group)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));
					this.group = _.cloneDeep(this.editGroup);
					this.group.isGroupNmEditMode = false;
					this.group.isGroupDescEditMode = false;
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 수정 모드 변경
	 */
	public changeEditMode(): void {
		this.editGroup = new Group.Entity();
		this.editGroup = _.cloneDeep(this.group);
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
							this.goListPage();
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
	 * 그룹 사용자 추가 팝업 열기
	 */
	public openGroupUserAddPopup() {
		this.isOpenGroupUserAddPopup = true;
	}

	/**
	 * 그룹 사용자 추가 팝업 완료
	 *
	 * @param userList
	 */
	public doneGroupUserAddPopup(userList: User.Entity[]): void {

		Loading.show();
		const userIdList: string[] = userList.map(user => user.userId);
		this.groupService
			.addGroupUserListByGroupId(this.group.id, userIdList)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.isOpenGroupUserAddPopup = false;
					this.group.isGroupNmEditMode = false;
					this.group.isGroupDescEditMode = false;
					this.getUserListByGroupId(this.group.id);
					Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 그룹 사용자 추가 팝업 닫기
	 */
	public closeGroupUserAddPopup() {
		this.isOpenGroupUserAddPopup = false;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 상세 조회
	 *
	 * @param {string} groupId
	 * @param isLoading
	 */
	private getDetail(groupId: string, isLoading: boolean = true): void {

		if (isLoading) {
			Loading.show();
		}

		this.groupService
			.getDetail(groupId)
			.then((result: Group.Result.Detail) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					result.data.group.isGroupNmEditMode = false;
					result.data.group.isGroupDescEditMode = false;
					this.group = result.data.group;
					this.iaAndPermissionList = result.data.iaAndPermissionList;
				} else {
					this.group = new Group.Entity();
				}

				if (isLoading) {
					Loading.hide();
				}

				this.getUserListByGroupId(groupId, false)
			});
	}

	/**
	 * 그룹의 사용자 목록 조회
	 *
	 * @param groupId
	 * @param isLoading
	 */
	private getUserListByGroupId(groupId: string, isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		const keyWordEmptyParam: string = '';
		const nonPageParam = new Page();
		nonPageParam.number = 0;
		nonPageParam.size = 9999;
		nonPageParam.sort = new Sort();
		nonPageParam.sort.property = 'createdDate,desc';
		nonPageParam.sort.direction = 'desc';

		this.groupService
			.getUserListByGroupId(groupId, keyWordEmptyParam, nonPageParam)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.group.members = result.data.memberList.content;
				} else {
					this.group.members = [];
				}

				if (isLoading) {
					Loading.hide();
				}
			});
	}

}
