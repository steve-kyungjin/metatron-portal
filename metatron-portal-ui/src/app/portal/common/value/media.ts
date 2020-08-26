export namespace Media {

	/**
	 * Media Entity
	 */
	export class Entity {
		// 아이디
		public id: string;
		// 미디어 명
		public name: string;
		// 미디어 확장자
		public extension: string;
		// 미디어 타입
		public contentType: string;
		// 미디어 컨텐츠
		public contents: string;
	}

	/**
	 * Media Group Entity
	 */
	export class Group {
		// 아이디
		public id: string;
		// 미디어 리스트
		public medias: Array<Entity>;
	}
}
