import {Injectable, Injector} from '@angular/core';
import {AbstractMetatronService} from './abstract-metatron.service';
import {CookieConstant} from '../constant/cookie-constant';
import {TranslateService} from 'ng2-translate';
import {CommonResult} from '../value/result-value';
import * as $ from 'jquery';

@Injectable()
export class MetatronService extends AbstractMetatronService {

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
		super(injector, translateService);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Override Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Public Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 메타트론 페이지로 이동
	 *
	 * @param {string} metatronPageUrl
	 * @returns {null}
	 */
	public moveToMetatron(metatronPageUrl: string): void {

		// 메타트론 로그인이 되어 있는 경우
		if (this.checkMetatronLogin()) {
			this.openMetatron(metatronPageUrl);
		}

		// 메타트론 로그인이 되어 있지 않은 경우
		else {
			this.getMetatronToken()
				.then(() => this.openMetatron(metatronPageUrl));
		}
	}

	/**
	 * 워크스페이스 조회 ( 워크스페이스 Root 내 컨텐츠 목록 조회 )
	 */
	public getMetatronWorkspace(): Promise<CommonResult> {
		// noinspection TypeScriptValidateTypes
		return this.httpGet(`${this.environment.apiUrl}/metatron/workspace`);
	}

	/**
	 * 워크스페이스 폴더 조회 ( 폴더 내 컨텐츠 목록 조회 )
	 *
	 * @returns {Promise<any>}
	 */
	public getMetatronWorkspaceFolder(id: string): Promise<CommonResult> {
		// noinspection TypeScriptValidateTypes
		return this.httpGet(`${this.environment.apiUrl}/metatron/books/${id}`);
	}

	/**
	 * 워크북 상세 정보 조회
	 *
	 * @returns {Promise<any>}
	 */
	public getMetatronWorkbookDetail(id: string): Promise<CommonResult> {
		// noinspection TypeScriptValidateTypes
		return this.httpGet(`${this.environment.apiUrl}/metatron/workbook/${id}`);
	}

	/**
	 * 워크북 하위 대시보드 목록
	 *
	 * @returns {Promise<any>}
	 */
	public getMetatronWorkbookInDashboardList(id: string): Promise<CommonResult> {
		// noinspection TypeScriptValidateTypes
		return this.httpGet(`${this.environment.apiUrl}/metatron/workbooks/${id}/dashboards`);
	}

	/**
	 * 권한 있는 공유 워크스페이스 목록 조회
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public getPublicWorkspaceList(): Promise<CommonResult> {
		// noinspection TypeScriptValidateTypes
		return this.httpGet(`${this.environment.apiUrl}/metatron/my/public/workspaces`)
	}

	/**
	 * 아이디로 워크스페이스 조회 ( 워크스페이스 Root 내 컨텐츠 목록 조회 )
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public getWorkspaceById(workspaceId: string): Promise<CommonResult> {
		// noinspection TypeScriptValidateTypes
		return this.httpGet(`${this.environment.apiUrl}/metatron/workspace/${workspaceId}`);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Protected Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Private Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Metatron open
	 *
	 * @returns {}
	 */
	private openMetatron(returnUrl: string) {
		const target = 'metatron';
		const formName = 'metatronForm';
		const token = this.cookieService.get(CookieConstant.KEY.METATRON_TOKEN);
		const refreshToken = this.cookieService.get(CookieConstant.KEY.METATRON_REFRESH_TOKEN);
		const type = this.cookieService.get(CookieConstant.KEY.METATRON_TOKEN_TYPE);
		const userId = this.cookieService.get(CookieConstant.KEY.USER_ID);

		let existForm = document.getElementsByName(formName)[ 0 ];
		if (existForm) {
			$('form[name=' + formName + ']').remove();
		}
		let form = document.createElement('form');
		form.setAttribute('name', formName);
		form.setAttribute('method', 'post');
		form.setAttribute('action', this.sessionInfo.getUser().metatronUrl + `/api/sso?token=${token}&refreshToken=${refreshToken}&type=${type}&userId=${userId}&forwardUrl=${returnUrl}`);
		form.setAttribute('target', target);
		document.getElementsByTagName('body')[ 0 ].appendChild(form);

		window.open('', target);
		form.submit();
	}

}
