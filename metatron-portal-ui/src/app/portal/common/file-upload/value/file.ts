import {CommonResult} from '../../value/result-value';

export namespace File {

	/**
	 * File Entity
	 */
	export class Entity {
		// 아이디
		public id: string;
		// 파일 원본명
		public originalNm: string;
		// 파일 원본 확장자
		public originalExt: string;
		// 파일 사이즈
		public size: string;
		// 파일 정렬순서
		public dispOrder: string;
	}

	/**
	 * File Group Entity
	 */
	export class Group {
		// 아이디
		public id: string;
		// 파일 리스트
		public files: Array<Entity>;
	}

	export namespace Result {

		export class FileUpload extends CommonResult {
			data: {
				fileGroup: Group;
			}
		}
	}
}
