import {Ia} from '../../../common/value/ia';
import {CommonResult} from '../../../common/value/result-value';

/**
 * 메뉴
 */
export namespace MenuManagement {

	export class Entity extends Ia.Entity {
		parentId: string;
	}

	export class List {
		iaList: Entity[];
	}

	export class ListResult extends CommonResult {
		data: List;
	}

	export class Detail {
		ia: Entity;
	}

	export class DetailResult extends CommonResult {
		data: Detail;
	}

}
