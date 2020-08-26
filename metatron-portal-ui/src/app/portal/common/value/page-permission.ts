import {Indicator} from '../../layout/gnb/value/indicator';
import {Menu} from '../../layout/lnb/value/menu';

export class PagePermission {

	id: string;
	name: string;
	pageUrl: string = '';
	description: string;
	permission: PERMISSION_CODE;
	parent: PagePermission = null;
	indicator: Indicator;
	menu: Menu.Entity = null;

	create(id: string, name: string, pageUrl: string, description: string, permission: PERMISSION_CODE, parent: PagePermission, menu: Menu.Entity) {
		this.id = id;
		this.name = name;
		this.pageUrl = pageUrl;
		this.description = description;
		this.permission = permission;
		this.parent = parent;
		this.menu = menu;
		this.id = id;
		this.id = id;
		return this;
	}

}

/**
 */
export enum PERMISSION_CODE {
	EMPTY = <any>'EMPTY',
	NONE = <any>'NONE',
	RO = <any>'RO',
	RW = <any>'RW',
	SA = <any>'SA'
}
