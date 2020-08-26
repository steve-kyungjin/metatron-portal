import {CommonResult} from './result-value';
import {Role} from './role';
import {User} from './user';
import {RoleGroup} from './role-group';
import {Ia} from './ia';

/**
 * 롤 그룹 엔티티를 상속받은 그룹
 */
export namespace Group {

	/**
	 * 그룹 목록에서 그룹 이름을 콤마로 연결
	 *
	 * @param {Role[]} groupList
	 * @returns {string}
	 */
	export function connectGroupNmWithCommaInGroupList(groupList: Group.Entity[]): string {

		let groupName = '';

		if (typeof groupList !== 'undefined') {
			groupName = groupList.map(group => {
				return group.name;
			}).join(', ');
		}

		return groupName;
	}

	export class Entity extends RoleGroup.Entity {

		readonly type: RoleGroup.RoleGroupType = RoleGroup.RoleGroupType.GENERAL;
		memberCnt: number;

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// View
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		isGroupDescEditMode: boolean;
		isGroupDescError: boolean;
		isGroupNmEditMode: boolean;
		isGroupNmError: boolean;
		members: User.Entity[];

	}

	export namespace Result {

		export class List extends CommonResult {
			data: {
				groupList: {
					content: (Entity)[];
				}
			}
		}

		export class Detail extends CommonResult {
			data: {
				iaAndPermissionList: (Ia.IaAndPermissionListEntity)[] | undefined;
				group: Entity;
			}
		}

		export class GroupInUserList extends CommonResult {
			data: {
				memberList: {
					content: (User.Entity)[];
					last: boolean;
					totalPages: number;
					totalElements: number;
					size: number;
					number: number;
					first: boolean;
					numberOfElements: number;
				};
			};
		}
	}
}
