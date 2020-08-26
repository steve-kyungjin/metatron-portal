import {Injectable, Injector} from '@angular/core';
import {AbstractService} from './abstract.service';
import {RoleResult} from '../value/role';
import {CommonResult} from '../value/result-value';

@Injectable()
export class RoleService extends AbstractService {

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
		super(injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 전체 롤 목록 가져오기
	 *
	 * @returns {Promise<any>}
	 */
	public getAllRoleList(): Promise<RoleResult> {
		return this.get(`${this.environment.apiUrl}/roles`);
	}

	/**
	 * 분석 앱 롤 목록 가져오기
	 *
	 * @returns {Promise<any>}
	 */
	public getAnalysisAppRoleList(appId: string): Promise<RoleResult> {
		return this.get(`${this.environment.apiUrl}/roles/analysis-app/${appId}`);
	}

	/**
	 * 리포트 롤 목록 가져오기
	 *
	 * @returns {Promise<any>}
	 */
	public getReportAppRoleList(appId: string): Promise<RoleResult> {
		return this.get(`${this.environment.apiUrl}/roles/report-app/${appId}`);
	}

	/**
	 * 롤 수락하기
	 *
	 * @returns {Promise<any>}
	 */
	public acceptRole(roleId: string): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/roles/accept/${roleId}`, null);
	}

	/**
	 * 롤 거부하기
	 *
	 * @returns {Promise<any>}
	 */
	public denyRole(roleId: string): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/roles/deny/${roleId}`, null);
	}

	/**
	 * 내 롤 목록 조회
	 *
	 * @returns {Promise<any>}
	 */
	public getMyRoleList(): Promise<RoleResult> {
		return this.get(`${this.environment.apiUrl}/roles/my`);
	}

	/**
	 * 앱 권한 신청하기
	 *
	 * @returns {Promise<any>}
	 */
	public requestAppRole(appType: string, appId: string): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/groups/request?appType=${appType}&appId=${appId}`, null);
	}

	/**
	 * 시스템 관리자 등록
	 * @param userid
	 * @returns {Promise<any>}
	 */
	public addSystemAdmin(userId: string): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/groups/sa/${userId}`, null);
	}

	/**
	 * 시스템 관리자 삭제
	 * @param userid
	 * @returns {Promise<any>}
	 */
	public deleteSystemAdmin(userId: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/groups/sa/${userId}`, null);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
