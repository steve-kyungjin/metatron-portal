import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../common/component/abstract.component';
import {GlobalSearchService} from '../../global-search/service/global-search.service';
import {Key} from '../../common/value/key';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Loading} from '../../../common/util/loading-util';
import {NoticeLayerMainComponent} from "../../layout/gnb/component/notice-layer/notice-layer-main.component";
import {TranslateService} from "ng2-translate";

$.fn[ 'selectRange' ] = function (start, end) {
	return this.each(function () {
		if (this.setSelectionRange) {
			this.focus();
			this.setSelectionRange(start, end);
		} else {
			if (this.createTextRange) {
				const range = this.createTextRange();
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select();
			}
		}
	});
};

class KeyboardEventInitImpl implements KeyboardEventInit {
	code?: string;
	key?: string;
	location?: number;
	repeat?: boolean;
}

class AutoComplete {
	keyWord: string;
	keyboardEvent: KeyboardEvent;
}

@Component({
	selector: 'intro',
	templateUrl: './intro.component.html'
})
export class IntroComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  	| Private Variables
  	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 검색 인풋
	 */
	@ViewChild('templateScopeSearchInput')
	private searchInput: ElementRef;

	/**
	 * autoComplete$
	 *
	 * @type {Subject<AutoComplete>}
	 */
	private autoComplete$: Subject<AutoComplete> = new Subject<AutoComplete>();

	/**
	 * 공지알림
	 */
	@ViewChild(NoticeLayerMainComponent)
	private noticeMain: NoticeLayerMainComponent;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 검색 인풋에 포커싱 여부
	 *
	 * @type {boolean}
	 */
	public isKeyWordInputFocus: boolean = false;

	/**
	 * 검색 인풋 마우스 오버 여부
	 *
	 * @type {boolean}
	 */
	public isKeyWordInputElementMouseOver: boolean = false;

	/**
	 * 검색어 자동완성 엘리먼트에 마우스 오버 여부
	 *
	 * @type {boolean}
	 */
	public isKeyWordAutoCompleteElementMouseOver: boolean = false;

	/**
	 *
	 *
	 * @type {number}
	 */
	public keyWordInputElementIndex = -1;

	/**
	 * 도움말 팝업 show/hide
	 */
	public showHelp: boolean;

	/**
	 * quick show/hide
	 * @type {boolean}
	 */
	public showQuick: boolean = true;

	/**
	 * user profile show/hide
	 * @type {boolean}
	 */
	public showUserProfile: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param {GlobalSearchService} globalSearchService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public globalSearchService: GlobalSearchService,
				public translateService: TranslateService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		super.ngOnInit();

		// 검색어 입력
		// this.subscriptions.push(
		// 	this.autoComplete$
		// 		.debounceTime(200)
		// 		.switchMap((value) => Observable.of<AutoComplete>(value))
		// 		.subscribe((value: AutoComplete) => {
		// 			this.keyWordInputElementMouseOver(-1);
		// 			this.keyWordInputElementIndex = -1;
		// 			this.isKeyWordInputFocus = false;
		// 			this.isKeyWordInputFocus = true;
		// 			document.getElementById('keyWordInputElement').focus();
		// 			this.globalSearchService.autoComplete(value.keyWord, value.keyboardEvent);
		// 		})
		// );

		const scope = this;
		document
			.getElementById('keyWordInputElement')
			.addEventListener('keydown', (event) => {

				if (this.searchInput.nativeElement.value.length === 0) {
					return;
				}

				if (scope.globalSearchService.keyWordList.length > 0
					|| (scope.globalSearchService.getKeyWordCookieSaveStatusFlagValue() === true && scope.globalSearchService.getKeyWordListInCookie().length > 0)) {

					const getArrowKeyDirection = (keyCode) => {
						return {
							27: 'esc',
							37: 'left',
							39: 'right',
							38: 'up',
							40: 'down'
						}[ keyCode ];
					};

					const isArrowKey = (keyCode) => !!getArrowKeyDirection(keyCode);

					let direction;
					const keyCode = event.keyCode;

					if (isArrowKey(keyCode)) {
						direction = getArrowKeyDirection(keyCode);

						if (direction === 'left' || direction === 'right') {
							return;
						}

						if (direction === 'esc') {
							this.keyWordInputElementIndex = -1;
							this.isKeyWordInputFocus = false;
							document.getElementById('keyWordInputElement')[ 'value' ] = this.globalSearchService.autoCompleteStartKeyWord;
							return;
						}

						if (direction === 'down') {

							document.getElementById('introH1Tag').focus();
							document.getElementById('keyWordInputElement').focus();

							if (scope.keyWordInputElementIndex !== -1) {
								if (scope.globalSearchService.keyWordList.length > 0 || (scope.globalSearchService.getKeyWordCookieSaveStatusFlagValue() === true && scope.globalSearchService.getKeyWordListInCookie().length > 0)) {
									if (document.getElementById('keyWordInputElement' + scope.keyWordInputElementIndex) !== null) {
										document.getElementById('keyWordInputElement' + scope.keyWordInputElementIndex).classList.remove('is-selected');
									}
								}
							}

							if (scope.keyWordInputElementIndex === scope.globalSearchService.keyWordList.length - 1 + scope.globalSearchService.getKeyWordListInCookie().length) {
								scope.keyWordInputElementIndex = 0;
							} else {
								scope.keyWordInputElementIndex++;
							}

							if (document.getElementById('keyWordInputElement' + scope.keyWordInputElementIndex) !== null) {
								document.getElementById('keyWordInputElement')[ 'value' ] = document.getElementById('keyWordInputElement' + scope.keyWordInputElementIndex)[ 'text' ];
								document.getElementById('keyWordInputElement' + scope.keyWordInputElementIndex).classList.add('is-selected');
							}
						}

						if (direction === 'up') {

							event.preventDefault();
							event.stopPropagation();

							if (scope.keyWordInputElementIndex !== -1) {
								if (scope.globalSearchService.keyWordList.length > 0 || (scope.globalSearchService.getKeyWordCookieSaveStatusFlagValue() === true && scope.globalSearchService.getKeyWordListInCookie().length > 0)) {
									if (document.getElementById('keyWordInputElement' + scope.keyWordInputElementIndex) !== null) {
										document.getElementById('keyWordInputElement' + scope.keyWordInputElementIndex).classList.remove('is-selected');
									}
								}
							}

							if (scope.keyWordInputElementIndex === 0 || scope.keyWordInputElementIndex === -1) {
								scope.keyWordInputElementIndex = scope.globalSearchService.keyWordList.length - 1 + scope.globalSearchService.getKeyWordListInCookie().length;
							} else {
								scope.keyWordInputElementIndex--;
							}

							if (document.getElementById('keyWordInputElement' + scope.keyWordInputElementIndex) !== null) {
								document.getElementById('keyWordInputElement')[ 'value' ] = document.getElementById('keyWordInputElement' + scope.keyWordInputElementIndex)[ 'text' ];
								document.getElementById('keyWordInputElement' + scope.keyWordInputElementIndex).classList.add('is-selected');
							}
						}
					}
				}
			});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 프로필 상세 팝업 닫기
	 */
	public profileDetailClose() {
		this.showUserProfile = false;
	}

	/**
	 * 검색어 자동 완성
	 *
	 * @param {string} keyWord
	 * @param keyboardEvent
	 */
	public keyWordAutoComplete(keyWord: string, keyboardEvent: KeyboardEvent): void {

		if (keyboardEvent.keyCode === Key.F1
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
			|| keyboardEvent.keyCode === Key.ScrollLock
			// ESC
			|| keyboardEvent.keyCode === Key.Escape
		) {
			return;
		}

		if (keyboardEvent.keyCode === Key.Enter) {
			this.executeGlobalSearch(keyWord);

			// 태깅
			this.tagging(this.TaggingType.SEARCH, this.TaggingAction.BTN, keyWord);
		} else {

			if (this.globalSearchService.getKeyWordAutoCompleteCookieSaveStatusFlagValue() === true) {

				this.isKeyWordInputFocus = true;

				const autoComplete = new AutoComplete();
				autoComplete.keyWord = keyWord;
				autoComplete.keyboardEvent = keyboardEvent;

				this.globalSearchService.autoCompleteStartKeyWord = keyWord;

				this.autoComplete$.next(autoComplete);
			}
		}
	}

	/**
	 * 검색 인풋 엘리먼트 블러 이벤트
	 */
	public blurKeyWordInputElement(): void {
		if (this.isKeyWordAutoCompleteElementMouseOver === false) {
			this.keyWordInputElementMouseOver(-1);
			this.isKeyWordInputFocus = false;
		}
	}

	/**
	 * 검색어 자동완성 엘리먼트 블러 이벤트
	 */
	public blurKeyWordAutoCompleteElement(): void {
		if (this.isKeyWordInputElementMouseOver === false) {
			this.isKeyWordInputFocus = false;
		}
	}

	/**
	 * 검색어 자동완성 클릭시 이벤트
	 *
	 * @param {string} keyWord
	 */
	public clickKeyWordAutoCompleteList(keyWord: string): void {
		this.executeGlobalSearch(keyWord);
	}

	/**
	 * 쿠키에 검색어 자동완성 사용여부 활성화 처리
	 */
	public enableKeyWordAutoCompleteCookieSave(): void {

		this.keyWordInputElementIndex = -1;
		document.getElementById('keyWordInputElement').focus();

		this.globalSearchService.enableKeyWordAutoCompleteCookieSave();

		const keyboardEventInitImpl: KeyboardEventInitImpl = new KeyboardEventInitImpl();
		keyboardEventInitImpl.key = this.searchInput.nativeElement.value;
		const keyboardEventInit: KeyboardEvent = new KeyboardEvent('keyup', keyboardEventInitImpl);

		this.keyWordAutoComplete(this.searchInput.nativeElement.value, keyboardEventInit);
	}

	/**
	 * 최근 검색어 저장 끄기
	 */
	public disableKeyWordListCookieSave() {
		this.keyWordInputElementIndex = -1;
		this.isKeyWordInputFocus = false;
		this.isKeyWordInputFocus = true;
		document.getElementById('keyWordInputElement').focus();
		this.globalSearchService.disableKeyWordListCookieSave();
	}

	/**
	 * 최근 검색어 저장 켜기
	 */
	public enableKeyWordListCookieSave() {
		this.keyWordInputElementIndex = -1;
		this.isKeyWordInputFocus = false;
		this.isKeyWordInputFocus = true;
		document.getElementById('keyWordInputElement').focus();
		this.globalSearchService.enableKeyWordListCookieSave();
	}

	/**
	 * 자동완성 끄기
	 */
	public disableKeyWordAutoCompleteCookieSave() {
		this.keyWordInputElementIndex = -1;
		document.getElementById('keyWordInputElement').focus();
		this.globalSearchService.disableKeyWordAutoCompleteCookieSave();
	}

	/**
	 * 최근 검색어 삭제
	 *
	 * @param index
	 */
	public removeKeyWordListInCookieByIndex(index) {
		this.keyWordInputElementIndex = -1;
		this.isKeyWordInputFocus = false;
		this.isKeyWordInputFocus = true;
		document.getElementById('keyWordInputElement').focus();
		this.globalSearchService.removeKeyWordListInCookieByIndex(index);
	}

	/**
	 * 검색어에 마우스 오버시
	 *
	 * @param {number} index
	 */
	public keyWordInputElementMouseOver(index: number) {

		if (this.keyWordInputElementIndex !== -1) {
			if (this.globalSearchService.keyWordList.length > 0 || (this.globalSearchService.getKeyWordCookieSaveStatusFlagValue() === true && this.globalSearchService.getKeyWordListInCookie().length > 0)) {
				if (document.getElementById('keyWordInputElement' + this.keyWordInputElementIndex) !== null) {
					document.getElementById('keyWordInputElement' + this.keyWordInputElementIndex).classList.remove('is-selected');
				}
			} else {
				this.keyWordInputElementIndex = -1;
			}
		}

		if (index !== -1) {
			this.keyWordInputElementIndex = index;
			document.getElementById('keyWordInputElement' + this.keyWordInputElementIndex).classList.add('is-selected');
		}
	}

	/**
	 * 검색
	 *
	 * @param {string} keyWord
	 */
	public executeGlobalSearch(keyWord: string): void {

		// noinspection RegExpRedundantEscape
		keyWord = keyWord.replace(/<.+?[^<]>/gi, '');
		keyWord = _.trim(keyWord);
		this.searchInput.nativeElement.value = keyWord;

		if (_.isUndefined(keyWord) || _.isEmpty(keyWord)) {
			return;
		}

		Loading.show();
		document.getElementById('focusOutTarget').focus();

		this.isKeyWordInputFocus = false;

		if (this.globalSearchService.getKeyWordCookieSaveStatusFlagValue()) {
			this.globalSearchService.addKeyWordToKeyWordListInsideCookie(keyWord);
		}

		this.globalSearchService.moveIntegratedSearchPage(keyWord);
	}

	/**
	 * 새글 등록
	 */
	public createPost() {
		this.noticeMain.getNoticeCount();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
