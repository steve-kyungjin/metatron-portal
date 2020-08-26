import {Injectable, Injector} from '@angular/core';
import {AbstractService} from './abstract.service';
import {RoleGroup} from '../value/role-group';
import {Organization} from '../value/organization';
import {CommonResult, Page} from '../value/result-value';
import * as _ from 'lodash';

@Injectable()
export class OrganizationService extends AbstractService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private readonly type: RoleGroup.RoleGroupType = RoleGroup.RoleGroupType.ORGANIZATION;

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
	public getList(keyWord: string, page: Page): Promise<Organization.Result.List> {

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
	 * 조직 루트 조회
	 */
	public getOrgRoot(): Promise<Organization.Result.RootList> {
		return this.get(`${this.environment.apiUrl}/groups/root?type=${this.type}`);
	}

	/**
	 * 조직 루트 조회
	 *
	 * @param orgId
	 */
	public getOrgRootChildren(orgId: string): Promise<Organization.Result.RootList> {
		return this.get(`${this.environment.apiUrl}/groups/${orgId}/children?type=${this.type}`);
	}

	/**
	 * 사용자 목록 조회
	 *
	 * @param orgId
	 * @param keyWord
	 * @param page
	 */
	public getUserListByOrgId(orgId: string, keyWord: string, page: Page): Promise<CommonResult> {

		let url = `${this.environment.apiUrl}/groups/${orgId}/members?size=${page.size}&page=${page.number}`;

		if (_.isUndefined(keyWord) === false && _.isEmpty(keyWord) === false) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
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
