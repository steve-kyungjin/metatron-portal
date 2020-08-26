import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '../../../common/service/abstract.service';
import {CommonResult} from '../../../common/value/result-value';
import {Ia} from '../../../common/value/ia';
import {MenuManagement} from '../value/menu-management.value';
import DetailResult = MenuManagement.DetailResult;

@Injectable()
export class MenuManagementService extends AbstractService {

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
	 * root menu 가져오기
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public getMenuRoot(): Promise<MenuManagement.ListResult> {
		return this.get(`${this.environment.apiUrl}/ia/root`);
	}

	/**
	 * menu children 가져오기
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public getMenuChildren(id: string): Promise<MenuManagement.ListResult> {
		return this.get(`${this.environment.apiUrl}/ia/${id}/children`);
	}

	/**
	 * 메뉴 등록
	 * @param ia
	 * @returns {Promise<any>}
	 */
	public createMenu(ia: Ia.Entity): Promise<DetailResult> {
		return this.post(`${this.environment.apiUrl}/ia`, ia);
	}

	/**
	 * 메뉴 수정
	 * @param ia
	 * @returns {Promise<any>}
	 */
	public updateMenu(ia: Ia.Entity): Promise<DetailResult> {
		return this.put(`${this.environment.apiUrl}/ia/${ia.id}`, ia);
	}

	/**
	 * 메뉴 삭제
	 * @param ia
	 * @returns {Promise<any>}
	 */
	public deleteMenu(id: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/ia/${id}`);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
