import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import * as _ from 'lodash';
import {environment} from '../../../../../environments/environment';
import {MetatronService} from '../../../common/service/metatron.service';
import {LayoutService} from '../../service/layout.service';
import {Code} from '../../../common/value/code';
import {Menu} from '../value/menu';
import {TranslateService} from 'ng2-translate';
import {DialogService} from '../../../../common/component/dialog/dialog.service';
import {LnbService} from '../service/lnb.service';
import {Loading} from '../../../../common/util/loading-util';
import {MenuSearchResult} from '../menu-search/value/menu-search-result';
import {EnvironmentUtil} from '../../../../common/util/environment-util';
import {Utils} from "../../../../common/util/utils";
import EscapeUtil = Utils.EscapeUtil;

@Component({
	selector: 'lnb',
	templateUrl: './lnb.component.html'
})
export class LNBComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Private Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Protected Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Public Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 메타 관리 메뉴 보여줄지 여부 (임시)
	 */
	public isManagementMetaMenuShow: boolean = false;

	public menus: Array<Menu.Entity>;

	public bottomMenus: Array<Menu.Entity>;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Component
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Constructor
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param layoutService
	 * @param lnbService
	 * @param metatronService
	 * @param dialogService
	 * @param translateService
	 */
	constructor(public elementRef: ElementRef,
				protected injector: Injector,
				public layoutService: LayoutService,
				public lnbService: LnbService,
				private metatronService: MetatronService,
				private dialogService: DialogService,
				public translateService: TranslateService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Override Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		this.isManagementMetaMenuShow = !EnvironmentUtil.isProductionMode();
		this.menus = this.layoutService.menus.filter(value => {
			return value.display && !value.extraMenu;
		});
		this.bottomMenus = this.layoutService.menus.filter(value => {
			return value.extraMenu;
		});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=x
     | Public Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * showSubMenu
	 *
	 * @param menu
	 */
	public showSubMenu(menu: Menu.Entity): void {
		if (menu.children.length < 1 && menu.id != this.layoutService.iaCodes.managementIaCode) {
			return;
		}
		this.changeDisplayValue(menu.id, true);
	}

	/**
	 * hideSubMenu
	 *
	 * @param menu
	 */
	public hideSubMenu(menu: Menu.Entity): void {
		if (menu.children.length < 1 && menu.id != this.layoutService.iaCodes.managementIaCode) {
			return;
		}
		this.changeDisplayValue(menu.id, false);
	}

	/**
	 * hideSubMenu
	 *
	 * @param className
	 */
	public hideSubMenuByClassName(className: string): void {
		this.changeDisplayValue(className, false);
	}

	/**
	 *
	 *
	 * @param id
	 * @param link
	 * @param external
	 * @param path
	 * @param isAnalysisApp
	 */
	public goAnalysisAppPage(id: string, link: boolean, external: boolean, path: string, isAnalysisApp: boolean = true): void {
		this.goPage(id, link, external, path, false, isAnalysisApp);
	}

	/**
	 *
	 *
	 * @param id
	 * @param link
	 * @param external
	 * @param path
	 * @param isReportApp
	 */
	public goReportAppPage(id: string, link: boolean, external: boolean, path: string, isReportApp: boolean = true): void {
		this.goPage(id, link, external, path, isReportApp, false);
	}

	/**
	 * 페이지 이동
	 *
	 * @param id
	 * @param link
	 * @param external
	 * @param path
	 * @param isReportApp
	 * @param isAnalysisApp
	 */
	public goPage(id: string, link: boolean, external: boolean, path: string, isReportApp: boolean = false, isAnalysisApp: boolean = false): void {

		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > link`, link);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > external`, external);
		this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > path`, path);

		if (link === false) {
			return;
		}

		path = path.replace(environment.contextPath, '');

		this.hideSubMenuByClassName('menuFirstDepth');

		if (external && (isReportApp || isAnalysisApp)) {

			if (isReportApp) {
				window.open(`${path}`, id);
				return;
			}

			if (isAnalysisApp) {
				window.open(`${path}`, id);
				return;
			}

			window.open(`http://${window.location.hostname}:${window.location.port}${path}`, id);
			return;

		}

		if (path.startsWith('http', 0) || path.startsWith('https', 0)) {
			window.location.href = path;
			return;
		}

		if (path !== this.getFullPath()) {
			if (path.startsWith('/', 0)) {
				if (path !== this.getFullPath()) {
					Loading.show();
				}
			} else {
				if (path !== this.getFullPath().replace('/', '')) {
					Loading.show();
				}
			}
		}

		if (isReportApp === true) {
			this.router.navigate([ path ]);
			return;
		}

		if (path.indexOf(`=`) !== -1) {
			const url: string = _.cloneDeep(path);
			const eqMarkIndex: number = url.indexOf(`=`);
			const categoryId: string = path.substr(eqMarkIndex + 1, url.length);
			const questionMarkIndex: number = url.indexOf(`?`);
			this.router.navigate([ url.substring(0, questionMarkIndex) ], { queryParams: { category: categoryId } });
		} else {
			this.router.navigate([ path ]);
		}

	}

	private newWindowOpen(id: string, action: string) {
		// const formName = 'URL_APP_' + id;
		// let existForm = document.getElementsByName(id)[ 0 ];
		// if (existForm) {
		// 	$('form[name=' + formName + ']').remove();
		// }
		// const form = document.createElement('form');
		// form.setAttribute('name', formName);
		// form.setAttribute('method', 'post');
		// form.setAttribute('action', action);
		// form.setAttribute('target', id);
		// document.getElementsByTagName('body')[ 0 ].appendChild(form);
		// window.open('', id);
		// form.submit();
		window.open(action, id);
	}

	/**
	 * 메타트론 메뉴 클릭시
	 */
	public clickMetaTronMenu(): void {
		// 메타트론 홈 화면으로 이동
		this.metatronService.moveToMetatron(this.sessionInfo.getUser().metatronUrl + `/app/v2/index.html`);
	}

	/**
	 * 메타트론 메뉴 클릭시
	 */
	public clickMetaTronPrepMenu(): void {
		// 메타트론 홈 화면으로 이동
		// this.metatronService.moveToMetatron(`${environment.prepUrl}`);
		this.metatronService.moveToMetatron('http://prep.incross.metatron.app');
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 이미지 링크 만들기
	 */
	public getMediaPath(media: string) {
		return `${environment.apiUrl}/media/${media}/t`;
	}

	/**
	 * 확장메뉴 페이지 검색 결과 클릭시
	 *
	 * @param $event
	 * @constructor
	 */
	public clickSubMenuPageSearchResult($event: MenuSearchResult): void {
		if ($event.menuIaCodes[ 0 ] === 'IA004') {
			this.goPage($event.id, $event.link, $event.external, $event.path, true);
		} else {
			this.goPage($event.id, $event.link, $event.external, $event.path);
		}
	}

	/**
	 * 마이앱 목록 가져오기
	 *
	 * @param iaCode
	 */
	public getMyAppList(iaCode: string): Array<Menu.Children> {

		const myAppIndex: string =
			_.findKey(
				this.layoutService.getMenuByIaCode(
					this.layoutService.iaCodes.myAppSpaceIaCode).children,
				[
					'id',
					iaCode
				]
			);

		if (_.isUndefined(myAppIndex)) {
			return [];
		}

		return this.layoutService.getMenuByIaCode(this.layoutService.iaCodes.myAppSpaceIaCode).children[ myAppIndex ].children;
	}

	/**
	 * 리포트 메뉴 가져오기
	 */
	public getReportAppMenu(): Menu.Children {
		return this.getAppMenu(true, this.layoutService.iaCodes.appPlaceReportAppIaCode);
	}

	/**
	 * 분석 앱 메뉴 가져오기
	 */
	public getAnalysisAppMenu(): Menu.Children {
		return this.getAppMenu(true, this.layoutService.iaCodes.appPlaceAnalysisAppIaCode);
	}

	/**
	 * 인기 리포트 가져오기
	 */
	public getReportAppPopularList(): Array<Menu.Children> {
		const appList: Array<Menu.Children> = [];
		this.getAppList(true, this.layoutService.iaCodes.appPlaceReportAppIaCode)
			.forEach((app) => {
				if (app.appType == Menu.APP_TYPE.POPULAR) {
					appList.push(app);
				}
			});
		return appList;
	}

	/**
	 * 최신 리포트 가져오기
	 */
	public getReportAppLatestList(): Array<Menu.Children> {
		const appList: Array<Menu.Children> = [];
		this.getAppList(true, this.layoutService.iaCodes.appPlaceReportAppIaCode)
			.forEach((app) => {
				if (app.appType == Menu.APP_TYPE.LATEST) {
					appList.push(app);
				}
			});
		return appList;
	}

	/**
	 * 인기 분석 앱 가져오기
	 */
	public getAnalysisAppPopularList(): Array<Menu.Children> {
		const appList: Array<Menu.Children> = [];
		this.getAppList(false, this.layoutService.iaCodes.appPlaceAnalysisAppIaCode)
			.forEach((app) => {
				if (app.appType == Menu.APP_TYPE.POPULAR) {
					appList.push(app);
				}
			});
		return appList;
	}

	/**
	 * 최신 분석 앱 가져오기
	 */
	public getAnalysisAppLatestList(): Array<Menu.Children> {
		const appList: Array<Menu.Children> = [];
		this.getAppList(false, this.layoutService.iaCodes.appPlaceAnalysisAppIaCode)
			.forEach((app) => {
				if (app.appType == Menu.APP_TYPE.LATEST) {
					appList.push(app);
				}
			});
		return appList;
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 카테고리 목록 콤마로 연결
	 *
	 * @param extra
	 */
	public connectCategoryNameWithCommaInExtraList(extra: Code.Entity[]): string {
		return Menu.connectCategoryNameWithCommaInExtraList(extra);
	};

	/**
	 * Display flag true 인 목록만 가져오기
	 */
	public getMenuDisplayYList(iaCode: string): Array<Menu.Children> {

		const menu: Menu.Entity = this.layoutService.getMenuByIaCode(iaCode);
		const children: Array<Menu.Children> = [];

		if (menu === null) {
			return [];
		}

		menu.children
			.forEach(menu => {
				if (menu.display === true) {
					menu.children = menu.children
						.filter(children => {
							return children.display;
						});
					children.push(menu);
				}
			});

		return children;
	}

	/**
	 * enter 문자열 변경
	 * @param str
	 */
	public replaceEnterChar(str: string) {
		return EscapeUtil.lineBreakOrTabOrSpaceCharacter(str);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Private Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * changeDisplayValue
	 *
	 * @param {string} className
	 * @param {boolean} displayFlag
	 */
	private changeDisplayValue(className: string, displayFlag: boolean): void {

		if (this.jQuery(`.${className}`) === null) {
			return;
		}

		this.jQuery(`.${className}`).attr('aria-expanded', displayFlag.toString());
	}

	/**
	 * 앱 정보 가져오기
	 *
	 * @param isReportApp
	 * @param iaCode
	 */
	private getAppMenu(isReportApp: boolean, iaCode: string): Menu.Children {

		const appPlaceIaCode: string = this.layoutService.iaCodes.appPlaceIaCode;
		const appPlace: Menu.Entity = this.layoutService.getMenuByIaCode(appPlaceIaCode);

		if (appPlace === null) {
			return null;
		}

		const index: string =
			_.findKey(
				appPlace.children,
				[
					'id',
					iaCode
				]
			);

		if (_.isUndefined(index)) {
			return null;
		}

		return appPlace.children[ index ];
	}

	/**
	 * 앱 목록 가져오기
	 *
	 * @param isReportApp
	 * @param iaCode
	 */
	private getAppList(isReportApp: boolean, iaCode: string): Array<Menu.Children> {

		const appMenu: Menu.Children =
			isReportApp
				? this.getReportAppMenu()
				: this.getAnalysisAppMenu();

		return appMenu === null ? [] : appMenu.children;
	}

}
