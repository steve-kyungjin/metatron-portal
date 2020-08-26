import {CommonResult} from '../../../portal/common/value/result-value';

export class Zipcode {

	public sido: string;
	public sigungu: string;
	public sigunguCd: string;
	public dong: string;
	public ri: string;
	public zipcode: string;
	public dongcode: string;
	public wkt: string;
}

export class ZipcodeList {
	public zipCodeList: Zipcode[];
}

export class ZipcodeListResult extends CommonResult {
	public data: ZipcodeList;
}
