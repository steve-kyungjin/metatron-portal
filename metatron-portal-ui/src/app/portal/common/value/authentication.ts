import {CommonResult, Sort} from './result-value';
import {Role} from './role';
import {User} from './user';
import {AnalysisApp} from '../../analysis-app/value/analysis-app.value';
import {ReportApp} from '../../report-app/value/report-app.value';

export namespace Authentication {

	export enum Status {

		REQUEST = <any>'REQUEST',
		DENY = <any>'DENY',
		ACCEPT = <any>'ACCEPT',

		////////////////////////////////////////////
		// View
		////////////////////////////////////////////

		ALL = <any>'ALL'
	}

	export class RequestRoleList {
		content?: (Entity)[] | null;
		last: boolean;
		totalElements: number;
		totalPages: number;
		size: number;
		number: number;
		sort?: (Sort)[] | null;
		first: boolean;
		numberOfElements: number;
	}

	export class Count {
		ALL: number;
		ACCEPT: number;
		REQUEST: number;
	}

	export class Entity {
		id: string;
		role: Role;
		user: User.Entity;
		status: string;
		appType: string;
		createdDate: string;
		updatedDate: string;
		analysisApp?: AnalysisApp.Entity;
		reportApp?: ReportApp.Entity;
	}

	export namespace Result {

		export class List extends CommonResult {
			data: {
				requestRoleList: RequestRoleList;
			};
		}

		export class RolesRequestCount extends CommonResult {
			data: {
				count: Count;
			};
		}
	}

}
