import {CommonResult} from '../../../../common/value/result-value';

export namespace DataSource {

	export class Entity {
		public id: string;
		public name: string;
		public host: string;
		public port: number;
		public databaseType: DatabaseType;
		public databaseNm: string;
		public databaseUser?: string | null;
		public databasePassword?: string | null;
	}

	export enum DatabaseType {
		HIVE = <any>'HIVE',
		MYSQL = <any>'MYSQL'
	}

	export class ResultDataSource extends CommonResult {
		data: Entity;
	}

	export class ResultQuery extends CommonResult {
		data: QueryResultEntity;
	}

	export class QueryResultEntity {
		queryResult: QueryResult;
	}

	export class QueryResult {
		headList?: (string)[] | null;
		resultList?: (ResultListEntity)[] | null;
	}

	export class ResultListEntity {
		id: string;
		name: string;
		user_id: string;
	}

	///////////////////////////////////////////////
	// View
	///////////////////////////////////////////////

	export class ExecuteSelectQueryParameter {

		public readonly MAX_ROW = 100000;

		public dataSourceId: string;
		public sql: string;
		public max: number;

		///////////////////////////////////////////////
		// View
		///////////////////////////////////////////////

		public isValidationMax: boolean;

		///////////////////////////////////////////////
		//
		///////////////////////////////////////////////

		public isMaxRowExcess(max: number): boolean {
			return max > this.MAX_ROW;
		}

	}

}
