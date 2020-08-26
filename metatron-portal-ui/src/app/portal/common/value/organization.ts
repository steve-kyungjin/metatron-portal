import {RoleGroup} from './role-group';
import {CommonResult} from './result-value';

/**
 * 롤 그룹 엔티티를 상속받은 조직
 */
export namespace Organization {

	export class Entity extends RoleGroup.Entity {
		readonly type: RoleGroup.RoleGroupType = RoleGroup.RoleGroupType.ORGANIZATION;
		childrenCnt: number;
		memberCnt: number;
	}

	export namespace Result {

		export class RootList extends CommonResult {
			data: {
				groupList: (Entity)[];
			}
		}

		export class List extends CommonResult {
			data: {
				groupList: {
					content: (Entity)[];
				}
			}
		}

	}

}
