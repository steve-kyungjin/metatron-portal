import {Abstract} from './abstract';

export namespace RoleGroup {

	export enum RoleGroupType {
		GENERAL = <any>'GENERAL',
		ORGANIZATION = <any>'ORGANIZATION',
		SYSTEM = <any>'SYSTEM',
		PRIVATE = <any>'PRIVATE'
	}

	/**
	 * Role group entity
	 *
	 *  - 롤 그룹은 조직, 그룹, 롤 3가지 타입을 가지고 있다
	 */
	export class Entity extends Abstract.Entity {

		id: string;
		type: RoleGroupType;
		name: string;
		description: string;

	}
}
