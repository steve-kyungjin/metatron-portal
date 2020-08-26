import {CommonResult} from './result-value';
import {Media} from './media';
import {Role} from './role';
import {Group} from './group';
import {Organization} from './organization';
import {Ia} from './ia';

export namespace User {

	export class Entity {
		userId: string;
		userNm: string;
		orgGrpCd: string;
		orgId: string = '';
		bpId: string;
		vldStaDt: string;
		userStatCd: string;
		useYn: string;
		userBasRmk: string;
		subDeptCd: string;
		bydayRepoSndYn: string;
		gisEtcDeptCd: string;
		frstRegDate: string;
		frstRegUserId: string;
		lastChgDate: string;
		lastChgUserId: string;
		etlDt: string;
		emailAddr: string;
		celpTlno: string;
		lastLoginDate: string;
		admin: boolean;
		org: Organization.Entity;
		orgNm: string; // 소속
		mediaGroup: Media.Group;
		roleList: (Role)[];
		groupList: (Group.Entity)[];
		picUrl: string;
		password: string;
		metatronUrl : string;
	}

	export namespace Result {

		export class Detail extends CommonResult {
			data: {
				iaAndPermissionList: (Ia.IaAndPermissionListEntity)[] | undefined;
				user: Entity;
			}
		}

		export class List extends CommonResult {
			data: {
				userList: {
					content: (Entity)[];
					totalElements: number;
					last: boolean;
					totalPages: number;
					size: number;
					number: number;
					first: boolean;
					numberOfElements: number;
				}
			}
		}
	}
}
