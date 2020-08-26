import {CommonResult} from './result-value';

export namespace Code {

	/**
	 * 코드
	 */
	export class Entity {

		/**
		 * 코드 아이디
		 */
		public id: string;

		/**
		 * 코드
		 */
		public cd: string;

		/**
		 * 코드명 - 한글
		 */
		public nmKr: string;

		/**
		 * 코드명 - 영어
		 */
		public nmEn: string;

		/**
		 * 코드 설명
		 */
		public cdDesc: string;

		/**
		 * 화면 노출 순서
		 */
		public cdOrder: number;

		/**
		 * 그룹 코드
		 */
		public groupCd: string;

		/**
		 * Extra
		 */
		public extra: any;

		//////////////////////////////////////////////////////////////
		// VIEW
		//////////////////////////////////////////////////////////////

		/**
		 * 설정 언어에 따라 코드명 리턴
		 *
		 * @returns {string}
		 */
		public getNmByLanguage(): string {

			const lang: string = 'ko';

			if (lang === 'ko') {
				return this.nmKr;
			} else {
				return this.nmEn;
			}
		}

		public isChecked: boolean = false;
		public isCdValidationFail: boolean;
		public isNmKrValidationFail: boolean;
		public isNmEnValidationFail: boolean;
		public isCdDescValidationFail: boolean;
	}

	export namespace Result {

		/**
		 * HTTP request return type
		 */
		export class Code extends CommonResult {
			data: Entity;
		}

		/**
		 * HTTP request return type
		 */
		export class List extends CommonResult {
			data: {
				codeList: Entity[];
			};
		}

		/**
		 * HTTP request return type
		 */
		export class ListByKey extends CommonResult {
			data: { [ id: string ]: Entity[] }[];
		}

	}
}
