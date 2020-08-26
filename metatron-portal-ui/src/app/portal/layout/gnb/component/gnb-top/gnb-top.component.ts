import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {PagePermission} from '../../../../common/value/page-permission';
import {Indicator} from '../../value/indicator';
import {TranslateService} from 'ng2-translate';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {NavigationEnd} from '@angular/router';
import * as _ from 'lodash';
import {LnbService} from '../../../lnb/service/lnb.service';

@Component({
	selector: '[gnb-top]',
	templateUrl: './gnb-top.component.html',
	host: { '[class.layout-top]': 'true' }
})
export class GnbTopComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Private Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 페이지 새로고침 여부 체크하기 위한 플래그
	 *
	 * @type {boolean}
	 */
	private isPageRefreshCheck: boolean = false;

	/**
	 * 인덱스
	 */
	private index: number = 0;

	/**
	 * pagePermission
	 */
	private pagePermission: PagePermission;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Protected Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Public Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Gnb Indicator
	 */
	public gnbIndicator: Indicator = new Indicator('', '', []);

	/**
	 * 앱 실행화면에서만 보여줄 아이콘 플래그
	 */
	public showNewWindowIcon: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Constructor
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param translateService
	 * @param lnbService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private lnbService: LnbService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Override Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.subscriptions.push(
			this.gnbService
				.indicator$
				.subscribe((indicator: Indicator) => {

					if (typeof indicator === 'undefined') {
						return;
					}

					if (typeof indicator.title === 'undefined' || indicator.title === null) {
						indicator.title = '';
					}

					if (typeof indicator.description === 'undefined' || indicator.description === null) {
						indicator.description = '';
					}

					if (typeof indicator.navigations === 'undefined' || indicator.navigations === null) {
						indicator.navigations = [];
					}

					this.gnbIndicator = indicator;
				})
		);

		this.subscriptions.push(
			this.router
				.events
				.subscribe((e) => {
					if (e instanceof NavigationEnd) {
						this.isPageRefreshCheck = true;
						this.changeRouterNavigationEvent(this.getFullPath());
					}
				})
		);

		this.subscriptions.push(
			this.gnbService
				.changeIndicator$
				.subscribe((indicator: Indicator) => {
					this.gnbIndicator.title = indicator.title;
					this.gnbIndicator.description = indicator.description;
				})
		);

		this.subscriptions.push(
			this.gnbService
				.showNewWindowIcon$
				.subscribe((iconFlag) => {
					this.showNewWindowIcon = iconFlag;
				})
		);

		if (this.isPageRefreshCheck === false) {
			this.changeRouterNavigationEvent(this.getFullPath());
		}
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Public Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public openNewWindow() {
		this.gnbService.openNewWindow.next();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Protected Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Private Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private changeRouterNavigationEvent(url: string): void {
		// parameter 가져오기
		this.subscriptions.push(
			this.activatedRoute.queryParams
				.subscribe(params => {
					const category = params[ 'category' ];
					if (category !== undefined) {
						const QUESTION_MARK_INDEX: number = url.indexOf(`?`);
						const splitUrl: string = url.substring(0, QUESTION_MARK_INDEX);
						if (splitUrl === `/view/analysis-app`) {
							url = splitUrl;
						}
						if (splitUrl === `/view/report-app`) {
							url = splitUrl;
						}
					}
				})
		);

		this.index = url.split(`/`).length;
		this.getPermission(url);

		if (_.isUndefined(this.pagePermission) === false) {
			this.gnbService.indicator.next(this.pagePermission.indicator);
		}
	}

	private getPermission(url: string): PagePermission {

		if (url === '') {
			this.router.navigate([ 'view/error/403' ]);
			return;
		}

		const pagePermission: PagePermission = this.layoutService.getPagePermissionByPageUrl(url);

		if (_.isUndefined(pagePermission)) {

			this.index--;

			const urls: string[] = url.split(`/`);

			let urlParam: string = '';
			for (let index = 1; index < this.index; index++) {
				urlParam += `/${urls[ index ]}`;
			}

			this.getPermission(urlParam)
		}

		if (_.isUndefined(pagePermission) === false) {
			this.pagePermission = pagePermission;
			this.gnbService.permission = this.pagePermission;
		}
	}

}
