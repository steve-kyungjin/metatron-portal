import {CommonResult} from './result-value';

export class GroupCode {

	/**
	 *
	 */
	public groupCd: string;

	/**
	 * 그룹코드명 = 한글
	 */
	public groupNmKr: string;

	/**
	 * 그룹코드명 - 영어
	 */
	public groupNmEn: string;

	/**
	 * 그룹코드 설명
	 */
	public groupDesc: string;
}

export class GroupCodeResult extends CommonResult {
	public data: GroupCode;
}
