/**
 * Validation 처리를 위한 유틸
 */
export class Validate {

	/**
	 * 파라미터가 비어있는지 여부
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static isEmpty(param: string): boolean {
		// noinspection SuspiciousTypeOfGuard
		return param === undefined || param === null || (typeof param != 'number' && this.trim(param) === '');
	}

	/**
	 * escape 처리
	 *
	 * @param {string} param
	 * @returns {string}
	 */
	public static escapeHtml(param: string): string {

		const escapeMap = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			'\'': '&#39;',
			'/': '&#x2F;'
		};

		return param
			.replace(/[&<>"'\/]/g, s => {
				return escapeMap[ s ];
			});
	}

	/**
	 * trim 처리
	 *
	 * @param {string} param
	 * @returns {string}
	 */
	public static trim(param: string): string {
		return param.trim();
	}

	/**
	 * 왼쪽 trim 처리
	 *
	 * @param {string} param
	 * @returns {string}
	 */
	public static lTrim(param: string): string {
		return param.replace(/^\s+/, '');
	}

	/**
	 * 오른쪽 trim 처리
	 *
	 * @param {string} param
	 * @returns {string}
	 */
	public static rTrim(param: string): string {
		return param.replace(/\s+$/, '');
	}

	/**
	 * 영문인지 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static isOnlyEng(param: string): boolean {
		return /^[a-zA-Z\x20]*$/g.test(param);
	}

	/**
	 * 숫자인지 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static isNumber(param: string): boolean {
		return !/([^0-9])/i.test(param);
	}

	/**
	 * 특수문자인지 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static isSpecialconstter(param: string): boolean {
		// noinspection RegExpRedundantEscape
		return /([!@#$%^*+=()~`\{\}\[\]\;\:\'\"\,\.\/\?\<\>\|\&\\])/i.test(param);
	}

	/**
	 * 한글인지 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static isOnlyKor(param: string): boolean {
		return /^[가-힣ㄱ-ㅎㅏ-ㅣ\x20]*$/i.test(param);
	}

	/**
	 * 한글포함인지 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static containKor(param: string): boolean {
		return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(param);
	}

	/**
	 * 같은 문자열 반복 체크
	 * e.g) 1111, aaaa, ccc
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static checkSameChar(param: string) {
		return /(.)\1\1\1/.test(param);
	}

	/**
	 * 자리수 체크
	 *
	 * @param {string} param
	 * @param {number} startIndex 최소 자리수
	 * @param {number} endIndex 최대 자리수
	 * @returns {boolean}
	 */
	public static checkLength(param: string, startIndex: number, endIndex: number): boolean {
		return !!(param && param.length >= startIndex && param.length <= endIndex);
	}

	/**
	 * min 자리수 체크
	 *
	 * @param {string} param 문자열
	 * @param {number} macLength 최소 자리수
	 * @returns {boolean}
	 */
	public static checkMinLength(param: string, macLength: number): boolean {
		return param.length < macLength;
	}

	/**
	 * max 자리수 체크
	 *
	 * @param {string} param 문자열
	 * @param {number} macLength 최대 자리수
	 * @returns {boolean}
	 */
	public static checkMaxLength(param: string, macLength: number): boolean {
		return param.length > macLength;
	}

	/**
	 * 도메인인지 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static isDomain(param: string): boolean {
		// noinspection RegExpRedundantEscape
		return /^(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(param);
	}

	/**
	 * 도메인 한글 및 특수문자 포함여부 (영문자, 숫자, -, . 이외의 문자가 있는지 체크)
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static containKorSpecDomain(param: string): boolean {
		// noinspection RegExpRedundantEscape
		return /.*[ㄱ-ㅎ|ㅏ-ㅣ|가-힣+!@#$%^*+=()~`\{\}\[\]\;\:\'\"\,\_\/\?\<\>\|\&\\]/.test(param);
	}

	/**
	 * 도메인 . - 뒤에 . 이 연속으로 있는지 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static containSubDotDomain(param: string): boolean {
		// noinspection RegExpRedundantEscape
		return /(\.{2,})|(\-\.+)|(\.\-+)/.test(param);
	}

	/**
	 * 영문 숫자, 특수 문자 포함인지 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static checkCombineconstter(param: string): boolean {
		return /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9])/i.test(param);
	}

	/**
	 * URL 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static checkUrl(param: string): boolean {
		// noinspection RegExpRedundantEscape
		return /^(mirror|http|https):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(param);
	}

	/**
	 * 메모리 사이즈체크
	 *
	 * @param {number} param
	 * @param {number} maxSize
	 * @returns {boolean}
	 */
	public static checkMaxSize(param: number, maxSize: number): boolean {
		return param > maxSize;
	}

	/**
	 * 이메일 형식 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static isEmail(param: string): boolean {
		// noinspection RegExpRedundantEscape
		return /^(\".*\"|[A-Za-z0-9_-]([A-Za-z0-9_-]|[\+\.])*)@(\[\d{1,3}(\.\d{1,3}){3}]|[A-Za-z0-9][A-Za-z0-9_-]*(\.[A-Za-z0-9][A-Za-z0-9_-]*)+)$/i.test(param);
	}

	/**
	 * 특수문자 포함여부 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static containSpeconstter(param: string): boolean {
		// noinspection RegExpRedundantEscape
		return /.*[!@#$%^*+=()~`\-\_\{\}\[\]\;\:\'\"\,\.\/\?\<\>\|\&\\]/.test(param);
	}

	/**
	 * 한글 특수문자 포함여부 (영문자, 숫자, -, _이외의 문자가 있는지 체크)
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static containKorSpeconstter(param: string): boolean {
		// noinspection RegExpRedundantEscape
		return /.*[ㄱ-ㅎ|ㅏ-ㅣ|가-힣+!@#$%^*+=()~`\{\}\[\]\;\:\'\"\,\.\/\?\<\>\|\&\\]/.test(param);
	}

	/**
	 * 아이디용 유효성 체크
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static containKorSpeconstterForId(param: string): boolean {
		// noinspection RegExpRedundantEscape
		return /.*[ㄱ-ㅎ|ㅏ-ㅣ|가-힣+!@#$%^*+=()~`\-\_\{\}\[\]\;\:\'\"\,\/\?\<\>\|\&\\]/.test(param);
	}

	/**
	 * 문자열에 공백이 있는지 검사
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	public static checkContainSpace(param: string): boolean {

		if (this.isEmpty(param)) {
			return true;
		}

		return param.match('\u0020') != null;
	}
}
