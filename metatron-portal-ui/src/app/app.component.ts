import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from './portal/common/component/abstract.component';
import {TranslateService} from 'ng2-translate';
import {CookieService} from 'ng2-cookies';
import {CookieConstant} from './portal/common/constant/cookie-constant';
import {GlobalSearchService} from './portal/global-search/service/global-search.service';
import {MetaService} from './portal/meta/service/meta.service';
import {LoginService} from './portal/login/service/login.service';

@Component({
	selector: 'app-root',
	template: `
		<dialog-confirm></dialog-confirm>
		<loading></loading>
		<router-outlet></router-outlet>`
})
export class AppComponent extends AbstractComponent implements OnInit, OnDestroy {

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

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private translateService: TranslateService,
				private loginService: LoginService,
				private cookieService: CookieService,
				private searchGlobalService: GlobalSearchService,
				private metaService: MetaService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 언어 정보 초기 설정
		this.initializeTranslateLangSetting();

		// 검색어 쿠키 저장 플래그 초기 설정
		this.initializeCookieKeyWordSaveFlagSetting();

		// 검색어 자동완성 사용여부 플래그 값 초기 설정
		this.initializeCookieKeyWordAutoCompleteFlagSetting();

		// DW 페이지 사이즈
		this.metaService.initializeDwPageSizeSetting();

		// DW 페이지 사이즈 유효성 검증
		if (this.metaService.checkDwPageSizeValidation() === false) {
			this.metaService.initializeDwPageSize();
		}

		// 쿠기에 저장된 언어정보 로그
		this.logger.info(`browser's language ${this.cookieService.get(CookieConstant.KEY.LANGUAGE)}`);

		this.translateService.use(`${this.cookieService.get(CookieConstant.KEY.LANGUAGE)}`);
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 언어 정보 초기 설정
	 */
	private initializeTranslateLangSetting(): void {
		if (document.cookie.indexOf(CookieConstant.KEY.LANGUAGE) === -1) {
			this.setCookieLang('ko');
			this.translateService.use('ko');
		}
	}

	/**
	 * 검색어 쿠키 저장 플래그 초기 설정
	 */
	private initializeCookieKeyWordSaveFlagSetting(): void {
		if (this.searchGlobalService.hasKeyWordListSaveFlagValueInCookie() === false) {
			this.searchGlobalService.enableKeyWordListCookieSave();
		}
	}

	/**
	 * 검색어 자동완성 사용여부 플래그 값 초기 설정
	 */
	private initializeCookieKeyWordAutoCompleteFlagSetting(): void {
		if (this.searchGlobalService.hasKeyWordAutoCompleteUseFlagValueInCookie() === false) {
			this.searchGlobalService.enableKeyWordAutoCompleteCookieSave();
		}
	}

	/**
	 * 쿠키에 언어정보 추가
	 *
	 * @param {string} lang
	 */
	private setCookieLang(lang: string): void {
		this.cookieService.set(CookieConstant.KEY.LANGUAGE, lang, 9999, '/');
	}

}
