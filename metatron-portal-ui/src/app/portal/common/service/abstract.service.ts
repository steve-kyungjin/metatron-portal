import {Injector} from '@angular/core';
import {Router} from '@angular/router';
import {Headers, Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {CookieService} from 'ng2-cookies';
import {NGXLogger} from 'ngx-logger';
import {CookieConstant} from '../constant/cookie-constant';
import {CommonConstant} from '../constant/common-constant';
import {EnvironmentUtil} from '../../../common/util/environment-util';
import {SessionInfo} from './session-info.service';
import {ContentType} from '../value/content-type';
import {environment} from '../../../../environments/environment';
import {Alert} from '../../../common/util/alert-util';
import {Loading} from '../../../common/util/loading-util';
import * as _ from 'lodash';

export abstract class AbstractService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Private Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Protected Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 기본 헤더
	protected DEFAULT_HEADER: { [ name: string ]: string } = {
		'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest'
	};

	// 환경 변수
	protected environment: any;

	// HTTP
	protected http: Http;

	// Router
	protected router: Router;

	// 어플리케이션 공용 값 저장소
	protected sessionInfo: SessionInfo;

	// Cookie 서비스
	protected cookieService: CookieService;

	// Logger
	protected logger: NGXLogger;

	// Content Type
	protected ContentType = ContentType;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Public Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Constructor
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 생성자
	protected constructor(protected injector: Injector) {

		this.router = injector.get(Router);
		this.http = injector.get(Http);
		this.sessionInfo = injector.get(SessionInfo);
		this.logger = injector.get(NGXLogger);
		this.environment = environment;
		this.cookieService = injector.get(CookieService);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Override Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Public Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Protected Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * GET 호출
	 *
	 * @param {string} url
	 * @param params
	 * @returns {any}
	 */
	protected get(url: string, params?: any): Promise<any> {

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > GET ${url}`);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > PARAMS`, params);

		const options: RequestOptions = this.getDefaultRequestOptions();

		if (params) {

			const searchParams: URLSearchParams = new URLSearchParams();

			for (const key in params) {

				if (params.hasOwnProperty(key)) {

					const value = params[ key ];

					if (Array.isArray(value)) {

						// 배열일 경우 처리
						value.forEach((item) => {
							searchParams.append(key, item);
						});
					} else {
						searchParams.set(key, params[ key ]);
					}

				}
			}

			options.search = searchParams;
		}

		let currentUrl = this.router.url;

		// 호출
		return this.http
			.get(url, options)
			.toPromise()
			.then(response => this.errorCheck(response, currentUrl))
			.catch((error) => this.errorHandler(error));
	}

	/**
	 * POST 호출
	 *
	 * @param {string} url
	 * @param data
	 * @param {ContentType} contentType
	 * @returns {Promise<any>}
	 */
	protected post(url: string, data: any, contentType: ContentType = ContentType.JSON): Promise<any> {

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > POST ${url}`);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > DATA`, data);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > ContentType`, contentType);

		if (contentType === ContentType.FORM_DATA) {
			return this.sendFormDataToPostMethod(url, data);
		} else {
			return this.sendJsonDataToPostMethod(url, data);
		}
	}

	/**
	 * POST 호출(token 없이)
	 *
	 * @param {string} url
	 * @param data
	 * @returns {any}
	 */
	protected postWithoutToken(url: string, data: any): Promise<any> {

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > POST ${url}`);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > DATA`, data);

		// 호출
		return this.http
			.post(url, JSON.stringify(data), this.getWithoutTokenRequestOptions())
			.toPromise()
			.then(response => this.errorCheck(response, null))
			.catch((error) => this.errorHandler(error));
	}

	/**
	 * PUT 호출
	 *
	 * @param {string} url
	 * @param data
	 * @returns {any}
	 */
	protected put(url: string, data: any): Promise<any> {

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > PUT ${url}`);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > DATA`, data);

		// 호출
		return this.http
			.put(url, JSON.stringify(data), this.getDefaultRequestOptions())
			.toPromise()
			.then(response => this.errorCheck(response, null))
			.catch((error) => this.errorHandler(error));
	}

	/**
	 * DELETE 호출
	 *
	 * @param {string} url
	 * @returns {any}
	 */
	protected delete(url: string, params?: any): Promise<any> {

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > DELETE ${url}`);

		const options = this.getDefaultRequestOptions();

		if (params) {

			const searchParams: URLSearchParams = new URLSearchParams();

			for (const key in params) {

				if (params.hasOwnProperty(key)) {

					const value = params[ key ];

					if (Array.isArray(value)) {

						// 배열일 경우 처리
						value.forEach((item) => {
							searchParams.append(key, item);
						});
					} else {
						searchParams.set(key, params[ key ]);
					}

				}
			}

			options.search = searchParams;
		}

		// 호출
		return this.http
			.delete(url, options)
			.toPromise()
			.then(response => this.errorCheck(response, null))
			.catch((error) => this.errorHandler(error));
	}

	public fileDownload(url: string, fileName: string): Promise<any> {
		return this.download(url, fileName, 'GET', null);
	}

	protected fileUploa(url: string, fileName: string, params: any): Promise<any> {
		return this.download(url, fileName, 'POST', params);
	}

	protected excelFileDownLoad(url: string, fileName: string, params?: any): Promise<any> {
		const date: Date = new Date();
		const timestamp: string = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString();
		return this.download(url, `${fileName}-${timestamp}.xlsx`, 'POST', params);
	}

	/**
	 * 에러 핸들러
	 *
	 * @param error
	 * @returns {Promise<never>}
	 */
	protected errorHandler(error: any) {

		this.logger.error(`[${this[ '__proto__' ].constructor.name}] > ERROR MESSAGE`, error);

		switch (error.status) {
			case 500: {
				if (this.isInIFrame()) {
					window.parent.location.href = `${environment.contextPath}/view/error/500`;
				} else {
					this.router.navigate([ 'view/error/500' ]);
				}

				Loading.hide();

				break;
			}
			case CommonConstant.CODE.INVALID_REQUEST: {

				this.logger.warn(`[${this[ '__proto__' ].constructor.name}] > INVALID_REQUEST`);

				Alert.warning(`서버 오류가 발생했습니다.`);

				Loading.hide();

				break;
			}
			case CommonConstant.CODE.UNAUTORIZED: {

				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > UNAUTORIZED`);

				Alert.warning(`인증에 실패했습니다.`);

				Loading.hide();

				this.navigateToSSO(window.location.href);

				break;
			}
			case 403: {
				if (this.isInIFrame()) {
					window.parent.location.href = `${environment.contextPath}/view/error/403`;
				} else {
					this.router.navigate([ 'view/error/403' ]);
				}

				Loading.hide();

				break;
			}
			default: {

				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > (SERVER_ERROR|INVALID_REQUEST|UNAUTORIZED|FORBIDDEN) ELSE ERROR`);

				Alert.error(`서버 오류가 발생했습니다.`);

				Loading.hide();

				if (this.isInIFrame()) {
					window.parent.location.href = `${environment.contextPath}/view/error/500`;
				} else {
					this.router.navigate([ 'view/error/500' ]);
				}

				break;
			}
		}

		return Promise.reject(error);
	}

	/**
	 * 에러 체크
	 *
	 * @param {Response} response
	 * @param {string} url
	 * @returns {any}
	 */
	protected errorCheck(response: Response, url: string) {

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > RESPONSE`, response.toString());
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > RESPONSE BODY\n`, response[ '_body' ]);

		if (response.status >= 400 && response.status <= 500) {
			if (response.status === CommonConstant.CODE.UNAUTORIZED) {
				this.navigateToSSO(null);
			}
		} else {
			return response.json();
		}

		// 에러 발생
		throw new Error(response.json().message);
	}

	/**
	 * 인증 페이지로 이동
	 *
	 * @param {string} returnUrl
	 * @returns {any}
	 */
	public navigateToSSO(returnUrl: string): void {

		this.logout();

		const self: this = this;

		if (returnUrl) {
			self.cookieService.set(CookieConstant.KEY.RETURN_URL, returnUrl, null, '/');
		} else {
			self.cookieService.set(CookieConstant.KEY.RETURN_URL, '/', null, '/');
		}

		if (this.isInIFrame()) {
			window.parent.location.href = `${environment.contextPath}/view/user/login`;
		} else {
			// noinspection JSIgnoredPromiseFromCall
			self.router.navigate([ '/view/user/login' ]);
		}
	}

	/**
	 * Logout
	 *
	 * @returns {Promise<any>}
	 */
	public logout() {
		this.cookieService.delete(CookieConstant.KEY.TOKEN, '/');
		this.cookieService.delete(CookieConstant.KEY.USER_ID, '/');
		this.cookieService.delete(CookieConstant.KEY.RETURN_URL, '/');
		this.cookieService.delete(CookieConstant.KEY.METATRON_TOKEN, '/');
		this.cookieService.delete(CookieConstant.KEY.METATRON_REFRESH_TOKEN, '/');
		this.cookieService.delete(CookieConstant.KEY.METATRON_TOKEN_TYPE, '/');
		this.cookieService.delete('LOGIN_TOKEN', '/');
		this.cookieService.delete('LOGIN_TOKEN_TYPE', '/');
		this.cookieService.delete('LOGIN_USER_ID', '/');
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Private Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 기본 옵션 정보 생성
	 *
	 * @returns {RequestOptions}
	 */
	protected getDefaultRequestOptions(): RequestOptions {

		const token = this.cookieService.get(CookieConstant.KEY.TOKEN);

		// 헤더
		const headers = new Headers(this.DEFAULT_HEADER);
		headers.set('Authorization', `Bearer ${token}`);

		// 옵션
		const options = new RequestOptions({ headers: headers, withCredentials: true });

		return options;
	}

	/**
	 * 기본 옵션 정보 생성(without token)
	 *
	 * @returns {RequestOptions}
	 */
	private getWithoutTokenRequestOptions(): RequestOptions {

		// 헤더
		const headers = new Headers(this.DEFAULT_HEADER);

		// 옵션
		const options = new RequestOptions({ headers: headers });

		return options;
	}

	/**
	 * 파일 다운로드
	 *
	 * @param {string} url
	 * @param {string} fileName
	 * @param {string} requestMethod
	 * @param params
	 * @returns {Promise<any>}
	 */
	private download(url: string, fileName: string, requestMethod: string, params?: any): Promise<any> {

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > DOWNLOAD GET ${url}`);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > DOWNLOAD FILENAME`, fileName);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > DOWNLOAD METHOD TYPE`, requestMethod);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > DOWNLOAD PARAMS`, params);

		if (requestMethod === 'GET' && params) {
			url += this.formatParams(params);
		}

		const promise = new Promise((resolve, reject) => {

			const xhttp = new XMLHttpRequest();

			xhttp.onload = () => {

				if (xhttp.status >= 200 && xhttp.status < 300) {

					// IE 인 경우 별도 처리, 그 외 다운로드 트릭 링크 설정.
					if (_.eq(window.navigator.msSaveBlob, undefined) === false) {
						window.navigator.msSaveBlob(xhttp.response, fileName);
					} else {
						const a = document.createElement('a');
						a.href = window.URL.createObjectURL(xhttp.response);
						a.download = fileName;
						a.style.display = 'none';
						document.body.appendChild(a);
						a.click();
						a.parentNode.removeChild(a);
					}

					resolve('success');
				} else {
					// this.status가 2xx와 다른 경우 함수 "reject" 수행
					reject('error');
				}
			};

			// 에러시
			xhttp.onerror = () => {
				reject('error');
			};

			xhttp.open(requestMethod, encodeURI(url));
			xhttp.setRequestHeader('Authorization', `Bearer ${this.cookieService.get(CookieConstant.KEY.TOKEN)}`);
			xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
			xhttp.responseType = 'blob';

			if (requestMethod === 'GET') {
				xhttp.send();
			} else {
				xhttp.send(JSON.stringify(params));
			}

		});

		return promise;
	}

	private formatParams(params): string {
		return '&' + Object
			.keys(params)
			.map((key) => `${key}=${encodeURIComponent(params[ key ])}`)
			.join('&');
	}

	/**
	 * JSON Data POST
	 *
	 * @param url
	 * @param data
	 * @returns {Promise<any>}
	 */
	private sendJsonDataToPostMethod(url, data): Promise<any> {
		return this.http
			.post(url, JSON.stringify(data), this.getDefaultRequestOptions())
			.toPromise()
			.then(response => this.errorCheck(response, null))
			.catch((error) => this.errorHandler(error));
	}

	/**
	 * FORM Data POST
	 *
	 * @param url
	 * @param data
	 * @returns {Promise<any>}
	 */
	private sendFormDataToPostMethod(url, data): Promise<any> {

		const getMultiPartFormDataHeader: () => RequestOptions = () => {

			const token = this.cookieService.get(CookieConstant.KEY.TOKEN);

			// 헤더
			const headers = new Headers();
			headers.set('Authorization', `Bearer ${token}`);
			headers.set('enctype', `multipart/form-data`);

			// 옵션
			const options = new RequestOptions({ headers: headers, withCredentials: true });

			return options;
		};

		// 호출
		return this.http
			.post(url, data, getMultiPartFormDataHeader())
			.toPromise()
			.then(response => this.errorCheck(response, null))
			.catch((error) => this.errorHandler(error));
	}

	/**
	 * iframe 안 인지 여부
	 * @returns {boolean}
	 */
	private isInIFrame() {
		const isInIframe = (window.location != window.parent.location);

		return isInIframe;
	}

}
