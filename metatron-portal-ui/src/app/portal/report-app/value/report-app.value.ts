import {FileItem} from 'ng2-file-upload/file-upload/file-item.class';
import {Abstract} from '../../common/value/abstract';
import {Code} from '../../common/value/code';
import {Role} from '../../common/value/role';
import {Media} from '../../common/value/media';
import {DataSource} from '../../management/shared/datasource/value/data-source';
import {CommonResult, Page} from '../../common/value/result-value';
import {User} from '../../common/value/user';

/**
 * 리포트
 */
export namespace ReportApp {

	/**
	 * 엔티티
	 */
	export class Entity extends Abstract.Entity {

		public id: string;
		public headerType: HeaderType;
		public urlHeader: UrlHeader;
		public metatronHeader: MetatronHeader;
		public extractHeader: ExtractHeader;
		public reviews: Array<Review>;
		public categories: Array<Code.Entity>;
		public roles: Array<Role>;
		public appNm: string;
		public summary: string;
		public contents: string;
		public ver: string;
		public verInfo: string;
		public useYn: boolean;
		public delYn: boolean;
		public externalYn: boolean;
		public mediaGroup: Media.Group;
		public usage: number;

		/////////////////////////////////////////////////////////////////
		// VIEW
		/////////////////////////////////////////////////////////////////

		public mediaGroupId: string = '';

		public files: FileItem[] = [];

		public delFileIds: string[] = [];

	}

	/**
	 * 헤더 타입
	 */
	export enum HeaderType {
		URL = <any>'URL',
		METATRON = <any>'METATRON',
		EXTRACT = <any>'EXTRACT'
	}

	/**
	 * Url 헤더
	 */
	export class UrlHeader extends Abstract.Entity {
		public id: string;
		public url: string;
		public navigation: string;
	}

	/**
	 * 메타트론 헤더
	 */
	export class MetatronHeader extends Abstract.Entity {
		public type: string;
		public contentsId: string;
		public contentsNm: string;
		public locationId: string;
	}

	/**
	 * 추출앱 헤더
	 */
	export class ExtractHeader extends Abstract.Entity {
		public sqlTxt: string;
		public id: string;
		public dataSource: DataSource.Entity;
	}

	/**
	 * Main
	 */
	export class Main {
		// 최신 앱
		public latestAppList: Entity[];
		// 사용자 추가 앱 탑3
		public addAppList: Entity[];
		// 사용자 실행 앱 탑3
		public execAppList: Entity[];
		// 분석 앱 목록
		public reportAppList: ListContent;
		// 카테고리 목록
		public categoryList: Code.Entity[];
	}

	/**
	 * Detail
	 */
	export class Detail {
		// 분석 앱
		public reportApp: Entity;
		// 마이 앱에 추가 가능한지 여부
		public acceptableApp: boolean;
		// 마이 앱에 추가된 앱인지 여부
		public isAddedMyApp: boolean;
		// 최신 앱
		public latestAppList: Entity[];
		// 사용자 추가 앱 탑3
		public addAppList: Entity[];
	}

	/**
	 * MyAppMain
	 */
	export class MyAppMain {
		// 마이 앱
		public myAppList: ListContent;
		// 최신 앱
		public latestAppList: Entity[];
		// 사용자 추가 앱 탑3
		public addAppList: Entity[];
	}

	/**
	 * ListContent
	 */
	export class ListContent extends Page {
		content: Entity[] = [];
	}

	/**
	 * MyAppList
	 */
	export class MyAppList {
		public myAppList: ListContent;
	}

	/**
	 * 페이지 결과
	 */
	export class PageResult extends CommonResult {
		public data: ListContent;
	}

	/**
	 * 결과
	 */
	export class Result extends CommonResult {
		public data: Entity;
	}

	/**
	 * 메인 결과
	 */
	export class MainResult extends CommonResult {
		public data: Main;
	}

	/**
	 * 상세 결과
	 */
	export class DetailResult extends CommonResult {
		public data: Detail;
	}

	/**
	 * 마이 앱 메인 결과
	 */
	export class MyAppMainResult extends CommonResult {
		public data: MyAppMain;
	}

	/**
	 * 마이 앱 결과
	 */
	export class MyAppResult extends CommonResult {
		public data: MyAppList;
	}

	//////////////////////////////////////////////////////////////
	// Review
	//////////////////////////////////////////////////////////////

	/**
	 * Review
	 */
	export class Review extends Abstract.Entity {

		// 아이디
		public id: string;
		// 유저 정보
		public user: User.Entity;
		// 내용
		public contents: string;
		// 상위
		public parent: Review;
		// 답변
		public children: Review[];

		public originContents: string;
		// 상태(등록/수정/조회)
		public isView: boolean = false;
		// 메뉴 오픈 상태(수정/삭제 팝업 메뉴)
		public openMenu: boolean = false;
		// 답변 숨김/보임 상태
		public showReply: boolean = false;
		// 내가 쓴 글인지 여부
		public isMine: boolean;

	}

	/**
	 * Review list
	 */
	export class ReviewList {
		public reviewList: ReviewListContent;
	}

	/**
	 * Review Detail
	 */
	export class ReviewDetail {
		public review: Review;
	}

	/**
	 * Review list content
	 */
	export class ReviewListContent extends Page {
		content: Review[] = [];
	}

	/**
	 * Review result
	 */
	export class ReviewResult extends CommonResult {
		public data: Review;
	}

	/**
	 * Review list page result
	 */
	export class ReviewListPageResult extends CommonResult {
		public data: ReviewList;
	}

	/**
	 * Review detail result
	 */
	export class ReviewDetailResult extends CommonResult {
		public data: ReviewDetail;
	}

	//////////////////////////////////////////////////////////////
	// View
	//////////////////////////////////////////////////////////////

	/**
	 * 분석 앱 생성 페이지에서 사용하는 라우트 파라미터
	 */
	export class CreateReportAppPageParameter {
		public type?: ReportApp.HeaderType;
		public id?: string;
	}

}
