import {CommonResult} from './result-value';
import {Media} from './media';
import {Role} from './role';
import {Group} from './group';
import {Organization} from './organization';
import {Ia} from './ia';

export namespace Tagging {

	/**
	 * 태깅 타입
	 */
	export enum Type {
		// 메뉴
		LNB = <any>'LNB',
		// 상단 글로벌
		GNB = <any>'GNB',
		// 퀵컴
		QUICK = <any>'QUICK',
		// 리스트 유형
		LIST = <any>'LIST',
		// 상세 유형
		DETAIL = <any>'DETAIL',
		// 통합검색
		SEARCH = <any>'SEARCH'
	}

	/**
	 * 태깅 액션
	 */
	export enum Action {
		// 다운로드
		DN = <any>'DN',
		// 리스트 아이템
		ITEM = <any>'ITEM',
		// 버튼
		BTN = <any>'BTN',
		// 페이지 로드
		VIEW = <any>'VIEW'
	}

	export class Entity {
		module: string;
		system: string = 'IDCUBE';
		type: Type;
		action: Action;
		var: string;
	}

}
