import {Injectable, Injector} from '@angular/core';
import {AbstractService} from './abstract.service';
import {CommonResult, Page} from '../value/result-value';
import * as _ from 'lodash';
import {User} from '../value/user';
import {Group} from '../value/group';
import {RoleGroup} from '../value/role-group';

@Injectable()
export class GroupService extends AbstractService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private readonly type: RoleGroup.RoleGroupType = RoleGroup.RoleGroupType.GENERAL;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected injector: Injector) {
		super(injector)
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 목록 조회
	 *
	 * @param {string} keyWord
	 * @param {Page} page
	 * @returns {Promise<User.Result.List>}
	 */
	public getList(keyWord: string, page: Page): Promise<Group.Result.List> {

		let url = `${this.environment.apiUrl}/groups?type=${this.type}&size=${page.size}&page=${page.number}`;

		if (_.isUndefined(keyWord) === false && _.isEmpty(keyWord) === false) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 상세 조회
	 *
	 * @param {string} groupId
	 * @returns {Promise<CommonResult>}
	 */
	public getDetail(groupId: string): Promise<Group.Result.Detail> {
		return this.get(`${this.environment.apiUrl}/groups/${groupId}`);
	}

	// noinspection InfiniteRecursionJS
	/**
	 * 삭제
	 *
	 * @param {string} groupId
	 * @returns {Promise<CommonResult>}
	 */
	public deleteGroup(groupId: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/groups/${groupId}`);
	}

	/**
	 * 수정
	 *
	 * @param {Group.Entity} group
	 * @returns {Promise<CommonResult>}
	 */
	public updateGroup(group: Group.Entity): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/groups/${group.id}`, group);
	}

	/**
	 * 사용자 그룹 멤버추가
	 *
	 * @param {string} groupId
	 * @param {string[]} userList
	 * @returns {Promise<CommonResult>}
	 */
	public addGroupUserListByGroupId(groupId: string, userList: string[]): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/groups/${groupId}/add-members`, {
			groupId,
			'users': userList
		});
	}

	/**
	 * 목록 조회
	 *
	 * @param groupId
	 * @param {string} keyWord
	 * @param {Page} page
	 * @returns {Promise<User.Result.List>}
	 */
	public getUserListByGroupAndKeyWord(groupId: string, keyWord: string, page: Page): Promise<Group.Result.List> {

		let url = `${this.environment.apiUrl}/group/userLists?size=${page.size}&page=${page.number}`;

		if (_.isUndefined(keyWord) === false && _.isEmpty(keyWord) === false) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 그룹의 사용자 목록 삭제
	 *  - 삭제라는 메서드가 없어서 빈 배열 목록을 던져서 삭제처리와 동일하게 만들었음
	 *
	 * @param {string} groupId
	 * @returns {Promise<CommonResult>}
	 */
	public deleteAllUserListByGroup(groupId: string): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/groups/${groupId}/add-members`, {
			groupId,
			'users': []
		});
	}

	/**
	 * 생성
	 *
	 * @param group
	 */
	public create(group: Group.Entity): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/groups`, group);
	}

	/**
	 * 그룹의 사용자 목록 조회
	 *
	 * @param {string} groupId
	 * @param {string} keyWord
	 * @param {Page} page
	 * @returns {Promise<CommonResult>}
	 */
	public getUserListByGroupId(groupId: string, keyWord: string, page: Page): Promise<Group.Result.GroupInUserList> {

		let url = `${this.environment.apiUrl}/groups/${groupId}/members?size=${page.size}&page=${page.number}`;

		if (_.isUndefined(keyWord) === false && _.isEmpty(keyWord) === false) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			// url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
