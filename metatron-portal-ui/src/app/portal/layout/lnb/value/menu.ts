import {CommonResult} from '../../../common/value/result-value';
import {Code} from '../../../common/value/code';

export namespace Menu {

	/**
	 * 카테고리 목록 콤마로 연결
	 *
	 * @param extra
	 */
	export function connectCategoryNameWithCommaInExtraList(extra: Code.Entity[]): string {

		let categoryName = '';

		if (typeof extra !== 'undefined') {
			categoryName = extra.map(category => category.nmKr).join(', ');
		}

		return categoryName;
	}

	/**
	 */
	export enum APP_TYPE {
		NONE = <any>'',
		POPULAR = <any>'POPULAR',
		LATEST = <any>'LATEST'
	}

	export class Entity {
		id: string;
		name: string;
		external: boolean;
		path: string;
		desc: string;
		detailDesc: string;
		link: boolean;
		permission: string;
		children: Array<Children>;
		display: boolean;
		appType: APP_TYPE;
		extraMenu: boolean;
		icon: string;

		constructor() {
		}

		create(id: string, name: string, path: string, permission: string, desc: string) {
			this.id = id;
			this.name = name;
			this.path = path;
			this.permission = permission;
			this.desc = desc;
			return this;
		}
	}

	export class Children {
		id: string;
		name: string;
		external: boolean;
		path: string;
		desc: string;
		link: boolean;
		permission: string;
		media: string;
		children: Array<Children>;
		extra: Code.Entity[];
		display: boolean;
		appType: APP_TYPE;
	}

	export namespace Result {
		export class List extends CommonResult {
			data: {
				menu: Entity[];
			};
		}
	}
}
