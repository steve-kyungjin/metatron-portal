import {Injectable, Injector} from '@angular/core';
import {ReportApp} from '../value/report-app.value';
import {AbstractService} from '../../common/service/abstract.service';
import {CommonResult, Page} from '../../common/value/result-value';

@Injectable()
export class ReportAppService extends AbstractService {

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

	constructor(protected injector: Injector) {
		super(injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 리포트 메인 데이터
	 */
	public getMain(category: string, page: Page): Promise<ReportApp.MainResult> {
		let url = `${this.environment.apiUrl}/report-apps/main?size=${page.size}&page=${page.number}&sort=${page.sort.property},${page.sort.direction}`;
		if (category) {
			return this.get(`${url}&categories=${category}`);
		} else {
			return this.get(url);
		}
	}

	/**
	 * 리포트 카테고리별 조회
	 */
	public getAppListByCategory(categoryId: string, keyword: string, page: Page): Promise<ReportApp.MainResult> {
		let url = `${this.environment.apiUrl}/report-apps?size=${page.size}&page=${page.number}`;

		if (categoryId) {
			url += `&categories=${categoryId}`;
		}
		if (keyword) {
			url += `&keyword=${encodeURIComponent(keyword)}`;
		}
		if (page.sort.property) {
			url += `&sort=${page.sort.property},${page.sort.direction}`;
		} else if (Array.isArray(page.sort)) {
			url += `&sort=${page.sort[0].property},${page.sort[0].direction}`;
		}
		return this.get(url);
	}

	/**
	 * 리포트 상세 조회
	 */
	public getDetail(appId: string): Promise<ReportApp.DetailResult> {
		return this.get(`${this.environment.apiUrl}/report-apps/${appId}/detail`);
	}

	/**
	 * 마이 앱 추가
	 */
	public addMyApp(appId: string): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/report-apps/my-app/${appId}`, null);
	}

	/**
	 * 마이 앱 삭제
	 */
	public deleteMyApp(appId: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/report-apps/my-app/${appId}`);
	}

	/**
	 * 리뷰 목록 조회
	 */
	public getReviews(appId: string, page: Page): Promise<ReportApp.ReviewListPageResult> {
		return this.get(`${this.environment.apiUrl}/report-apps/${appId}/reviews?size=${page.size}&page=${page.number}`);
		// return this.get(`${this.environment.apiUrl}/report-apps/${appId}/reviews`);
	}

	/**
	 * 리뷰 상세 조회
	 */
	public getReviewDetail(reviewId: string): Promise<ReportApp.ReviewResult> {
		return this.get(`${this.environment.apiUrl}/report-apps/reviews/${reviewId}`);
	}

	/**
	 * 리뷰 등록
	 */
	public createReview(appId: string, review: ReportApp.Review): Promise<ReportApp.ReviewDetailResult> {
		let params = {
			appId: appId,
			contents: review.contents
		};

		// 답변 등록
		if (review.parent) {
			params[ 'parent' ] = review.parent.id;
		}

		// 리뷰 등록
		return this.post(`${this.environment.apiUrl}/report-apps/reviews`, params);
	}

	/**
	 * 리뷰 수정
	 */
	public updateReview(review: ReportApp.Review): Promise<CommonResult> {
		let params = {
			id: review.id,
			contents: review.contents
		};

		// 리뷰 등록
		return this.put(`${this.environment.apiUrl}/report-apps/reviews`, params);
	}

	/**
	 * 리뷰 삭제
	 */
	public deleteReview(review: ReportApp.Review): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/report-apps/reviews/${review.id}`);
	}

	/**
	 * 첫 번째 이미지(thumbnail)
	 */
	public getFirstImage(app: ReportApp.Entity, isOrigin: boolean = false) {
		return `${this.environment.apiUrl}/media/${(app.mediaGroup && app.mediaGroup.medias && app.mediaGroup.medias.length > 0 ?
			app.mediaGroup.medias[ 0 ].id : null)}${(isOrigin ? '' : '/t')}`;
	}

	/**
	 * 카테고리 이름 목록 가져오기
	 */
	public getCategoryNames(app: ReportApp.Entity) {
		return app.categories
			.map(function (elem) {
				return elem.nmKr;
			}).join(', ');
	}

	/**
	 * 리포트 생성
	 */
	public createReportApp(formData: FormData): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/report-apps`, formData, this.ContentType.FORM_DATA);
	}

	/**
	 * 리포트 수정
	 */
	public updateReportApp(appId: string, formData: FormData): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/report-apps/${appId}`, formData, this.ContentType.FORM_DATA);
	}

	/**
	 * 리포트 삭제
	 */
	public deleteReportAppByAppId(appId: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/report-apps/${appId}`);
	}

	/**
	 * 리포트 실행 URL 조회
	 *
	 * @param {string} appId
	 * @returns {Promise<CommonResult>}
	 */
	public getAppUrl(appId: string): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/report-apps/my-app/${appId}`);
	}

	/**
	 * 리포트 목록 조회
	 */
	public getReportApps(categoryId: string, keyword: string = '', page: Page): Promise<CommonResult> {

		let url = `${this.environment.apiUrl}/report-apps?size=${page.size}&page=${page.number}`;

		if (categoryId) {
			url += `&categories=${categoryId}`;
		}
		if (keyword) {
			url += `&keyword=${encodeURIComponent(keyword)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		url += `&use=ALL&del=false`;

		return this.get(url);
	}

	/**
	 * 마이 앱 메인
	 */
	public getMyAppMain(keyword: string = '', page: Page): Promise<ReportApp.MyAppMainResult> {

		let url = `${this.environment.apiUrl}/report-apps/my-app/main?size=${page.size}&page=${page.number}`;

		if (keyword) {
			url += `&keyword=${encodeURIComponent(keyword)}`;
		}

		return this.get(url);
	}

	/**
	 * 마이 앱 목록 조회
	 */
	public getMyAppList(keyword: string = '', page: Page): Promise<ReportApp.MyAppResult> {

		let url = `${this.environment.apiUrl}/report-apps/my-app?size=${page.size}&page=${page.number}`;

		if (keyword) {
			url += `&keyword=${encodeURIComponent(keyword)}`;
		}

		return this.get(url);
	}

	/**
	 * 카테고리 목록 조회
	 * @returns {Promise<any>}
	 */
	public getCategoryList(): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/report-apps/categories`);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
