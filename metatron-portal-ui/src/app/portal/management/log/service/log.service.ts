import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '../../../common/service/abstract.service';
import {Page} from '../../../common/value/result-value';
import {AppLog} from '../value/app-log';
import * as _ from 'lodash';
import {ConnectLog} from '../value/connect';

@Injectable()
export class LogService extends AbstractService {

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
	 * get app log
	 *
	 * @param keyWord
	 * @param page
	 */
	public getAppList(keyWord: string, page: Page): Promise<AppLog.Result.LogList> {

		let url = `${this.environment.apiUrl}/log/app?size=${page.size}&page=${page.number}`;

		if (_.isUndefined(keyWord) === false && _.isEmpty(keyWord) === false) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * get system connect log
	 *
	 * @param keyWord
	 * @param page
	 */
	public getSystemConnectList(keyWord: string, page: Page): Promise<ConnectLog.Result.List> {

		let url = `${this.environment.apiUrl}/log/sys?size=${page.size}&page=${page.number}`;

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
