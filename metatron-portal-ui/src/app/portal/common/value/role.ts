import {CommonResult} from './result-value';
import {RoleGroup} from './role-group';

/**
 * 권한 목록에서 권한 이름을 콤마로 연결
 *
 * @param {Role[]} roleList
 * @returns {string}
 */
export function connectRoleNmWithCommaInRoleList(roleList: Role[]): string {

	let roleName = '';

	if (typeof roleList !== 'undefined') {
		roleName = roleList.map(role => role.name).join(', ');
	}

	return roleName;
}

export class Role extends RoleGroup.Entity {

	//////////////////////////////////////////////////////////////
	// VIEW
	//////////////////////////////////////////////////////////////

	isChecked: boolean = false;
}

export class RoleResult extends CommonResult {
	public data: Role[];
}
