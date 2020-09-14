import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '../../common/service/abstract.service';
import {CommonResult, Page} from '../../common/value/result-value';
import {ContentType} from '../../common/value/content-type';
import {Community} from '../value/community.value';
import {TranslateService} from "ng2-translate";

/**
 * Community 서비스
 */
@Injectable()
export class CommunityService extends AbstractService {

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

	constructor(protected injector: Injector,
				private translateService: TranslateService) {
		super(injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 랜딩 Summary 조회
	 * @param category
	 * @returns {Promise<any>}
	 */
	public getLandinSummary(): Promise<Community.LandingSummaryResult> {
		return this.get(`${this.environment.apiUrl}/communication/summary`);
	}

	/**
	 * 랜딩 포스트 목록 조회
	 * @param category
	 * @param slug
	 * @param page
	 * @param searchKey
	 * @param filter
	 * @returns {Promise<any>}
	 */
	public getLandingPostList(postType: Community.PostType, filterType: Community.FilterType, my: boolean, slug: string, page: Page, searchKey: string): Promise<Community.PostListResult> {
		let url = `${this.environment.apiUrl}/communication/all?postType=${postType}&filterType=${filterType}&my=${my}&size=${page.size}&page=${page.number}&keyword=${encodeURIComponent(searchKey)}`;

		if (slug != '') {
			url += `&slug=${slug}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property},${page.sort.direction}`;
		} else if (Array.isArray(page.sort)) {
			url += `&sort=${page.sort[0].property},${page.sort[0].direction}`;
		}

		return this.get(url);
	}

	/**
	 * Master 목록 조회
	 * @param type
	 * @returns {Promise<any>}
	 */
	public getMasterList(type: Community.PostType): Promise<Community.MasterListResult> {
		let url = `${this.environment.apiUrl}/communication/type`;
		if (type) {
			url += `?postType=${type}`;
		}

		return this.get(url);
	}

	/**
	 * Master 조회
	 * @param {string} slug
	 * @param {Page} page
	 * @returns {Promise<CommonResult>}
	 */
	public getMaster(slug: string): Promise<Community.PostListResult> {
		return this.get(`${this.environment.apiUrl}/communication/${slug}/master`);
	}

	/**
	 * post 권한 조회
	 * @param {string} slug
	 * @param {string} postId
	 * @returns {Promise<CommonResult>}
	 */
	public getPostAuth(slug: string, postId: string): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/communication/${slug}/${postId}/auth`);
	}

	/**
	 * 포스트 목록 조회
	 * @param {string} slug
	 * @param {Page} page
	 * @param searchKey
	 * @returns {Promise<CommonResult>}
	 */
	public getPostList(slug: string, page: Page, searchKey: string, searchStatus: Community.Status = Community.Status.NONE): Promise<Community.PostListResult> {
		let url = `${this.environment.apiUrl}/communication/${slug}?size=${page.size}&page=${page.number}&keyword=${encodeURIComponent(searchKey)}`;
		if (searchStatus != Community.Status.NONE) {
			url += `&status=${searchStatus}`;
		}
		return this.get(url);
	}

	/**
	 * 포스트 상세 조회
	 * @param {string} slug
	 * @param {string} postId
	 * @returns {Promise<Community.Post>}
	 */
	public getPostDetail(slug: string, postId: string): Promise<Community.PostResult> {
		return this.get(`${this.environment.apiUrl}/communication/${slug}/${postId}`);
	}

	/**
	 * 포스트 등록
	 * @param {string} slug
	 * @param {string} postId
	 * @returns {Promise<Community.Post>}
	 */
	public createPost(slug: string, post: Community.Post): Promise<Community.PostResult> {
		post.fileGroupId = post.fileGroup ? post.fileGroup.id : '';
		post.mediaGroupId = post.mediaGroup ? post.mediaGroup.id : '';
		post.attachGroupId = post.attachGroup ? post.attachGroup.id : '';

		return this.post(`${this.environment.apiUrl}/communication/${slug}`, post);
	}

	/**
	 * 포스트 수정
	 * @param {string} slug
	 * @param {string} postId
	 * @returns {Promise<Community.Post>}
	 */
	public updatePost(slug: string, post: Community.Post): Promise<CommonResult> {
		post.fileGroupId = post.fileGroup ? post.fileGroup.id : '';
		post.mediaGroupId = post.mediaGroup ? post.mediaGroup.id : '';
		post.attachGroupId = post.attachGroup ? post.attachGroup.id : '';

		return this.put(`${this.environment.apiUrl}/communication/${slug}/${post.id}`, post);
	}

	/**
	 * 포스트 삭제
	 * @param {string} slug
	 * @param {string} postId
	 * @returns {Promise<Community.Post>}
	 */
	public deletePost(slug: string, postId: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/communication/${slug}/${postId}`);
	}

	/**
	 * 임시 저장 조회
	 * @param {string} slug
	 * @returns {Promise<Community.Post>}
	 */
	public getDraft(slug: string): Promise<Community.PostDraftResult> {
		return this.get(`${this.environment.apiUrl}/communication/${slug}/draft`);
	}

	/**
	 * 임시 저장 삭제
	 * @param {string} slug
	 * @returns {Promise<Community.Post>}
	 */
	public deleteDraft(slug: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/communication/${slug}/draft`);
	}

	/**
	 * 이미지 업로드
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public uploadImage(file, mediaGroupId: string = null): Promise<CommonResult> {
		const formData = new FormData();
		formData.append('file', file.rawFile, file.name);
		if (mediaGroupId) {
			return this.post(`${this.environment.apiUrl}/communication/media/upload/${mediaGroupId}`, formData, ContentType.FORM_DATA);
		} else {
			return this.post(`${this.environment.apiUrl}/communication/media/upload`, formData, ContentType.FORM_DATA);
		}

	}

	/**
	 * 이미지 삭제
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public deleteImage(mediaGroupId: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/communication/media/upload/${mediaGroupId}`);
	}

	/**
	 * 담당자 / 처리자 수정
	 * @param {string} slug
	 * @param {string} post
	 * @returns {Promise<Community.Post>}
	 */
	public updateWorker(slug: string, post: Community.Post): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/communication/${slug}/${post.id}/worker`, post);
	}

	/**
	 * 댓글 목록 조회
	 * @param {string} slug
	 * @param {Page} page
	 * @returns {Promise<CommonResult>}
	 */
	public getCommentList(slug: string, postId: string): Promise<Community.CommentListResult> {
		return this.get(`${this.environment.apiUrl}/communication/${slug}/${postId}/replies`);
	}

	/**
	 * 댓글 등록
	 * @param {string} slug
	 * @param {string} postId
	 * @returns {Promise<Community.Post>}
	 */
	public createComment(slug: string, postId: string, comment: Community.Comment): Promise<CommonResult> {
		comment.fileGroupId = comment.fileGroup ? comment.fileGroup.id : '';
		comment.postId = postId;

		return this.post(`${this.environment.apiUrl}/communication/${slug}/${postId}/replies`, comment);
	}

	/**
	 * 댓글 수정
	 * @param {string} slug
	 * @param {string} postId
	 * @returns {Promise<Community.Post>}
	 */
	public updateComment(slug: string, postId: string, comment: Community.Comment): Promise<CommonResult> {
		comment.fileGroupId = comment.fileGroup ? comment.fileGroup.id : '';
		comment.postId = postId;

		return this.put(`${this.environment.apiUrl}/communication/${slug}/${postId}/replies/${comment.id}`, comment);
	}

	/**
	 * 댓글 삭제
	 * @param {string} slug
	 * @param {string} postId
	 * @returns {Promise<Community.Post>}
	 */
	public deleteComment(slug: string, postId: string, commentId: string, status: Community.Status = null): Promise<CommonResult> {
		let url = `${this.environment.apiUrl}/communication/${slug}/${postId}/replies/${commentId}`;
		if (status) {
			url += `?status=${status}`;
		}

		return this.delete(url);
	}

	/**
	 * 나의 포스트 목록 조회
	 * @returns {Promise<CommonResult>}
	 */
	public getMyPostList(): Promise<Community.MyPostListResult> {
		return this.get(`${this.environment.apiUrl}/communication/my/posts`);
	}

	/**
	 * 나의 댓글 목록 조회
	 * @returns {Promise<CommonResult>}
	 */
	public getMyCommentList(): Promise<Community.CommentListResult> {
		return this.get(`${this.environment.apiUrl}/communication/my/replies`);
	}

	/**
	 * 내 포스트의 댓글 목록 조회
	 * @returns {Promise<CommonResult>}
	 */
	public getMyPostCommentList(): Promise<Community.CommentListResult> {
		return this.get(`${this.environment.apiUrl}/communication/my/posts/replies`);
	}

	/**
	 * 공지알림 목록 조회
	 * @returns {Promise<CommonResult>}
	 */
	public getNoticeList(): Promise<Community.NoticeListResult> {
		return this.get(`${this.environment.apiUrl}/main/notices`);
	}

	/**
	 * 요청 등록 목록 조회
	 * @returns {Promise<CommonResult>}
	 */
	public getRequestedList(): Promise<Community.NoticeListResult> {
		return this.get(`${this.environment.apiUrl}/main/requested-not-process`);
	}

	/**
	 * 요청 처리중 목록 조회
	 * @returns {Promise<CommonResult>}
	 */
	public getProgressList(): Promise<Community.NoticeListResult> {
		return this.get(`${this.environment.apiUrl}/main/requested-process`);
	}

	/**
	 * 요청 완료 목록 조회
	 * @returns {Promise<CommonResult>}
	 */
	public getCompletedList(): Promise<Community.NoticeListResult> {
		return this.get(`${this.environment.apiUrl}/main/requested-completed`);
	}

	/**
	 * 신규 공지알림 체크
	 * @returns {Promise<CommonResult>}
	 */
	public getNewNotice(lastId: string): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/main/notices/check?id=${lastId}`);
	}

	/**
	 * 공지알림 건수 조회
	 * @returns {Promise<any>}
	 */
	public getNoticeCount(): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/main/badge`);
	}

	/**
	 * content to editor text
	 * @param content
	 * @returns {string}
	 */
	public contentToEditorText(content: string) {
		content = content.replace(/\n[\t\f\v ]*\n/g, '\n<br>\n');

		let list = content.split('\n');
		let newContent = '';
		Array.from(list).forEach(value => {
			newContent += '<p><span style="font-size: 14px;">' + value + '</span></p>';
		});

		return newContent;
	}

	/**
	 * post 상태에 따른 status class
	 * @param {Community.Post} item
	 * @returns {string}
	 */
	public getStatus(item: Community.Post) {
		let classes = 'txt-status';

		if (item.status == Community.Status.REQUESTED || item.status == Community.Status.REVIEW) {
			classes += ' type-a';
		} else if (item.status == Community.Status.CANCELED) {
			classes += ' type-b';
		} else if (item.status == Community.Status.PROGRESS) {
			classes += ' type-c';
		} else if (item.status == Community.Status.COMPLETED) {
			classes += ' type-d';
		} else if (item.status == Community.Status.CLOSED) {
			classes += ' type-e';
		}

		return classes;
	}

	/**
	 * 처리자 목록(string)
	 * @param item
	 * @returns {string}
	 */
	public getCoworkersText(item: Community.Post): string {
		let coworkers = [];
		Array.from(item.coworkers).forEach(v => {
			coworkers.push(v.userNm + (v.orgNm ? `(${v.orgNm})` : ''));
		});

		return item.coworkers.length ? coworkers.join(', ') : this.translateService.instant("COMMUNITY.UNSPECIFIED", "(미지정)");
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Protected Method
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
