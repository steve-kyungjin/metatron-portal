import {Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import {Observable} from 'rxjs/Observable';
import {PagePermission} from '../../../../common/value/page-permission';
import * as _ from 'lodash';
import {MenuSearchResult} from '../value/menu-search-result';
import {TranslateService} from "ng2-translate";

@Component({
	selector: '[menu-search-input]',
	templateUrl: './menu-search.component.html',
	host: {
		'[class.component-search]': 'true',
		'[class.type-auto]': 'true'
	}
})
export class MenuSearchComponent extends AbstractComponent implements OnInit, OnDestroy, OnChanges {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 현재 컴포넌트가 보이는 상태인지 확인할 수 있는 값
	 */
	@Input('expanded')
	private expanded: boolean | string = false;

	/**
	 * 확장메뉴 중 전체 메뉴가 있기때문에 메뉴 IA 코드를 리스트로 받을 수 있도록 처리
	 *
	 * @type {any[]}
	 * @private
	 */
	public _menuIaCode: string[] = [];

	/**
	 * 검색어
	 *
	 * @type {string}
	 */
	private searchText: string = '';

	/**
	 * 검색 결과 클릭시
	 *
	 * @type {EventEmitter<MenuSearchResult>}
	 */
	@Output('oClick')
	private outputClickEvent: EventEmitter<MenuSearchResult> = new EventEmitter<MenuSearchResult>();

	/**
	 * 검색 인풋
	 */
	@ViewChild('searchInput')
	private searchInput: ElementRef;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 텍스트 검색 결과
	 *
	 * @type {any[]}
	 */
	public textSearchResults: Array<PagePermission> = [];

	public search$: Subject<string> = new Subject<string>();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Getter & Setter
 	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	get menuIaCode(): string[] {
		return this._menuIaCode;
	}

	@Input('menuIaCode')
	set menuIaCode(value: string[]) {
		this._menuIaCode = value;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 검색어 입력
		this.subscriptions.push(
			this.search$
				.debounceTime(200)
				.switchMap((value) => Observable.of<string>(value))
				.subscribe((text) => {
					this.searchText = text;
					this.search();
				})
		);

	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.initialize();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 텍스트 검색 결과 클릭
	 *
	 * @param {PagePermission} pagePermission
	 */
	public textSearchResultClick(pagePermission: PagePermission): void {

		// 방출할 아웃풋 데이터
		const selectedMenuSearchResult = new MenuSearchResult();
		selectedMenuSearchResult.external = pagePermission.menu.external;
		selectedMenuSearchResult.link = pagePermission.menu.link;
		selectedMenuSearchResult.path = pagePermission.menu.path;
		selectedMenuSearchResult.name = pagePermission.menu.name;
		selectedMenuSearchResult.menuIaCodes = this.menuIaCode;
		this.outputClickEvent.emit(selectedMenuSearchResult);

		// 초기화
		this.initialize();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Protected Method
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private search(): void {

		if (this.textSearchLengthIsLess2Characters()) {
			this.textSearchResults = [];
			this.logger.debug(`[${this[ '__proto__' ].constructor.name}] 검색어 길이가 2글자가 아닌 경우, 검색 결과 초기화 처리`);
			return;
		}

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] 메뉴 검색 시작`);

		if (this.missingMenuIaCodeToSearch()) {
			this.textSearchResults = [];
			this.logger.debug(`[${this[ '__proto__' ].constructor.name}] 메뉴 IA 코드가 없는 경우, 검색 결과 초기화 처리`);
			return;
		}

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] 검색중인 메뉴 IA 코드`, this.menuIaCode);

		if (this.layoutService.pagePermissionList.length === 0) {
			this.logger.debug(`[${this[ '__proto__' ].constructor.name}] 퍼미션 목록 데이터가 없는 경우`);
			return;
		}

		// 텍스트 검색 결과 임시 저장할 변수
		const temporarySaveTextSearchResults: Array<PagePermission> = [];
		this.layoutService.pagePermissionAllList.forEach(pagePermission => {

			if (this.isParentMenu(pagePermission)) {

				if (this.menuIaCode.some(menuIaCode => menuIaCode === pagePermission.id)) {
					if (pagePermission.name.indexOf(this.searchText) !== -1) {
						temporarySaveTextSearchResults.push(pagePermission);
					}
				}
			} else {

				if (pagePermission.parent.parent === null) {
					if (this.menuIaCode.some(menuIaCode => menuIaCode === pagePermission.parent.id)) {
						if (pagePermission.name.indexOf(this.searchText) !== -1) {
							temporarySaveTextSearchResults.push(pagePermission);
						}
					}
				} else if (pagePermission.parent.parent.parent === null) {
					if (this.menuIaCode.some(menuIaCode => menuIaCode === pagePermission.parent.parent.id)) {
						if (pagePermission.name.indexOf(this.searchText) !== -1) {
							temporarySaveTextSearchResults.push(pagePermission);
						}
					}
				}

			}
		});

		this.textSearchResults = temporarySaveTextSearchResults;
		this.textSearchResults = _.uniqBy(this.textSearchResults, 'id');

		this.textSearchResults.forEach(result => {
			this.logger.debug(`[${this[ '__proto__' ].constructor.name}] 검색된 메뉴 이름`, result.name);
		});

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] 메뉴 검색 종료`);
	}

	/**
	 * 부모 메뉴인 경우
	 *  - Parent 값 이 NULL 인 경우 부모 메뉴
	 *
	 * @param pagePermission
	 * @returns {boolean}
	 */
	private isParentMenu(pagePermission): boolean {
		return pagePermission.parent === null;
	}

	/**
	 * 검색할 메뉴 IA 코드가 없는 경우
	 *
	 * @returns {boolean}
	 */
	private missingMenuIaCodeToSearch(): boolean {
		return this.menuIaCode.length === 0;
	}

	/**
	 * 검색어 길이가 2글자 미만
	 *
	 * @returns {boolean}
	 */
	private textSearchLengthIsLess2Characters() {
		return this.searchText.length < 2;
	}

	/**
	 * 초기화
	 */
	private initialize(): void {
		this.searchInput.nativeElement.value = '';
		this.searchText = '';
		this.textSearchResults = [];
	}

}
