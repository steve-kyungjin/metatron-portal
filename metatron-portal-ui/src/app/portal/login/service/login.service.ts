import {Injectable, Injector} from "@angular/core";
import {AbstractService} from "../../common/service/abstract.service";
import {CommonResult} from "../../common/value/result-value";
import {MetatronService} from "../../common/service/metatron.service";
import {CookieConstant} from "../../common/constant/cookie-constant";
import {CommonConstant} from "../../common/constant/common-constant";
import {Auth, AuthResult, MetatronToken} from "../value/auth.value";
import {QuickService} from "../../layout/quick/service/quick.service";
import {Validate} from "../../../common/util/validate-util";
import {User} from "../../common/value/user";

/**
 * sha512.js
 */
declare var hex_sha512: any;

/**
 * 로그인 서비스
 */
@Injectable()
export class LoginService extends AbstractService {

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
				protected metatronService: MetatronService,
				private quickService: QuickService) {

		super(injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Check Login
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public checkLogin(): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/login/check`);
	}

	/**
	 * Login Tango
	 *
	 * @param {string} userId
	 * @param {string} password
	 * @returns {Promise<any>}
	 */
	public loginTango(userId: string, password: string): Promise<any> {

		const params: {
			systmId: string;
			userId: string;
			userPwd: any;
			userPwdEx: any
		} = {
			'systmId': this.environment.sso.tangoSysCode,
			'userId': userId,
			'userPwd': hex_sha512(password + userId),
			'userPwdEx': hex_sha512(password)
		};

		return this.postWithoutToken(`${this.environment.sso.tangoUrl}/tango-common-sso/sso/login`, params);
	}

	/**
	 * Tango verify
	 *
	 * @param {string} token
	 * @returns {Promise<any>}
	 */
	public verifyTango(token: string): Promise<any> {

		const params: {
			systmId: string;
			tokenId: string;
		} = {
			'systmId': this.environment.sso.tangoSysCode,
			'tokenId': token
		};

		return this.postWithoutToken(`${this.environment.sso.tangoUrl}/tango-common-sso/sso/token/verify`, params);
	}

	/**
	 * Login DT ( set tango )
	 *
	 * @param {UserEntity} user
	 * @param {string} endpoint
	 * @returns {Promise<AuthResult>}
	 */
	public loginDt(user: User.Entity): Promise<AuthResult> {
		return this.postWithoutToken(`${this.environment.apiUrl}/auth`, user);
	}

	/**
	 * DT login and metatron login
	 *
	 * @param {UserEntity} user
	 * @param {boolean} isTangoLogin
	 * @param {Function} callback
	 */
	public createSessionAndMetatronLogin(user: User.Entity, callback: Function): void {

		this.loginDt(user)
			.then((loginDtWithTangoResult: AuthResult) => {

				if (loginDtWithTangoResult.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					const authData: Auth = loginDtWithTangoResult.data;

					this.createTokenCookie(authData, user);

					const metatronToken: MetatronToken = authData.metatron;
					if (this.isMetatronTokenNotNull(metatronToken)) {
						this.createMetatronCookie(metatronToken);
					}

					if (this.isCallbackFunctionNotNull(callback)) {
						this.executeSuccessCallbackFunction(callback);
					}

					/**
					 * return url 이 intro 가 아닌 경우 return url 로 이동
					 * return url 이 intro 인 경우 시작 페이지로 등록한 페이지로 이동
					 */
					let returnUrlValueInCookie: string = this.cookieService.get(CookieConstant.KEY.RETURN_URL);
					if (returnUrlValueInCookie && returnUrlValueInCookie.indexOf('/view/user/login') < 0) {
						this.deleteReturnUrlValueFromCookie();
						// portal url
						const portalUrl = `${window.location.protocol}//${window.location.hostname}` + (window.location.port ? `:${window.location.port}` : '');
						// url 끝에 '/'로 끝날 경우 삭제
						returnUrlValueInCookie = returnUrlValueInCookie.lastIndexOf('/') == returnUrlValueInCookie.length - 1 ? returnUrlValueInCookie.substr(0, returnUrlValueInCookie.length - 1) : returnUrlValueInCookie;

						if (returnUrlValueInCookie != portalUrl && returnUrlValueInCookie != `${portalUrl}/view` && returnUrlValueInCookie != `${portalUrl}/view/intro`) {
							this.moveRouterToReturnUrl(returnUrlValueInCookie);
						} else {
							this.getStartPage();
						}
					} else {
						this.getStartPage();
					}
				} else {
					if (LoginService.isCallbackFnNotNull(callback)) {
						callback(CommonConstant.CODE.RESULT_CODE.FAIL);
					}
				}

			})
			.catch(error => {

				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > createSessionAndMetatronLogin() > error`, error);

				callback(CommonConstant.CODE.RESULT_CODE.FAIL);
			});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Protected Method
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Callback fn null check.
	 *
	 * @param {Function} callback
	 * @returns {boolean}
	 */
	private static isCallbackFnNotNull(callback: Function): boolean {
		return (callback === null) === false;
	}

	/**
	 * 메타트론 토근이 NULL 이 아닌 경우
	 *
	 * @param {MetatronToken} mtToken
	 * @returns {boolean}
	 */
	private isMetatronTokenNotNull(mtToken: MetatronToken): boolean {
		return mtToken != null;
	}

	/**
	 * 토큰 쿠기 생성
	 *
	 * @param {Auth} data
	 * @param {User.Entity} user
	 */
	private createTokenCookie(data: Auth, user: User.Entity): void {
		this.cookieService.set(CookieConstant.KEY.TOKEN, data.access_token, null, '/');
		this.cookieService.set(CookieConstant.KEY.USER_ID, user.userId, null, '/');
	}

	/**
	 * Metatron cookie 생성
	 *
	 * @param {MetatronToken} metatronToken
	 */
	private createMetatronCookie(metatronToken: MetatronToken): void {
		this.metatronService.setMetatronToken(metatronToken);
	}

	/**
	 * 최상위 경로로 라우트 이동
	 */
	private moveRouterToRootPath(): void {
		this.router.navigate([ '/' ]);
	}

	/**
	 * 쿠키에 있는 리턴 URL 로 라우트 이동
	 *
	 * @param {string} returnUrlValueInCookie
	 */
	private moveRouterToReturnUrl(returnUrlValueInCookie: string): void {
		// var reg = new RegExp('^((http(s?)):\\/\\/)?[^\\/]*' + this.environment.contextPath, 'g');
		// returnUrlValueInCookie = returnUrlValueInCookie.replace(reg, '');
		// this.router.navigate([ returnUrlValueInCookie ]);
		window.location.href = returnUrlValueInCookie;
	}

	/**
	 * 쿠키에 있는 리턴 URL 값 삭제처리
	 */
	private deleteReturnUrlValueFromCookie(): void {
		this.cookieService.delete(CookieConstant.KEY.RETURN_URL, '/');
	}

	/**
	 * 시작 페이지 조회
	 */
	private getStartPage(): void {
		this.quickService
			.getStartPage()
			.then(result => {
				if (result.data && !Validate.isEmpty(result.data.startPage)) {
					const startPage = result.data.startPage;
					this.router.navigate([ startPage ]);
				} else {
					this.moveRouterToRootPath();
				}
			});
	}

	/**
	 * 성공에 대한 콜백 함수 실행
	 *
	 * @param {Function} callback
	 */
	private executeSuccessCallbackFunction(callback: Function): void {
		callback(CommonConstant.CODE.RESULT_CODE.SUCCESS);
	}

	/**
	 * 콜백 함수가 NULL 이 아닌 경우
	 *
	 * @param {Function} callback
	 * @returns {boolean}
	 */
	private isCallbackFunctionNotNull(callback: Function): boolean {
		return callback != null;
	}

}
