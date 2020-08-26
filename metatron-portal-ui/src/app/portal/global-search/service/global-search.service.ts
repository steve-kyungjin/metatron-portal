import {Injectable, Injector} from '@angular/core';
import {GlobalSearch} from '../value/global-search';
import {Validate} from '../../../common/util/validate-util';
import {CommonResult, Page} from '../../common/value/result-value';
import {AbstractService} from '../../common/service/abstract.service';
import {CommonConstant} from '../../common/constant/common-constant';
import {Key} from '../../common/value/key';
import {CookieConstant} from '../../common/constant/cookie-constant';
import * as _ from 'lodash';
import {Utils} from '../../../common/util/utils';

@Injectable()
export class GlobalSearchService extends AbstractService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  	| Private Variables
  	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 탭 클릭 여부 체크
	 */
	public isTabClick: boolean = false;

	/**
	 * 쿠키에 저장할 최근 검색어 최대 값
	 *
	 * @type {number}
	 */
	private maxCookieSaveSearchWordListLength: number = 3;

	/**
	 * 콤마
	 *
	 * @type {string}
	 */
	private COMMA: string = 'MiOiJodHRwOlwvXC9leG50dS5rcjoyMDA';

	/**
	 * 글로벌 검색 결과화면 라우트 URL
	 *
	 * @type {string}
	 * @private
	 */
	private _globalSearchResultPageRouteUrl: string = `view/search/all`;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 키워드 목록
	 *
	 * @type {any[]}
	 */
	public keyWordList: string[] = [];

	/**
	 * 검색 결과 카운트
	 *
	 * @type {number}
	 */
	public searchResultCount: number = 0;

	/**
	 * 검색어
	 *
	 * @type {string}
	 */
	public keyWord: string = '';

	/**
	 * 검색 타입
	 */
	public searchType: GlobalSearch.Type = GlobalSearch.Type.ALL;

	/**
	 * 통합 검색 결과 화면 탭 목록
	 *
	 * @type {any[]}
	 */
	public resultPageTabList: ({
		'label': string
		'index': number
	})[] = [];

	/**
	 *
	 *
	 * @type {string}
	 */
	public autoCompleteStartKeyWord: string = '';

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {Injector} injector
	 */
	constructor(protected injector: Injector) {
		super(injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 페이지 이동 관련
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 통합 검색 페이지 이동
	 *
	 * @param searchWord
	 * @param fragmentString
	 */
	public moveIntegratedSearchPage(searchWord: string, fragmentString: string = ''): void {

		if (Validate.isEmpty(searchWord) === false && Validate.isEmpty(fragmentString)) {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						this._globalSearchResultPageRouteUrl
					],
					{
						queryParams: {
							q: encodeURIComponent(searchWord),
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		} else if (Validate.isEmpty(searchWord) && Validate.isEmpty(fragmentString) === false) {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						this._globalSearchResultPageRouteUrl
					],
					{
						queryParams: {
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						},
						fragment: fragmentString
					}
				);
		} else if (Validate.isEmpty(searchWord) === false && Validate.isEmpty(fragmentString) === false) {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						this._globalSearchResultPageRouteUrl
					],
					{
						queryParams: {
							q: encodeURIComponent(searchWord),
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						},
						fragment: fragmentString
					}
				);
		} else {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						this._globalSearchResultPageRouteUrl
					],
					{
						queryParams: {
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		}
	}

	/**
	 * 통합 검색 디테일 페이지 이동
	 *
	 * @param searchWord
	 * @param type
	 */
	public moveIntegratedSearchDetailPage(searchWord: string, type: GlobalSearch.Type) {
		switch (type) {
			case GlobalSearch.Type.REPORT_APP : {
				this.moveIntegratedSearchReportAppDetailPage(searchWord);
				break;
			}
			case GlobalSearch.Type.ANALYSIS_APP : {
				this.moveIntegratedSearchAnalysisAppDetailPage(searchWord);
				break;
			}
			case GlobalSearch.Type.COMMUNICATION : {
				this.moveIntegratedSearchCommunicationDetailPage(searchWord);
				break;
			}
			case GlobalSearch.Type.META_TABLE : {
				this.moveIntegratedSearchMetaTableDetailPage(searchWord);
				break;
			}
			case GlobalSearch.Type.META_COLUMN : {
				this.moveIntegratedSearchMetaColumnDetailPage(searchWord);
				break;
			}
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// API
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 전체 검색 실행
	 *
	 * @param {string} keyWord
	 * @param {GlobalSearch.Type} type
	 * @param {Page} page
	 * @returns {Promise<GlobalSearch.Result.AllList | GlobalSearch.Result.AnalysisAppList | GlobalSearch.Result.ReportAppList>}
	 */
	public executeGlobalSearchByType(keyWord: string, type: GlobalSearch.Type, page: Page): Promise<GlobalSearch.Result.AllList | GlobalSearch.Result.AnalysisAppList | GlobalSearch.Result.ReportAppList> {
		if (type === GlobalSearch.Type.ALL) {
			return this.getList(keyWord);
		} else {
			return this.getListByType(keyWord, type, page);
		}
	}

	/**
	 * 목록 조회
	 *
	 * @param {string} keyWord
	 * @returns {Promise<CommonResult>}
	 */
	public getList(keyWord: string): Promise<GlobalSearch.Result.AllList> {
		return this.get(`${this.environment.apiUrl}/search/all?keyword=${encodeURIComponent(keyWord)}`);
	}

	/**
	 * 타입별 목록 조회
	 *
	 * @param {string} keyWord
	 * @param {GlobalSearch.Type} type
	 * @param {Page} page
	 * @returns {Promise<GlobalSearch.Result.AnalysisAppList | GlobalSearch.Result.ReportAppList>}
	 */
	public getListByType(keyWord: string, type: GlobalSearch.Type, page: Page): Promise<GlobalSearch.Result.AnalysisAppList | GlobalSearch.Result.ReportAppList> {

		let url = `${this.environment.apiUrl}/search/type?size=${page.size}&page=${page.number}`;

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		if (_.isUndefined(keyWord) === false && _.isEmpty(keyWord) === false) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (GlobalSearch.Type.ALL !== type) {
			url += `&type=${type}`;
		}

		return this.get(url);
	}

	/**
	 * 자동 완성 목록 조회
	 *
	 * @param {string} searchWord
	 * @returns {Promise<CommonResult>}
	 */
	public getSearchWordAutoCompleteList(searchWord: string): Promise<GlobalSearch.Result.AutoComplete> {
		return this.get(`${this.environment.apiUrl}/search/auto-complete?keyword=${encodeURIComponent(searchWord)}`);
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 검색 인풋 관련
	//	1. 검색어 자동 완성
	//	2. 최근 검색어 처리
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 1. 검색어 자동 완성
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 자동 완성
	 *
	 * @param {string} searchWord
	 * @param {KeyboardEvent} keyboardEvent
	 */
	public autoComplete(searchWord: string, keyboardEvent: KeyboardEvent): void {

		if (keyboardEvent.type !== 'keyup') {
			this.keyWordList = [];
			return;
		}

		// 검색시 건너뛸 키 코드 검사
		if (this.checkKeyCodeSkipWhenSearching(keyboardEvent)) {
			this.keyWordList = [];
			return;
		}

		if (_.isEmpty(searchWord)) {
			this.keyWordList = [];
			return;
		}

		this.getSearchWordAutoCompleteList(searchWord)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.keyWordList = result.data.autoComplete.keywordList;
				}else{
					this.keyWordList = [];
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 2. 최근 검색어 처리
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 쿠키에 검색어 목록 저장 활성화 처리
	 */
	public enableKeyWordListCookieSave(): void {
		this.saveWhetherSaveSearchTermsCookie(true);
	}

	/**
	 * 쿠키에 검색어 목록 저장 비활성화 처리
	 */
	public disableKeyWordListCookieSave(): void {
		this.saveWhetherSaveSearchTermsCookie(false);
		this.cookieService.delete(CookieConstant.KEY.SEARCH_WORD_LIST, '/');
	}

	/**
	 * 쿠키에 검색어 목록 저장 활성화 플래그 값이 있다면
	 *
	 * @returns {boolean}
	 */
	public hasKeyWordListSaveFlagValueInCookie(): boolean {
		return _.isUndefined(this.cookieService.get(CookieConstant.KEY.SEARCH_WORD_SAVE_FLAG)) === false && _.isEmpty(this.cookieService.get(CookieConstant.KEY.SEARCH_WORD_SAVE_FLAG)) === false;
	}

	/**
	 * 검색어 쿠키 저장 여부 플래그 가져오기
	 *
	 * @returns {boolean}
	 */
	public getKeyWordCookieSaveStatusFlagValue(): boolean {

		if (this.hasKeyWordListSaveFlagValueInCookie()) {
			const searchWordSaveFlag = this.cookieService.get(CookieConstant.KEY.SEARCH_WORD_SAVE_FLAG);
			if (/^(true|false)$/gi.test(searchWordSaveFlag)) {
				return JSON.parse(searchWordSaveFlag);
			} else {
				this.disableKeyWordListCookieSave();
				this.getKeyWordCookieSaveStatusFlagValue();
			}
		} else {
			this.disableKeyWordListCookieSave();
			this.getKeyWordCookieSaveStatusFlagValue();
		}
	}

	/**
	 * 검색어 목록 쿠키 저장
	 *
	 * @param {string[]} searchWordList
	 */
	public saveSearchWordListCookie(searchWordList: string[] = []): void {

		if (_.isEmpty(searchWordList)) {
			this.cookieService.set(CookieConstant.KEY.SEARCH_WORD_LIST, searchWordList.toString(), null, '/');
			return;
		}

		if (searchWordList.length === 0) {
			this.cookieService.set(CookieConstant.KEY.SEARCH_WORD_LIST, searchWordList.toString(), null, '/');
			return;
		}

		const list: string[] = [];
		_
			.slice(searchWordList, 0, this.maxCookieSaveSearchWordListLength)
			.map(searchWord => {
				if (_.isEmpty(searchWord) === false && _.isUndefined(searchWord) === false) {
					list.push(searchWord.replace(/,/g, this.COMMA));
				}
			});

		this.cookieService.set(CookieConstant.KEY.SEARCH_WORD_LIST, _.uniq(list).toString(), null, '/');
	}

	/**
	 * 쿠키안에 검색어 목록이 있다면
	 *
	 * @returns {boolean}
	 */
	public hasKeyWordListInCookie(): boolean {
		return _.isUndefined(this.cookieService.get(CookieConstant.KEY.SEARCH_WORD_LIST)) === false && _.isEmpty(this.cookieService.get(CookieConstant.KEY.SEARCH_WORD_LIST)) === false;
	}

	/**
	 * 쿠키안에 검색어 목록 가져오기
	 *
	 * @returns {string[]}
	 */
	public getKeyWordListInCookie(): string[] {

		if (this.hasKeyWordListInCookie() === false) {
			return [];
		}

		return _
			.slice(this.cookieService.get(CookieConstant.KEY.SEARCH_WORD_LIST).split(','), 0, this.maxCookieSaveSearchWordListLength)
			.map(searchWord => {
				return searchWord.replace(new RegExp(this.COMMA, 'g'), ',');
			});
	}

	/**
	 * 쿠키 내 검색어 목록에 검색어 추가
	 *
	 * @param {string} keyWord
	 */
	public addKeyWordToKeyWordListInsideCookie(keyWord: string): void {

		const replaceKeyWordCommaString = () => {
			return keyWord.replace(/,/g, this.COMMA);
		};

		if (this.hasKeyWordListInCookie()) {

			const keyWordLIstSplitStings = this.cookieService.get(CookieConstant.KEY.SEARCH_WORD_LIST).split(',');

			const list: string[] = [];
			_.forEach(keyWordLIstSplitStings,
				(data) => {
					data = data.replace(new RegExp(this.COMMA, 'g'), ',');
					if (data === keyWord) {
						list.push(data);
					}
				});

			if (list.length === 0) {

				// ',' 를 구분자로 사용해서 자르기
				let keyWordList = keyWordLIstSplitStings;

				// 검색어 목록 길이 체크 ( 쿠키에 저장 가능한 검색어 최대값은 '3' )
				if (keyWordList.length >= this.maxCookieSaveSearchWordListLength) {

					// 슬라이스 처리
					keyWordList = _.slice(keyWordList, 0, this.maxCookieSaveSearchWordListLength);

					// 검색어 목록의 마지막 삭제
					const removeIndex: number = keyWordList.length - 1;
					const remove = (element, eIndex) => eIndex != removeIndex;
					keyWordList = keyWordList.filter(remove);

					// 검색어 맨 앞에 추가
					keyWordList.unshift(replaceKeyWordCommaString.call(this));
				} else {

					// 검색어 맨 앞에 추가
					keyWordList.unshift(replaceKeyWordCommaString.call(this));
				}

				// 검색어 쿠키 목록 쿠키 덮어쓰기
				this.cookieService.set(CookieConstant.KEY.SEARCH_WORD_LIST, keyWordList.toString(), null, '/');
			}
		} else {
			this.cookieService.set(CookieConstant.KEY.SEARCH_WORD_LIST, replaceKeyWordCommaString.call(this), null, '/');
		}
	}

	/**
	 * 쿠키에 검색어 자동완성 사용여부 활성화 처리
	 */
	public enableKeyWordAutoCompleteCookieSave(): void {
		this.saveWhetherKeyWordAutoCompleteCookie(true);
	}

	/**
	 * 쿠키에 검색어 자동완성 사용여부 비활성화 처리
	 */
	public disableKeyWordAutoCompleteCookieSave(): void {
		this.saveWhetherKeyWordAutoCompleteCookie(false);
		this.keyWordList = [];
	}

	/**
	 * 쿠키에서 검색어 자동완성 사용여부 플래그 가져오기
	 *
	 * @returns {boolean}
	 */
	public getKeyWordAutoCompleteCookieSaveStatusFlagValue(): boolean {
		const searchWordAutoCompleteFlag = this.cookieService.get(CookieConstant.KEY.SEARCH_WORD_AUTO_COMPLETE_USE_FLAG);
		if (/^(true|false)$/gi.test(searchWordAutoCompleteFlag)) {
			return JSON.parse(searchWordAutoCompleteFlag);
		} else {
			return false;
		}
	}

	/**
	 * 쿠키에서 검색어 자동완성 사용여부 플래그 값이 있다면
	 *
	 * @returns {boolean}
	 */
	public hasKeyWordAutoCompleteUseFlagValueInCookie(): boolean {
		return _.isUndefined(this.cookieService.get(CookieConstant.KEY.SEARCH_WORD_AUTO_COMPLETE_USE_FLAG)) === false && _.isEmpty(this.cookieService.get(CookieConstant.KEY.SEARCH_WORD_AUTO_COMPLETE_USE_FLAG)) === false;
	}

	/**
	 * 인덱스를 이용해서 쿠키에 저장되어 있는 검색어 목록을 삭제처리
	 *
	 * @param {number} index
	 */
	public removeKeyWordListInCookieByIndex(index: number): void {

		// 검색어 목록의 마지막 삭제
		const removeIndex: number = index;
		const remove = (element, eIndex) => eIndex != removeIndex;
		const keyWordListInCookie = this.getKeyWordListInCookie().filter(remove);
		this.saveSearchWordListCookie(keyWordListInCookie);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Protected Method
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 페이지 이동 관련
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 리포트 상세 검색
	 *
	 * @param searchWord
	 */
	private moveIntegratedSearchReportAppDetailPage(searchWord: string): void {
		if (_.eq(searchWord, '') === false && _.isNull(searchWord) === false && _.isUndefined(searchWord) === false) {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/report-app`
					],
					{
						queryParams: {
							q: encodeURIComponent(searchWord),
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		} else {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/report-app`
					],
					{
						queryParams: {
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		}
	}

	/**
	 * 분석 앱 상세 검색
	 *
	 * @param searchWord
	 */
	private moveIntegratedSearchAnalysisAppDetailPage(searchWord: string): void {
		if (_.eq(searchWord, '') === false && _.isNull(searchWord) === false && _.isUndefined(searchWord) === false) {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/analysis-app`
					],
					{
						queryParams: {
							q: encodeURIComponent(searchWord),
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		} else {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/analysis-app`
					],
					{
						queryParams: {
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		}
	}

	/**
	 * 프로젝트 상세 검색
	 *
	 * @param searchWord
	 */
	private moveIntegratedSearchProjectDetailPage(searchWord: string): void {
		if (_.eq(searchWord, '') === false && _.isNull(searchWord) === false && _.isUndefined(searchWord) === false) {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/project`
					],
					{
						queryParams: {
							q: encodeURIComponent(searchWord),
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		} else {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/project`
					],
					{
						queryParams: {
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		}
	}

	/**
	 * 커뮤니케이션 상세 검색
	 *
	 * @param searchWord
	 */
	private moveIntegratedSearchCommunicationDetailPage(searchWord: string): void {
		if (_.eq(searchWord, '') === false && _.isNull(searchWord) === false && _.isUndefined(searchWord) === false) {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/communication`
					],
					{
						queryParams: {
							q: encodeURIComponent(searchWord),
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		} else {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/communication`
					],
					{
						queryParams: {
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		}
	}

	/**
	 * 데이터 웨어하우스 테이블 상세 검색
	 *
	 * @param searchWord
	 */
	private moveIntegratedSearchMetaTableDetailPage(searchWord: string): void {
		if (_.eq(searchWord, '') === false && _.isNull(searchWord) === false && _.isUndefined(searchWord) === false) {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/meta-table`
					],
					{
						queryParams: {
							q: encodeURIComponent(searchWord),
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		} else {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/meta-table`
					],
					{
						queryParams: {
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		}
	}

	/**
	 * 데이터 웨어하우스 컬럼 상세 검색
	 *
	 * @param searchWord
	 */
	private moveIntegratedSearchMetaColumnDetailPage(searchWord: string): void {
		if (_.eq(searchWord, '') === false && _.isNull(searchWord) === false && _.isUndefined(searchWord) === false) {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/meta-column`
					],
					{
						queryParams: {
							q: encodeURIComponent(searchWord),
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		} else {
			// noinspection JSUnusedLocalSymbols
			const router = this.router
				.navigate(
					[
						`${this._globalSearchResultPageRouteUrl}/meta-column`
					],
					{
						queryParams: {
							d: encodeURIComponent(Utils.DateUtil.createTimeStamp())
						}
					}
				);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 검색 인풋 관련
	//	1. 검색어 자동 완성
	//	2. 최근 검색어 처리
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 1. 검색어 자동 완성
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// noinspection JSMethodCanBeStatic
	/**
	 * 검색 시 건너뛸 키 코드 검사
	 *
	 * @param {KeyboardEvent} keyboardEvent
	 * @returns {boolean}
	 */
	private checkKeyCodeSkipWhenSearching(keyboardEvent: KeyboardEvent): boolean {
		// 펑션키
		return keyboardEvent.keyCode === Key.F1
			|| keyboardEvent.keyCode === Key.F2
			|| keyboardEvent.keyCode === Key.F3
			|| keyboardEvent.keyCode === Key.F4
			|| keyboardEvent.keyCode === Key.F5
			|| keyboardEvent.keyCode === Key.F6
			|| keyboardEvent.keyCode === Key.F7
			|| keyboardEvent.keyCode === Key.F8
			|| keyboardEvent.keyCode === Key.F9
			|| keyboardEvent.keyCode === Key.F10
			|| keyboardEvent.keyCode === Key.F11
			|| keyboardEvent.keyCode === Key.F12
			// 특수키
			|| keyboardEvent.keyCode === Key.Tab
			|| keyboardEvent.keyCode === Key.Shift
			|| keyboardEvent.keyCode === Key.Ctrl
			|| keyboardEvent.keyCode === Key.Alt
			|| keyboardEvent.keyCode === Key.PauseBreak
			|| keyboardEvent.keyCode === Key.CapsLock
			|| keyboardEvent.keyCode === Key.PageUp
			|| keyboardEvent.keyCode === Key.PageDown
			|| keyboardEvent.keyCode === Key.End
			|| keyboardEvent.keyCode === Key.Home
			// 방향키
			|| keyboardEvent.keyCode === Key.LeftArrow
			|| keyboardEvent.keyCode === Key.UpArrow
			|| keyboardEvent.keyCode === Key.RightArrow
			|| keyboardEvent.keyCode === Key.DownArrow
			// 특수키
			|| keyboardEvent.keyCode === Key.Insert
			|| keyboardEvent.keyCode === Key.LeftWindowKey
			|| keyboardEvent.keyCode === Key.RightWindowKey
			|| keyboardEvent.keyCode === Key.SelectKey
			|| keyboardEvent.keyCode === Key.NumLock
			|| keyboardEvent.keyCode === Key.ScrollLock;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 2. 최근 검색어 처리
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 검색어 저장여부 쿠키에 저장
	 *
	 * @param {boolean} isSave
	 */
	private saveWhetherSaveSearchTermsCookie(isSave: boolean): void {
		this.cookieService.set(CookieConstant.KEY.SEARCH_WORD_SAVE_FLAG, isSave.toString(), null, '/');
	}

	/**
	 * 검색어 자동완성 사용여부 쿠키에 저장
	 *
	 * @param {boolean} isUse
	 */
	private saveWhetherKeyWordAutoCompleteCookie(isUse: boolean): void {
		this.cookieService.set(CookieConstant.KEY.SEARCH_WORD_AUTO_COMPLETE_USE_FLAG, isUse.toString(), null, '/');
	}
}
