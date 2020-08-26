import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '../../../common/service/abstract.service';
import {CommonResult, Page} from '../../../common/value/result-value';
import {RoleGroup} from '../../../common/value/role-group';
import {Authority} from '../value/authority.value';

@Injectable()
export class AuthorityService extends AbstractService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

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
	 * 권한 목록 가져오기
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public getAuthorityList(type: RoleGroup.RoleGroupType, keyWord: string, page: Page): Promise<Authority.ListResult> {

		let url = `${this.environment.apiUrl}/groups?type=${type}&size=${page.size}&page=${page.number}`;

		if (keyWord) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort && page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 권한 상세 가져오기
	 * @param id
	 * @returns {Promise<any>}
	 */
	public getAuthorityDetail(id: string): Promise<Authority.DetailResult> {
		return this.get(`${this.environment.apiUrl}/groups/${id}`);
	}

	/**
	 * 권한 저장
	 * @param id
	 * @param authorityLIst
	 * @returns {Promise<any>}
	 */
	public saveAuthority(id: string, authorityLIst: Authority.ViewEntity[]): Promise<Authority.DetailResult> {
		let params = [];
		Array.from(authorityLIst).forEach(value => {
			if (value.selectedPermission != -1) {
				params.push({ iaId: value.iaCode, permission: value.selectedPermission });
			}
		});

		return this.post(`${this.environment.apiUrl}/groups/${id}/setup`, params);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
