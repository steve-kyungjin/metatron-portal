import {Injectable, Injector} from '@angular/core';
import {AnalysisApp} from '../value/analysis-app.value';
import {AbstractService} from '../../common/service/abstract.service';
import {CommonResult, Page} from '../../common/value/result-value';

@Injectable()
export class AnalysisAppService extends AbstractService {

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
	 * 분석 앱 메인 데이터
	 */
	public getMain(category: string, page: Page): Promise<AnalysisApp.MainResult> {
		let url = `${this.environment.apiUrl}/analysis-apps/main?size=${page.size}&page=${page.number}&sort=${page.sort.property},${page.sort.direction}`;
		if (category) {
			return this.get(`${url}&categories=${category}`);
		} else {
			return this.get(url);
		}
	}

	/**
	 * 분석 앱 카테고리별 조회
	 */
	public getAppListByCategory(categoryId: string, keyword: string, page: Page): Promise<AnalysisApp.MainResult> {
		let url = `${this.environment.apiUrl}/analysis-apps?size=${page.size}&page=${page.number}`;

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
	 * 분석 앱 상세 조회
	 */
	public getDetail(appId: string): Promise<AnalysisApp.DetailResult> {
		return this.get(`${this.environment.apiUrl}/analysis-apps/${appId}/detail`);
	}

	/**
	 * 마이 앱 추가
	 */
	public addMyApp(appId: string): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/analysis-apps/my-app/${appId}`, null);
	}

	/**
	 * 마이 앱 삭제
	 */
	public deleteMyApp(appId: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/analysis-apps/my-app/${appId}`);
	}

	/**
	 * 리뷰 목록 조회
	 */
	public getReviews(appId: string, page: Page): Promise<AnalysisApp.ReviewListPageResult> {
		return this.get(`${this.environment.apiUrl}/analysis-apps/${appId}/reviews?size=${page.size}&page=${page.number}`);
		// return this.get(`${this.environment.apiUrl}/analysis-apps/${appId}/reviews`);
	}

	/**
	 * 리뷰 상세 조회
	 */
	public getReviewDetail(reviewId: string): Promise<AnalysisApp.ReviewResult> {
		return this.get(`${this.environment.apiUrl}/analysis-apps/reviews/${reviewId}`);
	}

	/**
	 * 리뷰 등록
	 */
	public createReview(appId: string, review: AnalysisApp.Review): Promise<AnalysisApp.ReviewDetailResult> {
		let params = {
			appId: appId,
			contents: review.contents
		};

		// 답변 등록
		if (review.parent) {
			params[ 'parent' ] = review.parent.id;
		}

		// 리뷰 등록
		return this.post(`${this.environment.apiUrl}/analysis-apps/reviews`, params);
	}

	/**
	 * 리뷰 수정
	 */
	public updateReview(review: AnalysisApp.Review): Promise<CommonResult> {
		let params = {
			id: review.id,
			contents: review.contents
		};

		// 리뷰 등록
		return this.put(`${this.environment.apiUrl}/analysis-apps/reviews`, params);
	}

	/**
	 * 리뷰 삭제
	 */
	public deleteReview(review: AnalysisApp.Review): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/analysis-apps/reviews/${review.id}`);
	}

	/**
	 * 첫 번째 이미지(thumbnail)
	 */
	public getFirstImage(app: AnalysisApp.Entity, isOrigin: boolean = false) {
		return `${this.environment.apiUrl}/media/${(app.mediaGroup && app.mediaGroup.medias && app.mediaGroup.medias.length > 0 ?
			app.mediaGroup.medias[ 0 ].id : null)}${(isOrigin ? '' : '/t')}`;
	}

	/**
	 * 카테고리 이름 목록 가져오기
	 */
	public getCategoryNames(app: AnalysisApp.Entity) {
		return app.categories
			.map(function (elem) {
				return elem.nmKr;
			}).join(', ');
	}

	/**
	 * 분석 앱 생성
	 */
	public createAnalysisApp(formData: FormData): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/analysis-apps`, formData, this.ContentType.FORM_DATA);
	}

	/**
	 * 분석 앱 수정
	 */
	public updateAnalysisApp(appId: string, formData: FormData): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/analysis-apps/${appId}`, formData, this.ContentType.FORM_DATA);
	}

	/**
	 * 분석 앱 삭제
	 */
	public deleteAnalysisAppByAppId(appId: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/analysis-apps/${appId}`);
	}

	/**
	 * 분석 앱 실행 URL 조회
	 *
	 * @param {string} appId
	 * @returns {Promise<CommonResult>}
	 */
	public getAppUrl(appId: string): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/analysis-apps/my-app/${appId}`);
	}

	/**
	 * 분석 앱 목록 조회
	 */
	public getAnalysisApps(categoryId: string, keyword: string = '', page: Page): Promise<CommonResult> {

		let url = `${this.environment.apiUrl}/analysis-apps?size=${page.size}&page=${page.number}`;

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
	public getMyAppMain(keyword: string = '', page: Page): Promise<AnalysisApp.MyAppMainResult> {

		let url = `${this.environment.apiUrl}/analysis-apps/my-app/main?size=${page.size}&page=${page.number}`;

		if (keyword) {
			url += `&keyword=${encodeURIComponent(keyword)}`;
		}

		return this.get(url);
	}

	/**
	 * 마이 앱 목록 조회
	 */
	public getMyAppList(keyword: string = '', page: Page): Promise<AnalysisApp.MyAppResult> {

		let url = `${this.environment.apiUrl}/analysis-apps/my-app?size=${page.size}&page=${page.number}`;

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
		return this.get(`${this.environment.apiUrl}/analysis-apps/categories`);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
