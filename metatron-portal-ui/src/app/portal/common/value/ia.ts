export namespace Ia {

	/**
	 * Ia명(퍼미션명) 형태로 반환
	 *  - e.g ) Main(RO), 커뮤니케이션(RW), 마이앱 스페이스(RW), 앱 플레이스(RO), 메타데이터(RO), 전체 서비스(RO), 메타트론 2.0(RO), 시스템 도움말(RO)
	 *
	 * @param iaAndPermissionListEntityList
	 */
	export function connectIaNamePermissionWithComma(iaAndPermissionListEntityList: IaAndPermissionListEntity[]): string {
		return iaAndPermissionListEntityList
			.map(iaAndPermissionListEntityList => {
				return `${iaAndPermissionListEntityList.ia.iaNm}(${iaAndPermissionListEntityList.permission})`;
			})
			.join(', ');
	}

	export enum PermissionType {
		RO = <any>'RO',
		RW = <any>'RW',
		SA = <any>'SA'
	}

	export class Entity {

		/**
		 * IA 아이디
		 * */
		id: string;

		/**
		 * IA 명 - 한글
		 * */
		iaNm: string;

		/**
		 * IA 설명 - 한글
		 * */
		iaDesc: string;

		/**
		 * depth
		 */
		depth: number;

		/**
		 * 외부 경로 여부
		 * */
		externalYn: boolean;

		displayYn: boolean;

		linkYn: boolean;

		editYn: boolean;

		/**
		 * 경로 정보 - 현재 제약없음
		 * */
		path: string;

		/**
		 * 순서
		 */
		iaOrder: number;

		childrenCnt: number;
	}

	export class IaAndPermissionListEntity {
		permission: PermissionType;
		ia: Entity;
	}

	///////////////////////////////////////////////////////////////////////////////////////
	// View
	///////////////////////////////////////////////////////////////////////////////////////

	export class Codes {
		readonly introIaCode: string = 'IA000001';
		readonly communityIaCode: string = 'IA000002';
		readonly myAppSpaceIaCode: string = 'IA000003';
		readonly myAppSpaceReportAppIaCode: string = 'IA000021';
		readonly myAppSpaceAnalysisAppIaCode: string = 'IA000022';
		readonly appPlaceIaCode: string = 'IA000004';
		readonly appPlaceReportAppIaCode: string = 'IA000031';
		readonly appPlaceAnalysisAppIaCode: string = 'IA000032';
		readonly metadataIaCode: string = 'IA000005';
		readonly managementIaCode: string = 'IA000006';
		readonly metaTronIaCode: string = 'IA000008';
		readonly siteMapIaCode: string = 'IA000007';
		readonly helpIaCode: string = 'IA000009';
		readonly knimeIaCode: string = 'IA000010';
	}

}
