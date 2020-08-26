import {CommonResult} from '../../../../common/value/result-value';
import {SelectValue} from '../../../../../common/component/select/select.value';

export namespace ExtractSql {

	export class Data {
		extractSql: ExtractSql;
	}

	export class ExtractSql {
		original: string;
		processed: string;
		modules?: (ModulesEntity)[] | null;
	}

	export class ModulesEntity {
		id: string;
		namespace: string;
		name: string;
		moduleType: 'CUSTOM' | 'BASIC';
		description: string;
		multiple: boolean;
		input: string;
		args?: (string)[] | null;

		//////////////////////////////////////////////////
		// View
		//////////////////////////////////////////////////

		selectValues: SelectValue[];
		label: string;
		isSuccess?: boolean = true;
	}

	export class CustomVariable {
		// 아이디
		id: string;
		// 이름
		name: string;
		// 설명
		description: string;
		// 쿼리
		sqlTxt: string;
		// 검색키
		searchKey: string;

		/////////////////////////////////////////////
		// Params
		/////////////////////////////////////////////

		dataSourceId: string;
	}

	export class CustomVariableExecute {
		code: string;
		label: string;
	}

	export class Result extends CommonResult {
		data: Data;
	}

	export class CustomVariableExecuteResult extends CommonResult {
		data: {
			result: {
				headList?: (string)[] | null;
				resultList?: (CustomVariableExecute)[] | null;
			};
		}
	}

	export class CustomVariableResult extends CommonResult {
		data: {
			var: CustomVariable;
		}
	}

	export class Vars extends CommonResult {
		data: {
			varList: {
				content: (CustomVariable)[];
				last: boolean;
				totalPages: number;
				totalElements: number;
				size: number;
				number: number;
				first: boolean;
				numberOfElements: number;
			}
		}
	}

}
