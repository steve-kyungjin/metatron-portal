import {CommonResult, Sort} from '../../common/value/result-value';

export namespace GlobalSearch {

	export enum Type {

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// View
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		ALL = <any>'all',

		///////////////////////////////////

		COMMUNICATION = <any>'communication',
		REPORT_APP = <any>'report-app',
		ANALYSIS_APP = <any>'analysis-app',
		META_TABLE = <any>'meta-table',
		META_COLUMN = <any>'meta-column'
	}

	export namespace Result {

		export class AutoComplete extends CommonResult {
			data: {
				autoComplete: keywordList;
			};
		}

		export class AllList extends CommonResult {
			data: AllListEntity;
		}

		export class CommunicationList extends CommonResult {
			data: {
				result: CommunicationEntity;
			};
		}

		export class MetaColumnList extends CommonResult {
			data: {
				result: MetaColumnEntity;
			};
		}

		export class MetaTableList extends CommonResult {
			data: {
				result: MetaTableEntity;
			};
		}

		export class ProjectList extends CommonResult {
			data: {
				result: ProjectEntity;
			};
		}

		export class AnalysisAppList extends CommonResult {
			data: {
				result: AnalysisAppEntity;
			};
		}

		export class ReportAppList extends CommonResult {
			data: {
				result: ReportAppEntity;
			};
		}

	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 자동 완성 관련
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	export class keywordList {
		keywordList?: (string)[] | null;
		total: number;
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 전체 검색 결과 관련
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	export class AllListEntity {
		communication: CommunicationEntity;
		metaColumn: MetaColumnEntity;
		metaTable: MetaTableEntity;
		project: ProjectEntity;
		analysisApp: AnalysisAppEntity;
		reportApp: ReportAppEntity;
	}

	export class CommunicationSource {
		displayNm: string;
		imageLink: string;
		postLink: string;
		createdDate: string;
		autocomplete: string;
		postContent: string;
		postTitle: string;
		id: string;
		type: string;
		commentCount: number;
	}

	export class CommunicationEntity {
		total: number;
		contentsList?: ({
			type: string;
			source: (CommunicationSource);
		})[] | null;
		pageable?: {
			sort: Sort;
			offset: number;
			pageNumber: number;
			pageSize: number;
		}
	}

	export class MetaColumnSource {
		fqn: string;
		physicalNm: string;
		logicalNm: string;
		description: string | null;
		refTable: string | null;
		refSql: string | null;
		dataType: string;
		dataSize: number;
		primaryKey: boolean;
		nullable: boolean;
		privacy: string;
		privacyProc: string | null;
		stdFieldId: string | null;
		autocomplete: string;
		type: string;
		createdDate: string;
		id: string;
		tableCnt: number;
	}

	export class MetaColumnEntity {
		total: number;
		contentsList?: ({
			type: string;
			source: MetaColumnSource;
		})[] | null;
		pageable?: {
			sort: Sort;
			offset: number;
			pageNumber: number;
			pageSize: number;
		}
	}

	export class MetaTableSource {
		id: string;
		physicalNm: string;
		logicalNm: string;
		description: string;
		layer: string;
		databaseNm: string;
		subject: string;
		firstCreated: string;
		cycle: string;
		history: string;
		retention: string;
		security: string;
		privacy: string;
		columnCnt: number;
		autocomplete: string;
		type: string;
		createdDate: string;
	}

	export class MetaTableEntity {
		total: number;
		contentsList?: ({
			type: string;
			source: MetaTableSource;
		})[] | null;
		pageable?: {
			sort: Sort;
			offset: number;
			pageNumber: number;
			pageSize: number;
		}
	}

	export class ProjectSource {
		summary: string;
		createdDate: string;
		autocomplete: string;
		name: string;
		progress: string;
		id: string;
		type: string;
		projectType: string;
		worker: string;
		workOrg: string;
	}

	export class ProjectEntity {
		total: number;
		contentsList?: ({
			type: string;
			source: ProjectSource;
		})[] | null;
		pageable?: {
			sort: Sort;
			offset: number;
			pageNumber: number;
			pageSize: number;
		}
	}

	export class AnalysisAppSource {
		appSummary: string;
		createdDate: string;
		autocomplete: string;
		usage: number;
		id: string;
		appNm: string;
		categories: string;
		type?: null;
		mediaId: string;
	}

	export class ReportAppSource {
		appSummary: string;
		createdDate: string;
		autocomplete: string;
		usage: number;
		id: string;
		appNm: string;
		categories: string;
		type?: null;
		mediaId: string;
	}

	export class AnalysisAppEntity {
		total: number;
		contentsList?: (ContentsListEntity)[] | null;
		pageable?: {
			sort: Sort;
			offset: number;
			pageNumber: number;
			pageSize: number;
		}
	}

	export class ReportAppEntity {
		total: number;
		contentsList?: (ContentsListEntity)[] | null;
		pageable?: {
			sort: Sort;
			offset: number;
			pageNumber: number;
			pageSize: number;
		}
	}

	export class ContentsListEntity {
		type: string;
		source: AnalysisAppSource | ReportAppSource;
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// View
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	export enum TypeIndex {
		// noinspection JSUnusedGlobalSymbols
		ALL = 0,
		COMMUNICATION = 1,
		REPORT_APP = 2,
		ANALYSIS_APP = 3,
		META_TABLE = 4,
		META_COLUMN = 5
	}

}

export function getTypeIndex(type: GlobalSearch.Type): number {
	switch (type) {
		case GlobalSearch.Type.ALL: {
			return GlobalSearch.TypeIndex.ALL;
		}
		case GlobalSearch.Type.COMMUNICATION: {
			return GlobalSearch.TypeIndex.COMMUNICATION;
		}
		case GlobalSearch.Type.REPORT_APP: {
			return GlobalSearch.TypeIndex.REPORT_APP;
		}
		case GlobalSearch.Type.ANALYSIS_APP: {
			return GlobalSearch.TypeIndex.ANALYSIS_APP;
		}
		case GlobalSearch.Type.META_TABLE: {
			return GlobalSearch.TypeIndex.META_TABLE;
		}
		case GlobalSearch.Type.META_COLUMN: {
			return GlobalSearch.TypeIndex.META_COLUMN;
		}
		default: {
			return -1;
		}
	}
}
