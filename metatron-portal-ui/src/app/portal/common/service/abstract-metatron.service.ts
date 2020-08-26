import {Injectable, Injector} from '@angular/core';
import {AbstractService} from './abstract.service';
import {Headers, RequestOptions} from '@angular/http';
import {CookieConstant} from '../constant/cookie-constant';
import {Validate} from '../../../common/util/validate-util';
import {CommonConstant} from '../constant/common-constant';
import {Alert} from '../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import {MetatronToken} from '../../login/value/auth.value';

/**
 * 메타트론 공통 서비스
 */
@Injectable()
export class AbstractMetatronService extends AbstractService {

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
				protected translateService: TranslateService) {
		super(injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Metatron login
	 *
	 * @returns {Promise<any>}
	 */
	public getMetatronToken(): Promise<any> {

		const userId: string = this.cookieService.get(CookieConstant.KEY.USER_ID);
		return this.post(`${this.environment.apiUrl}/sso/metatron/token?userId=${userId}`, null)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					const token = result.data;
					this.setMetatronToken(token);
				} else {
					const msg = this.translateService.instant('COMMON.MESSAGE.ERROR', '에러');
					Alert.error(msg);
					throw new Error(msg);
				}
			});
	}

	/**
	 * Set Metatron token
	 *
	 * @param {MetatronToken} token
	 */
	public setMetatronToken(token: MetatronToken): void {

		const METATRON_TOKEN: any = token.access_token;
		const METATRON_TOKEN_TYPE: any = token.token_type;
		const REFRESH_TOKEN: any = token.refresh_token;

		this.cookieService.set(CookieConstant.KEY.METATRON_TOKEN, METATRON_TOKEN, null, '/');
		this.cookieService.set(CookieConstant.KEY.METATRON_TOKEN_TYPE, METATRON_TOKEN_TYPE, null, '/');
		this.cookieService.set(CookieConstant.KEY.METATRON_REFRESH_TOKEN, REFRESH_TOKEN, null, '/');
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * GET 호출
	 *
	 * @param {string} url
	 * @param data
	 * @returns {Promise<any>}
	 */
	protected get(url: string, data: any): Promise<any> {

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > METATRON GET ${url}`);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > DATA`, data);

		// 호출
		return this.http
			.get(url, this.createDefaultHeader())
			.toPromise()
			.then(response => this.errorCheck(response, null))
			.catch(error => this.errorHandler(error));

	}

	/**
	 * POST 호출
	 *
	 * @param {string} url
	 * @param data
	 * @returns {Promise<any>}
	 */
	protected post(url: string, data: any): Promise<any> {

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > METATRON POST ${url}`);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > DATA`, data);

		// 호출
		return this.http
			.post(url, JSON.stringify(data), this.createDefaultHeader())
			.toPromise()
			.then(response => this.errorCheck(response, null))
			.catch(error => this.errorHandler(error));
	}

	/**
	 *
	 *
	 * @param {string} url
	 * @param data
	 * @returns {Promise<any> | Promise<any>}
	 */
	protected httpGet(url: string, data: any = null) {
		return this.callGetMethodIfMetatronIsLogin(url, data);
	}

	/**
	 *
	 *
	 * @param {string} url
	 * @param data
	 * @returns {Promise<any> | Promise<any>}
	 */
	protected httpPost(url: string, data: any = null) {
		return this.callPostMethodIfMetatronIsLogin(url, data);
	}

	/**
	 * 메타트론 로그인 체크
	 *
	 * @returns {boolean}
	 */
	protected checkMetatronLogin(): boolean {
		const token: string = this.cookieService.get(CookieConstant.KEY.METATRON_TOKEN);
		const type: string = this.cookieService.get(CookieConstant.KEY.METATRON_TOKEN_TYPE);
		const refreshToken: string = this.cookieService.get(CookieConstant.KEY.METATRON_REFRESH_TOKEN);
		return Validate.isEmpty(token) === false && Validate.isEmpty(type) === false && Validate.isEmpty(refreshToken) === false;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 메타트론 헤더 생성
	 *
	 * @returns {RequestOptions}
	 */
	private createDefaultHeader(): RequestOptions {

		const metatronToken = this.cookieService.get(CookieConstant.KEY.METATRON_TOKEN);

		// 헤더
		const headers = new Headers(this.DEFAULT_HEADER);
		headers.append('Authorization-Metatron', metatronToken);
		headers.append('Access-Control-Allow-Origin', '*');

		// 옵션
		const options = new RequestOptions({ headers: headers, withCredentials: true });

		return options;
	}

	/**
	 * GET 호출
	 *  - 메타트론 로그인이 되어 있는 경우 GET 메서드 호출
	 *
	 * @param {string} url
	 * @param data
	 * @returns {Promise<never | Response>}
	 */
	private callGetMethodIfMetatronIsLogin(url: string, data: any = null) {
		if (this.checkMetatronLogin()) {
			return this.get(url, data)
				.then(result => {

					if (result.code === CommonConstant.CODE.RESULT_CODE.FAIL) {
						return Promise.resolve()
							.then(() => this.getMetatronToken())
							.then(() => this.get(url, data))
							.catch((error) => this.errorHandler(error));
					}

					return new Promise(function (resolve) {
						resolve(result);
					});
				});
		} else {
			return Promise.resolve()
				.then(() => this.getMetatronToken())
				.then(() => this.get(url, data))
				.catch((error) => this.errorHandler(error));
		}
	}

	/**
	 * POST 호출
	 *    - 메타트론 로그인이 되어 있는 경우 POST 메서드 호출
	 *
	 * @param {string} url
	 * @param data
	 * @returns {Promise<never | Response>}
	 */
	private callPostMethodIfMetatronIsLogin(url: string, data: any) {
		if (this.checkMetatronLogin()) {
			return this.post(url, data)
				.then(result => {

					if (result.code === CommonConstant.CODE.RESULT_CODE.FAIL) {
						return Promise.resolve()
							.then(() => this.getMetatronToken())
							.then(() => this.get(url, data))
							.catch((error) => this.errorHandler(error));
					}

					return new Promise(function (resolve) {
						resolve(result);
					});
				});
		} else {
			return Promise.resolve()
				.then(() => this.getMetatronToken())
				.then(() => this.post(url, data))
				.catch((error) => this.errorHandler(error));
		}
	}

}
