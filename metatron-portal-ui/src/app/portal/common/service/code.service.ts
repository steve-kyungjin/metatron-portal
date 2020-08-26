import {Injectable, Injector} from '@angular/core';
import {AbstractService} from './abstract.service';
import {GroupCode, GroupCodeResult} from '../value/group-code';
import {Code} from '../value/code';

@Injectable()
export class CodeService extends AbstractService {

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

	constructor(protected injector: Injector) {
		super(injector)
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 그룹코드 생성
	 *
	 * @param {GroupCode} data
	 * @returns {Promise<GroupCodeResult>}
	 */
	public createGroupCode(data: GroupCode): Promise<GroupCodeResult> {
		return this.post(`${this.environment.apiUrl}/group-codes`, data);
	}

	/**
	 * 그룹코드 조회
	 *
	 * @param {string} groupCd
	 * @returns {Promise<GroupCodeResult>}
	 */
	public getGroupCodeByGrpCdKey(groupCd: string): Promise<GroupCodeResult> {
		return this.get(`${this.environment.apiUrl}/group-codes/${groupCd}`);
	}

	/**
	 * 코드 목록 조회 by 그룹코드
	 *
	 * @param {string} groupCd
	 * @returns {Promise<GroupCodeResult>}
	 */
	public getCodesByGrpCdKey(groupCd: string): Promise<Code.Result.List> {
		return this.get(`${this.environment.apiUrl}/group-codes/${groupCd}/codes`);
	}

	/**
	 * 코드 생성
	 *
	 * @param {Code.Entity} data
	 * @returns {Promise<Code.Result.Code>}
	 */
	public createCode(data?: Code.Entity): Promise<Code.Result.Code> {
		return this.post(`${this.environment.apiUrl}/codes/`, data);
	}

	/**
	 * 코드 조회
	 *
	 * @param {number} codeId
	 * @returns {Promise<Code.Result.Code>}
	 */
	public getCodeByCodeId(codeId: number): Promise<Code.Result.Code> {
		return this.get(`${this.environment.apiUrl}/codes/${codeId}`);
	}

	/**
	 * 코드 멀티 수정
	 *
	 * @param {Code.Entity[]} codes
	 * @returns {Promise<Code.Result.Code>}
	 */
	public updateCodes(codes: Code.Entity[]): Promise<Code.Result.Code> {
		return this.put(`${this.environment.apiUrl}/codes`, codes);
	}

	/**
	 * 코드 수정
	 *
	 * @param {Code.Entity} code
	 * @returns {Promise<Code.Result.Code>}
	 */
	public updateCode(code: Code.Entity): Promise<Code.Result.Code> {
		return this.put(`${this.environment.apiUrl}/codes/${code.id}`, code);
	}

	/**
	 * 코드 삭제
	 *
	 * @param {string} codeId
	 * @returns {Promise<Code.Result.Code>}
	 */
	public deleteByCodeId(codeId: string): Promise<Code.Result.Code> {
		return this.delete(`${this.environment.apiUrl}/codes/${codeId}`);
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 코드 정규식 통과
	 *  - 영문 대문자 3 글자 또는 숫자 3 글자
	 *
	 * @param {string} code
	 * @returns {boolean}
	 */
	public passCodeRegularExpression(code: string) {
		return /^([A-Z]{3}|[\d]{3})$/g.test(code);
	}

	/**
	 *
	 *
	 * @param groupCodeList
	 */
	public getCodeListByGroupCodeList(groupCodeList: string[]): Promise<Code.Result.ListByKey> {
		const param = groupCodeList.length > 0
			? groupCodeList
				.map(code => {
					return code;
				})
				.join(',')
			: '';
		return this.get(`${this.environment.apiUrl}/group-codes/codes?group-codes=${param}`);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
