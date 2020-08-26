import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../common/component/abstract.component';
import {environment} from '../../../../environments/environment';
import * as _ from 'lodash';
import {Loading} from '../../../common/util/loading-util';
import {IaService} from '../../common/service/ia.service';
import {CommonConstant} from '../../common/constant/common-constant';
import {Menu} from '../../layout/lnb/value/menu';
import {LayoutService} from '../../layout/service/layout.service';
import {DialogService} from '../../../common/component/dialog/dialog.service';
import {MenuSearchComponent} from '../../layout/lnb/menu-search/component/menu-search.component';
import {MenuSearchResult} from '../../layout/lnb/menu-search/value/menu-search-result';

@Component({
	selector: '[site-map]',
	templateUrl: './site-map.component.html',
	host: { '[class.page-sitemap]': 'true' }
})
export class SiteMapComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild(MenuSearchComponent)
	private menuSearchInputComponent: MenuSearchComponent;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param layoutService
	 * @param iaService
	 * @param dialogService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public layoutService: LayoutService,
				private iaService: IaService,
				private dialogService: DialogService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		Loading.show();

		this.iaService
			.getUserMenuOneDepthList()
			.then((result: Menu.Result.List) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					result.data.menu
						.forEach(menu => {
							this.menuSearchInputComponent._menuIaCode.push(menu.id);
						});
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

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

	/**
	 * 로컬 검색 결과 클릭시
	 *
	 * @param $event SelectedMenuSearchResult
	 * @constructor
	 */
	public clickLocalSearchResultItem($event: MenuSearchResult): void {
		this.goPage($event.id, $event.link, $event.external, $event.path, $event.menuIaCodes[ 0 ] === 'IA004');
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
	 * 리포트 메뉴 가져오기
	 */
	public getReportAppMenu() {

		let appMenu = this.getAppMenu(this.layoutService.iaCodes.appPlaceReportAppIaCode);

		if (appMenu !== null) {
			appMenu.children = _.uniqBy(appMenu.children, 'id');
		}

		return appMenu;
	}

	/**
	 * 분석 앱 메뉴 가져오기
	 */
	public getAnalysisAppMenu() {

		let appMenu = this.getAppMenu(this.layoutService.iaCodes.appPlaceAnalysisAppIaCode);

		if (appMenu !== null) {
			appMenu.children = _.uniqBy(appMenu.children, 'id');
		}

		return appMenu;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 앱 정보 가져오기
	 *
	 * @param iaCode
	 */
	private getAppMenu(iaCode: string) {

		const appPlaceIaCode: string = this.layoutService.iaCodes.appPlaceIaCode;
		let appPlace: Menu.Entity = this.layoutService.getMenuByIaCode(appPlaceIaCode);

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

}
