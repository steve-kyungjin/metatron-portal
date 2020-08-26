import {Injectable, Injector} from '@angular/core';
import {ExtractSql} from '../value/extract-app-process';
import {AbstractService} from '../../../../common/service/abstract.service';
import {CommonResult} from '../../../../common/value/result-value';
import * as _ from 'lodash';

@Injectable()
export class ExtractService extends AbstractService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param injector
	 */
	constructor(protected injector: Injector) {
		super(injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 추출 앱 Query 파싱
	 *
	 * @param sql
	 */
	public extractParse(sql: string): Promise<ExtractSql.Result> {
		return this.post(`${this.environment.apiUrl}/extract/parse`, { 'original': sql });
	}

	/**
	 * 추출 앱 쿼리 실행
	 *
	 * @param extractSql
	 */
	public extractProcess(extractSql: ExtractSql.ExtractSql): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/extract/process`, extractSql);
	}

	/**
	 * 커스텀 표현식 이름 중북 검사
	 *
	 * @param name
	 */
	public customVarNameDuplicateCheck(name: string): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/extract/check?name=${name}`)
	}

	/**
	 * 커스텀 변수 추가
	 *
	 * @param customVariable
	 */
	public createCustomVariable(customVariable: ExtractSql.CustomVariable): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/extract/vars`, customVariable);
	}

	/**
	 * 커스텀 변수 수정
	 *
	 * @param customVariable
	 */
	public updateCustomVariable(customVariable: ExtractSql.CustomVariable): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/extract/vars/${customVariable.id}`, customVariable);
	}

	/**
	 * 커스텀 변수 삭제
	 *
	 * @param id
	 */
	public deleteCustomVariable(id: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/extract/vars/${id}`);
	}

	/**
	 * 커스텀 변수 상세 조회
	 *
	 * @param id
	 */
	public getCustomVariable(id: string): Promise<ExtractSql.CustomVariableResult> {
		return this.get(`${this.environment.apiUrl}/extract/vars/${id}`);
	}

	/**
	 * ExtractSql.ModulesEntity
	 *
	 * @param module
	 */
	public customVariableExecute(module: ExtractSql.ModulesEntity): Promise<ExtractSql.CustomVariableExecuteResult> {

		let url = `${this.environment.apiUrl}/extract/vars/${module.namespace}/exec`;

		if (module.args) {
			url += `?arg=${_.first(module.args)}`
		}

		return this.get(url);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
