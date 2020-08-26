import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '../../../common/service/abstract.service';
import {CommonResult, Page} from '../../../common/value/result-value';
import {Authentication} from '../../../common/value/authentication';

@Injectable()
export class RequestApprovalService extends AbstractService {

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
	 * 권한 신청 목록 가져오기
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public getRequestRoleList(keyWord: string, page: Page, status: Authentication.Status): Promise<Authentication.Result.List> {

		let url = `${this.environment.apiUrl}/groups/request?size=${page.size}&page=${page.number}`;

		if (keyWord) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		if (status) {
			if (status !== Authentication.Status.ALL) {
				url += `&status=${status}`;
			}
		}

		return this.get(url);
	}

	/**
	 * 권한 신청 카운트 조회
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public getRolesRequestCount(keyWord: string): Promise<Authentication.Result.RolesRequestCount> {

		let url = `${this.environment.apiUrl}/groups/request/count`;

		if (keyWord) {
			url += `?keyword=${encodeURIComponent(keyWord)}`;
		}

		return this.get(url);
	}

	/**
	 * Role 신청 승인
	 *
	 * @param {string} id
	 * @returns {Promise<CommonResult>}
	 */
	public acceptRoleRequest(id: string): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/groups/accept/${id}`, null);
	}

	/**
	 * Role 신청 삭제
	 *
	 * @param {string} id
	 * @returns {Promise<CommonResult>}
	 */
	public deleteRoleRequest(id: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/groups/request?requestId=${id}`);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
