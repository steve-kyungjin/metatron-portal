import {CommonResult} from '../../../common/value/result-value';

export namespace ConnectLog {

	export enum ActionType {
		LOGIN = <any>'LOGIN',
		LOGOUT = <any>'LOGOUT'
	}

	export enum Endpoint {
		TNET = <any>'TNET',
		TANGO = <any>'TANGO',
		METATRON = <any>'METATRON'
	}

	export class Entity {
		id: string;
		type: ActionType;
		endpoint: Endpoint;
		accessIp: string;
		accessUserId: string;
		accessUserNm: string;
		accessTime: string;
	}

	export namespace Result {

		export class List extends CommonResult {
			data: {
				logList: {
					content?: (ConnectLog.Entity)[] | null;
					last: boolean;
					totalPages: number;
					totalElements: number;
					size: number;
					number: number;
					numberOfElements: number;
					first: boolean;
				};
			};
		}

	}

}
