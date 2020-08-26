import {CommonResult, Page} from '../../common/value/result-value';
import {Abstract} from '../../common/value/abstract';
import {Media} from '../../common/value/media';
import {User} from '../../common/value/user';
import {File} from '../../common/file-upload/value/file';

export namespace Community {
	/**
	 * POST 타입
	 */
	export enum PostType {
		GENERAL = <any>'GENERAL',
		WORKFLOW = <any>'WORKFLOW',
		NOTICE = <any>'NOTICE'
	}

	/**
	 * LIST 타입
	 */
	export enum ListType {
		BOTH = <any>'BOTH',
		LIST = <any>'LIST',
		CARD = <any>'CARD'
	}

	/**
	 * STATUS
	 */
	export enum Status {
		NONE = <any>'',
		// 요청등록
		REQUESTED = <any>'REQUESTED',
		// 요건검토
		REVIEW = <any>'REVIEW',
		// 요청취소
		CANCELED = <any>'CANCELED',
		// 요청처리중
		PROGRESS = <any>'PROGRESS',
		// 요청처리완료
		COMPLETED = <any>'COMPLETED',
		COMPLETED_CANCEL = <any>'COMPLETED_CANCEL',
		// 요청완료확인
		CLOSED = <any>'CLOSED',
		// 일반댓글
		COMMENT = <any>'COMMENT'
	}

	/**
	 * 요청 타입
	 */
	export enum RequestType {
		// 추출 요청
		NORMAL = <any>'NORMAL',
		// 검증 요청
		REVIEW = <any>'REVIEW'
	}

	export class Master {
		public id: string;

		public name: string;

		public slug: string;
		// GENERAL, WORKFLOW, NOTICE
		public postType: PostType;
		// BOTH, LIST, CARD
		public listType: ListType;
		// 댓글 가능 여부
		public replyYn: boolean;
		// url 앞 부분
		public prePath: string;
		// 게시글 템플릿
		public templates: Array<Template>;
		// 요청 타입
		public secondaryType: RequestType;
	}

	export class Template {
		public id: string;
		public name: string;
		public template: string;
	}

	export class Post extends Abstract.Entity {

		public id: string;
		// 제목
		public title: string;
		// 컨텐트 타입
		public contentType: string;
		// 내용
		public content: string;
		// 태그 제거된 내용
		public strippedContent: string;
		// 상태
		public status: Status;

		public bannerYn: boolean;

		public dispStartDate: string;

		public dispEndDate: string;
		// 임시저장 글 여부
		public draft: boolean;
		// 대표 이미지
		public mediaGroup: Media.Group;
		// 첨부파일
		public fileGroup: File.Group;
		// 본문 첨부파일
		public attachGroup: File.Group;
		// 댓글 개수
		public replyCnt: number;
		// 조회수
		public viewCnt: number;
		// 담당자
		public worker: User.Entity;
		// 처리자
		public coworkers: User.Entity[];

		public master: Master;

		// 처리 완료 타입
		public completeType: string;

		/////////////////////////////////////////////////////////////////
		// PARAM
		/////////////////////////////////////////////////////////////////

		// 첨부파일
		public fileGroupId: string;
		// 대표 이미지
		public mediaGroupId: string;
		// 본문 내 이미지
		public attachGroupId: string;
		// 담당자 변경
		public workerId: string;
		// 처리자 변경
		public coworkerIds: Array<Object>;
		// 작성자 변경
		public createdById: string;
		// 작성일자 변경
		public createdDateStr: string;
		// 이동할 게시판 slug
		public changedSlug: string;

		/////////////////////////////////////////////////////////////////
		// VIEW
		/////////////////////////////////////////////////////////////////

		public className: string;

		public imageUrl: string;
	}

	export class Comment extends Abstract.Entity {

		public id: string;

		public content: string;

		public fileGroup: File.Group;

		public status: Status = Status.COMMENT;

		// 종결 타입
		public completeType: string;

		public prePath: string;
		public slug: string;
		public postId: string;

		/////////////////////////////////////////////////////////////////
		// PARAM
		/////////////////////////////////////////////////////////////////

		public fileGroupId: string;

		/////////////////////////////////////////////////////////////////
		// VIEW
		/////////////////////////////////////////////////////////////////

		public originContent: string;
		// 상태(등록/수정/조회)
		public isView: boolean = false;
		// 내가 쓴 글인지 여부
		public isMine: boolean;
		// 메뉴 오픈 상태(수정/삭제 팝업 메뉴)
		public openMenu: boolean;
		// 저장 시 본문 유효성 체크
		public isError: boolean;
	}

	export class Summary {
		// 요청 등록
		public all: number = 0;
		// 미진행 요청
		public notProcess: number = 0;
		// 진행중 요청
		public process: number = 0;
		// 완료 요청
		public complete: number = 0;
		// Q&A 등록
		public qnaAll: number = 0;
		// 미 답변 Q&A
		public qnaNoAnswer: number = 0;
		// 답변 Q&A
		public qnaAnswer: number = 0;
		public guide: number = 0;
		public notice: number = 0;
	}

	/**
	 * 랜딩 필터 타입
	 */
	export enum FilterType {
		// 전체 보기, 내가 등록한 요청 글
		REQ_ALL = <any>'REQ_ALL',
		// 최근 3일간 요청 등록 전체
		REQ_LAST_3D = <any>'REQ_LAST_3D',
		// 내가 등록한 미 답변 요청글, 미 답변 요청 전체
		REQ_NOT_PROC = <any>'REQ_NOT_PROC',
		// 내가 등록한 미완료 요청글, 미 완료 요청 전체
		REQ_INCOMPL = <any>'REQ_INCOMPL',
		// 내가 등록한 처리완료 요청, 처리완료 요청 전체
		REQ_COMPL = <any>'REQ_COMPL',
		// 검토 진행중 요청 전체
		REQ_REVIEW = <any>'REQ_REVIEW',
		// 개발 진행중 요청 전체
		REQ_PROG_NOR = <any>'REQ_PROG_NOR',
		// 검증 진행중 요청 전체
		REQ_PROG_REV = <any>'REQ_PROG_REV',
		// 담당자 미지정 요청 전체
		REQ_NO_WOR = <any>'REQ_NO_WOR',
		// 처리자 미지정 요청 전체
		REQ_NO_COWOR = <any>'REQ_NO_COWOR',
		// 내가 담당자인 요청
		REQ_WOR = <any>'REQ_WOR',
		// 내가 처리자인 요청
		REQ_COWOR = <any>'REQ_COWOR',


		// 전체 보기
		GUD_ALL = <any>'GUD_ALL',
		// 최근 일주일간 등록된 Tip/가이드
		GUD_LAST_7D = <any>'GUD_LAST_7D',
		// 최근 3일 이내 등록된 글
		GUD_LAST_3D = <any>'GUD_LAST_3D',
		// 가이드&팁 전체
		GUD_TIP = <any>'GUD_TIP',


		// 전체 보기
		QNA_ALL = <any>'QNA_ALL',
		// 미 답변 Q&A 전체, 미 답변 Q&A
		QNA_NO_ANS = <any>'QNA_NO_ANS',
		// 답변 Q&A
		QNA_ANS = <any>'QNA_ANS'
	}

	export class LandingSummary {
		public allCount: Summary;
		public myCount: Summary;
		public noticeCount: Summary;
	}

	export class LandingSummaryResult extends CommonResult {
		public data: LandingSummary;
	}

	export class MasterList {
		public masterList: Master[];
	}

	export class MasterListResult extends CommonResult {
		public data: MasterList;
	}

	export class PostList {
		public postList: PostContent;
		public master: Master;
	}

	export class PostContent extends Page {
		public content: Post[];
	}

	export class PostListResult extends CommonResult {
		public data: PostList;
	}

	export class MyPostList {
		public postList: Post[];
	}

	export class MyPostListResult extends CommonResult {
		public data: MyPostList;
	}

	export class PostDetail {
		public post: Post;
	}

	export class PostResult extends CommonResult {
		public data: PostDetail;
	}

	export class PostDraft {
		public draft: Post;
	}

	export class PostDraftResult extends CommonResult {
		public data: PostDraft;
	}

	export class CommentList {
		public postReplyList: Comment[];
	}

	export class CommentListResult extends CommonResult {
		public data: CommentList;
	}

	export class NoticeList {
		public noticeList: Post[];
		public notProcessList: Post[];
		public processList: Post[];
		public completedList: Post[];
	}

	export class NoticeListResult extends CommonResult {
		public data: NoticeList;
	}
}
