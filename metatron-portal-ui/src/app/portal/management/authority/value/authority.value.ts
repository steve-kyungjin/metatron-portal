import {Ia} from '../../../common/value/ia';
import {RoleGroup} from '../../../common/value/role-group';
import {CommonResult, Page} from '../../../common/value/result-value';

/**
 * 권한
 */
export namespace Authority {
	export class Entity extends RoleGroup.Entity {
		memberCnt: number;
	}

	/**
	 * 화면용으로 만든 entity
	 */
	export class ViewEntity {
		constructor(
			private _title: string,
			private _subTitle: string,
			private _iaCode: string,
			private _rowSpan: number,
			private _authorityList: Array<Object>,
			private _selectedPermission: Ia.PermissionType = null
		) {
			this.title = _title;
			this.subTitle = _subTitle;
			this.iaCode = _iaCode;
			this.rowSpan = _rowSpan;
			this.authorityList = _authorityList;
			this.selectedPermission = _selectedPermission;
		}

		public title: string;
		public subTitle: string;
		public iaCode: string;
		public rowSpan: number;
		public authorityList: Array<Object>;

		public selectedPermission: Ia.PermissionType;
	}

	export class Counts {
		GENERAL: number;
		ORGANIZATION: number;
	}

	export class GroupContent extends Page {
		content: Entity[];
	}

	export class List {
		counts: Counts;
		groupList: GroupContent;
	}

	export class ListResult extends CommonResult {
		data: List;
	}

	/**
	 * Detail
	 */
	export class Detail {
		iaAndPermissionList: Ia.IaAndPermissionListEntity[];
		group: Entity;
	}

	/**
	 * DetailResult
	 */
	export class DetailResult extends CommonResult {
		public data: Detail;
	}

}
