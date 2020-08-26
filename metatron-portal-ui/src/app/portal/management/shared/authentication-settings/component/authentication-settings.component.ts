import {Component, ElementRef, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {RoleGroup} from '../../../../common/value/role-group';
import {Utils} from '../../../../../common/util/utils';
import {User} from '../../../../common/value/user';
import {Group} from '../../../../common/value/group';
import {Organization} from '../../../../common/value/organization';

const enum Mode {
	USER,
	GROUP,
	ORG,
	NONE
}

@Component({
	selector: '[authority-settings]',
	templateUrl: './authentication-settings.component.html'
})
export class AuthenticationSettingsComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 롤 기본값 여부
	 */
	private _isRoleDefaultMode: string = 'true';

	/**
	 * 사용자 목록
	 */
	private _privateUserList: RoleGroup.Entity[] = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * UUID
	 */
	public UUID: string = Utils.Generate.UUID();

	/**
	 * 사용자 목록
	 */
	@Input()
	public userList: User.Entity[] = [];

	/**
	 * 그룹 목록
	 */
	@Input()
	public groupList: Group.Entity[] = [];

	/**
	 * 조직 목록
	 */
	@Input()
	public organizationList: Organization.Entity[] = [];

	/**
	 * 사용자 선택 모드
	 */
	public userSelectMode: Mode = Mode.USER;

	/**
	 * 그룹 선택 모드
	 */
	public groupSelectMode: Mode = Mode.GROUP;

	/**
	 * 조직 선택 모드
	 */
	public orgSelectMode: Mode = Mode.ORG;

	/**
	 * 팝업 ( 사용자, 그룹, 조직 )
	 */
	public popupMode: Mode = Mode.NONE;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector) {
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
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	get privateUserList(): RoleGroup.Entity[] {
		return this._privateUserList;
	}

	@Input()
	set privateUserList(value: RoleGroup.Entity[]) {

		this._privateUserList = value;

		// 기존에 선택된 그룹 목록
		if (this._privateUserList.length > 0) {
			const defaultUserList: User.Entity[] = [];
			const privateUserList: RoleGroup.Entity[] = _.cloneDeep(this._privateUserList);
			privateUserList
				.forEach(user => {
					const tempUser: User.Entity = new User.Entity();
					tempUser.userId = user.id;
					tempUser.userNm = user.name;
					defaultUserList.push(tempUser);
				});
			this.userList = defaultUserList;
		}
	}

	get isRoleDefaultMode(): string {
		return this._isRoleDefaultMode;
	}

	@Input()
	set isRoleDefaultMode(value: string) {
		this._isRoleDefaultMode = value;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 롤 아이디 목록 반환
	 */
	public getRoleIdList(): string[] {
		if (this.isRoleDefaultMode === 'true') {
			return [ 'DEFAULT_USER' ];
		} else {
			const roleIdList: string[] = [];
			this.userList
				.forEach(user => {
					roleIdList.push(user.userId);
				});
			this.groupList
				.forEach(group => {
					roleIdList.push(group.id);
				});
			this.organizationList
				.forEach(organization => {
					roleIdList.push(organization.id);
				});
			return roleIdList.length > 0 ? roleIdList : [ 'DEFAULT_USER' ];
		}
	}

	/**
	 * 사용자 선택 완료
	 *
	 * @param userList
	 */
	public doneUserSelect(userList: User.Entity[]) {
		this.popupMode = Mode.NONE;
		this.userList = userList;
	}

	/**
	 * 사용자 선택 닫기
	 */
	public closeUserSelect() {
		this.popupMode = Mode.NONE;
	}

	/**
	 * 그룹 선택 완료
	 *
	 * @param groupList
	 */
	public doneGroupSelect(groupList: Group.Entity[]) {
		this.popupMode = Mode.NONE;
		this.groupList = groupList;
	}

	/**
	 * 그룹 선택 닫기
	 */
	public closeGroupSelect() {
		this.popupMode = Mode.NONE;
	}

	/**
	 * 조직 선택 완료
	 *
	 * @param organizationList
	 */
	public doneOrgSelect(organizationList: Organization.Entity[]) {
		this.popupMode = Mode.NONE;
		this.organizationList = organizationList;
	}

	/**
	 * 조직 선택 닫기
	 */
	public closeOrgSelect() {
		this.popupMode = Mode.NONE;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
